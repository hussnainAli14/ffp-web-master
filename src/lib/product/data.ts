'use server';

import { QueryResult } from 'pg';

import { CONTENT_TYPE, CTA_TYPE, PRODUCT_STATUS, ProductDetailProps, ProductListCardProps, ProductListProps, QueryData, USER_TYPE } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

import { authorize } from '../auth/data';

type GetListParams = {
  status: PRODUCT_STATUS,
  countries?: number[],
  cities?: number[],
  provider?: string,
}

type ProductDetailQuery = {
  product_id: string,
  parent_product_id: string,
  product_name: string,
  summary: string,
  video_url?: string,
  starting_price?: number,
  currency: string,
  status: PRODUCT_STATUS,
  region_id: number,
  region_name: string,
  country_id: number,
  country_name: string,
  city_id: number,
  city_name: string,
  created_at: string,
  updated_at: string,
  provider_id: string,
  provider_name: string,
  business_name: string,
  category_id: string,
  category_name: string,
  sub_category_id: string,
  sub_category_name: string,
  tags: { tagId: string, tagName: string }[],
  operational_hours: { day: number, isOpen: boolean, startHour?: string, endHour?: string }[],
  quick_details: { detailType: string, detailValue: string, index: number }[],
  contents: { contentType: CONTENT_TYPE, title: string, details: string[], index: number }[];
  cta_type: CTA_TYPE,
  cta_url: string,
  images: { index: number, image: string }[],
}

export async function addProduct(params: ProductDetailProps, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({
      token,
      types: params.status === PRODUCT_STATUS.PENDING ? [USER_TYPE.ADMIN, USER_TYPE.PROVIDER] : [USER_TYPE.ADMIN],
    });

    if (params.parentProductId) {
      await client.query(
        `
          DELETE FROM products
          WHERE parent_product_id IS NOT NULL AND parent_product_id = $1 AND status = $2;
        `,
        [params.parentProductId, PRODUCT_STATUS.PENDING]
      );
    }
    const productResult = await client.query(
      `
        INSERT INTO products (
          parent_product_id, provider_id, category_id, sub_category_id, name, summary,
          region_id, region_name, country_id, country_name, city_id, city_name, video_url,
          starting_price, currency, cta_type, cta_url, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, NOW(), NOW()
        ) RETURNING id;
      `,
      [
        params.parentProductId || null,
        params.providerId,
        params.category.categoryId,
        params.subCategory.subCategoryId,
        params.name,
        params.summary,
        params.region.regionId,
        params.region.regionName,
        params.country.countryId,
        params.country.countryName,
        params.city.cityId,
        params.city.cityName,
        params.videoUrl || null,
        params.startingPrice || null,
        params.currency || null,
        params.callToAction.ctaType,
        params.callToAction.ctaUrl,
        params.status,
      ]
    );
    const productId = productResult.rows[0]?.id as string;

    if (params.tags && params.tags.length > 0) {
      const tagInserts = params.tags.map(tag => {
        return client.query(
          `
            INSERT INTO product_tags (product_id, tag_id)
            VALUES ($1, $2);
          `,
          [productId, tag.tagId]
        );
      });
      await Promise.all(tagInserts);
    }

    if (params.operationalHours && params.operationalHours.length > 0) {
      const operationalHourInserts = params.operationalHours.map(hour => {
        return client.query(
          `
            INSERT INTO product_operational_hours (product_id, day, is_open, start_hour, end_hour)
            VALUES ($1, $2, $3, $4, $5);
          `,
          [
            productId,
            hour.day,
            hour.isOpen,
            hour.startHour || null,
            hour.endHour || null,
          ]
        );
      });
      await Promise.all(operationalHourInserts);
    }

    if (params.quickDetails && params.quickDetails.length > 0) {
      const quickDetailInserts = params.quickDetails.map((detail, index) => {
        return client.query(
          `
            INSERT INTO product_quick_details (product_id, detail_type, detail_value, detail_index)
            VALUES ($1, $2, $3, $4);
          `,
          [productId, detail.detailType, detail.detailValue, (index + 1)]
        );
      });
      await Promise.all(quickDetailInserts);
    }

    if (params.contents && params.contents.length > 0) {
      const contentInserts = params.contents.map((content, index) => {
        return client.query(
          `
            INSERT INTO product_contents (product_id, content_type, title, details, content_index)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, title;
          `,
          [
            productId,
            content.contentType,
            content.title,
            content.contentType === 'TEXT' ? content.details[0] : null,
            (index + 1),
          ]
        );
      });

      const contentResults = await Promise.all(contentInserts);

      for (const contentResult of contentResults) {
        const contentId = contentResult.rows[0]?.id;
        const content = params.contents.find(c => c.title === contentResult.rows[0]?.title);

        if (content && content.contentType === 'LIST' && Array.isArray(content.details)) {
          const listItemInserts = content.details.map((item, index) => {
            return client.query(
              `
                INSERT INTO product_content_list_items (content_id, list_item, list_index)
                VALUES ($1, $2, $3);
              `,
              [contentId, item, (index + 1)]
            );
          });
          await Promise.all(listItemInserts);
        }
      }
    }

    if (params.images && params.images.length > 0) {
      const imageInserts = params.images.map((imageUrl, index) => {
        return client.query(
          `
            INSERT INTO product_images (product_id, image_url, image_index)
            VALUES ($1, $2, $3);
          `,
          [productId, imageUrl, (index + 1)]
        );
      });
      await Promise.all(imageInserts);
    }

    await client.query('COMMIT');

    return { data: productId };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getListProductByStatus(params: GetListParams): Promise<QueryData<ProductListProps[]>> {
  const client = await pool.connect();

  try {
    let query = `
    SELECT
      p.id AS product_id,
      p.parent_product_id,
      p.name AS product_name,
      u.full_name AS provider_name,
      u.business_name AS business_name,
      c.name AS category_name,
      sc.name AS sub_category_name,
      co.name AS country_name,
      ci.name AS city_name
    FROM
      products p
    JOIN
      users u ON p.provider_id = u.id
    JOIN
      categories c ON p.category_id = c.id
    JOIN
      sub_categories sc ON p.sub_category_id = sc.id
    JOIN
      place_countries co ON p.country_id = co.id
    JOIN
      place_cities ci ON p.city_id = ci.id
    WHERE
      p.deleted_at IS NULL AND p.status = $1`;

    const queryParam: (string | number[])[] = [params.status];
    let countParams = 1;

    if (params.countries && params.countries.length > 0) {
      countParams++;
      query += ` AND p.country_id = ANY($${countParams})`;
      queryParam.push(params.countries);
    }

    if (params.cities && params.cities.length > 0) {
      countParams++;
      query += ` AND p.city_id = ANY($${countParams})`;
      queryParam.push(params.cities);
    }

    if (params.provider) {
      countParams++;
      query += ` AND provider_id = $${countParams}`;
      queryParam.push(params.provider);
    }

    query += ' ORDER BY p.created_at DESC;';

    const data = await client.query(query, queryParam);

    const products: ProductListProps[] = data.rows.map(item => ({
      productId: item.product_id,
      parentProductId: item.parent_product_id,
      productName: item.product_name,
      providerName: item.provider_name,
      businessName: item.business_name,
      categoryName: item.category_name,
      subCategoryName: item.sub_category_name,
      countryName: item.country_name,
      cityName: item.city_name,
    }));

    return { data: products };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeProduct({ productId }: { productId: string }, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN, USER_TYPE.PROVIDER] });

    await client.query(
      `
        UPDATE products
        SET deleted_at = NOW()
        WHERE id = $1;
      `,
      [productId]
    );

    await client.query('COMMIT');

    return { data: 'Succesfully delete product' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function approveProduct(
  { productId, parentProductId }: { productId: string, parentProductId?: string }, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    if (parentProductId) {
      await client.query(
        `
          UPDATE products
          SET deleted_at = NOW()
          WHERE id = $1 AND status = $2;
        `,
        [parentProductId, PRODUCT_STATUS.ACTIVE]
      );
    }

    await client.query(
      `
        UPDATE products
        SET status = $1, parent_product_id = NULL, updated_at = NOW()
        WHERE id = $2 AND status = $3;
      `,
      [PRODUCT_STATUS.ACTIVE, productId, PRODUCT_STATUS.PENDING]
    );

    await client.query('COMMIT');

    return { data: 'Succesfully approve product' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function unlistProduct(
  { productId }: { productId: string }, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE products
        SET status = $1, parent_product_id = NULL, updated_at = NOW()
        WHERE id = $2 AND status = $3;
      `,
      [PRODUCT_STATUS.PENDING, productId, PRODUCT_STATUS.ACTIVE]
    );

    await client.query('COMMIT');

    return { data: 'Succesfully unlist product' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getProductDetail({ productId }: { productId: string }): Promise<QueryData<ProductDetailProps>> {
  const client = await pool.connect();

  try {
    const data: QueryResult<ProductDetailQuery> = await client.query(`
      SELECT
        p.id AS product_id,
        p.parent_product_id,
        p.name AS product_name,
        p.summary,
        p.video_url,
        p.starting_price,
        p.currency,
        p.status,
        p.region_id,
        re.name AS region_name,
        p.country_id,
        co.name AS country_name,
        p.city_id,
        ci.name AS city_name,
        p.created_at,
        p.updated_at,
        u.id AS provider_id,
        u.full_name AS provider_name,
        u.business_name AS business_name,
        c.id AS category_id,
        c.name AS category_name,
        sc.id AS sub_category_id,
        sc.name AS sub_category_name,
        JSON_AGG(DISTINCT jsonb_build_object(
          'tagId', t.id,
          'tagName', t.name
        )) FILTER (WHERE t.id IS NOT NULL) AS tags,
        JSON_AGG(DISTINCT jsonb_build_object(
          'day', oh.day,
          'isOpen', oh.is_open,
          'startHour', oh.start_hour,
          'endHour', oh.end_hour
        )) FILTER (WHERE oh.id IS NOT NULL) AS operational_hours,
        JSON_AGG(DISTINCT jsonb_build_object(
          'detailType', qd.detail_type,
          'detailValue', qd.detail_value,
          'index', qd.detail_index
        )) FILTER (WHERE qd.id IS NOT NULL) AS quick_details,
        JSON_AGG(DISTINCT jsonb_build_object(
          'index', pc.content_index,
          'contentType', pc.content_type,
          'title', pc.title,
          'details', CASE WHEN pc.content_type = 'LIST' THEN (
            SELECT ARRAY_AGG(cli.list_item)
            FROM product_content_list_items cli
            WHERE cli.content_id = pc.id
          ) ELSE ARRAY[pc.details] END
        )) FILTER (WHERE pc.id IS NOT NULL) AS contents,
        p.cta_type,
        p.cta_url,
        JSON_AGG(DISTINCT jsonb_build_object(
          'index', pi.image_index,
          'image', pi.image_url
        )) FILTER (WHERE pi.id IS NOT NULL) AS images
      FROM
        products p
      JOIN
        place_regions re ON p.region_id = re.id
      JOIN
        place_countries co ON p.country_id = co.id
      JOIN
        place_cities ci ON p.city_id = ci.id
      JOIN
        users u ON p.provider_id = u.id
      JOIN
        categories c ON p.category_id = c.id
      JOIN
        sub_categories sc ON p.sub_category_id = sc.id
      JOIN
        product_tags pt ON p.id = pt.product_id
      JOIN
        tags t ON pt.tag_id = t.id
      JOIN
        product_operational_hours oh ON p.id = oh.product_id
      JOIN
        product_quick_details qd ON p.id = qd.product_id
      JOIN
        product_contents pc ON p.id = pc.product_id
      JOIN
        product_images pi ON p.id = pi.product_id
      WHERE
        p.id = $1
        AND p.deleted_at IS NULL
      GROUP BY
        p.id, u.id, c.id, sc.id, re.id, co.id, ci.id;
    `,
      [
        productId,
      ]
    );

    const product = data.rows[0];

    const productDetail: ProductDetailProps = {
      productId: product.product_id,
      parentProductId: product.parent_product_id,
      providerId: product.provider_id,
      providerName: product.provider_name,
      businessName: product.business_name,
      category: {
        categoryId: product.category_id,
        categoryName: product.category_name,
      },
      subCategory: {
        subCategoryId: product.sub_category_id,
        subCategoryName: product.sub_category_name,
      },
      name: product.product_name,
      summary: product.summary,
      region: {
        regionId: product.region_id,
        regionName: product.region_name,
      },
      country: {
        countryId: product.country_id,
        countryName: product.country_name,
      },
      city: {
        cityId: product.city_id,
        cityName: product.city_name,
      },
      tags: product.tags ?? [],
      videoUrl: product.video_url,
      startingPrice: Number(product.starting_price),
      currency: product.currency,
      operationalHours: product.operational_hours ?? [],
      quickDetails: product.quick_details?.sort((a, b) => (a.index - b.index)) ?? [],
      contents: product.contents?.sort((a, b) => (a.index - b.index)) ?? [],
      callToAction: {
        ctaType: product.cta_type,
        ctaUrl: product.cta_url,
      },
      images: product.images?.sort((a, b) => (a.index - b.index))?.map(e => e.image) ?? [],
      status: product.status,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };

    return { data: productDetail };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function editProduct(params: ProductDetailProps, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({
      token,
      types: params.status === PRODUCT_STATUS.PENDING ? [USER_TYPE.ADMIN, USER_TYPE.PROVIDER] : [USER_TYPE.ADMIN],
    });

    const productResult = await client.query(`
      UPDATE
        products
      SET
        parent_product_id = $1,
        provider_id = $2,
        category_id = $3,
        sub_category_id = $4,
        name = $5,
        summary = $6,
        region_id = $7,
        region_name = $8,
        country_id = $9,
        country_name = $10,
        city_id = $11,
        city_name = $12,
        video_url = $13,
        starting_price = $14,
        currency = $15,
        cta_type = $16,
        cta_url = $17,
        updated_at = NOW()
      WHERE
        id = $18
      RETURNING id;
    `,
      [
        params.parentProductId || null,
        params.providerId,
        params.category.categoryId,
        params.subCategory.subCategoryId,
        params.name,
        params.summary,
        params.region.regionId,
        params.region.regionName,
        params.country.countryId,
        params.country.countryName,
        params.city.cityId,
        params.city.cityName,
        params.videoUrl || null,
        params.startingPrice || null,
        params.currency || null,
        params.callToAction.ctaType,
        params.callToAction.ctaUrl,
        params.productId,
      ]
    );

    if (productResult.rowCount === 0) {
      throw new Error('Product not found');
    }

    const productId = productResult.rows[0]?.id as string;

    await client.query(
      'DELETE FROM product_tags WHERE product_id = $1;',
      [productId]
    );
    if (params.tags && params.tags.length > 0) {
      const tagInserts = params.tags.map(tag => {
        return client.query(
          `
            INSERT INTO product_tags (product_id, tag_id)
            VALUES ($1, $2);
          `,
          [productId, tag.tagId]
        );
      });
      await Promise.all(tagInserts);
    }

    await client.query(
      'DELETE FROM product_operational_hours WHERE product_id = $1;',
      [productId]
    );
    if (params.operationalHours && params.operationalHours.length > 0) {
      const operationalHourInserts = params.operationalHours.map(hour => {
        return client.query(
          `INSERT INTO product_operational_hours (product_id, day, is_open, start_hour, end_hour)
          VALUES ($1, $2, $3, $4, $5);`,
          [
            productId,
            hour.day,
            hour.isOpen,
            hour.startHour || null,
            hour.endHour || null,
          ]
        );
      });
      await Promise.all(operationalHourInserts);
    }

    await client.query(
      'DELETE FROM product_quick_details WHERE product_id = $1;',
      [productId]
    );
    if (params.quickDetails && params.quickDetails.length > 0) {
      const quickDetailInserts = params.quickDetails.map((detail, index) => {
        return client.query(
          `INSERT INTO product_quick_details (product_id, detail_type, detail_value, detail_index)
          VALUES ($1, $2, $3, $4);`,
          [productId, detail.detailType, detail.detailValue, (index + 1)]
        );
      });
      await Promise.all(quickDetailInserts);
    }

    await client.query(
      'DELETE FROM product_contents WHERE product_id = $1;',
      [productId]
    );
    if (params.contents && params.contents.length > 0) {
      const contentInserts = params.contents.map((content, index) => {
        return client.query(
          `
            INSERT INTO product_contents (product_id, content_type, title, details, content_index)
            VALUES ($1, $2, $3, $4, $5) RETURNING id, title;
          `,
          [
            productId,
            content.contentType,
            content.title,
            content.contentType === 'TEXT' ? content.details[0] : null,
            (index + 1),
          ]
        );
      });

      const contentResults = await Promise.all(contentInserts);

      for (const contentResult of contentResults) {
        const contentId = contentResult.rows[0]?.id;
        const content = params.contents.find(c => c.title === contentResult.rows[0]?.title);

        if (content && content.contentType === 'LIST' && Array.isArray(content.details)) {
          const listItemInserts = content.details.map((item, index) => {
            return client.query(
              `
                INSERT INTO product_content_list_items (content_id, list_item, list_index)
                VALUES ($1, $2, $3);
              `,
              [contentId, item, (index + 1)]
            );
          });
          await Promise.all(listItemInserts);
        }
      }
    }

    await client.query(
      'DELETE FROM product_images WHERE product_id = $1;',
      [productId]
    );
    if (params.images && params.images.length > 0) {
      const imageInserts = params.images.map((imageUrl, index) => {
        return client.query(
          `
            INSERT INTO product_images (product_id, image_url, image_index)
            VALUES ($1, $2, $3);
          `,
          [productId, imageUrl, (index + 1)]
        );
      });
      await Promise.all(imageInserts);
    }

    await client.query('COMMIT');

    return { data: 'Successfully update product detail' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

// website
type ProductListCardParams = {
  categoryId?: string,
  subCategoryId?: string,
  providerId?: string,
  countries?: number[],
  cities?: number[],
  query?: string,
  pagination?: {
    limit?: number,
    offset?: number,
  },
}

export type ProductListCardQuery = {
  product_id: string,
  product_name: string,
  starting_price?: string,
  currency: string,
  category_id: string,
  category_name: string,
  sub_category_id: string,
  sub_category_name: string,
  tags: { tagId: string, tagName: string }[],
  cta_type: string,
  cta_url: string,
  image_url: string,
  total_reviews: number,
  average_score: number,
}

export async function getProductListCard(params: ProductListCardParams): Promise<QueryData<ProductListCardProps[]>> {
  const client = await pool.connect();

  try {
    let query = `
      WITH review_summary AS (
        SELECT
          product_id,
          COUNT(*) AS total_reviews,
          COALESCE(AVG(overall_score), 0) AS average_score
        FROM reviews
        WHERE deleted_at IS NULL
        GROUP BY product_id
      )
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.starting_price,
        p.currency,
        c.id AS category_id,
        c.name AS category_name,
        sc.id AS sub_category_id,
        sc.name AS sub_category_name,
        JSON_AGG(DISTINCT jsonb_build_object(
          'tagId', t.id,
          'tagName', t.name
        )) FILTER (WHERE t.id IS NOT NULL) AS tags,
        p.cta_type,
        p.cta_url,
        pi.image_url,
        COALESCE(r.total_reviews, 0) AS total_reviews,
        COALESCE(r.average_score, 0) AS average_score
    `;
    const queryParams: (string | number | number[] | PRODUCT_STATUS)[] = [];
    let countParams = 0;

    const keywords = params?.query?.split(/\s+/).map(word => `${word}:*`).join(' | ') ?? '';
    countParams++;
    query += `, ts_rank_cd(p.search_vector, to_tsquery('english', $${countParams})) AS rank`;
    queryParams.push(keywords);

    countParams++;
    query += `
      FROM
        products p
      JOIN
        place_regions re ON p.region_id = re.id
      JOIN
        place_countries co ON p.country_id = co.id
      JOIN
        place_cities ci ON p.city_id = ci.id
      JOIN
        users u ON p.provider_id = u.id
      JOIN
        categories c ON p.category_id = c.id
      JOIN
        sub_categories sc ON p.sub_category_id = sc.id
      JOIN
        product_images pi ON p.id = pi.product_id AND pi.image_index = 1
      LEFT JOIN
        product_tags pt ON p.id = pt.product_id
      LEFT JOIN
        tags t ON pt.tag_id = t.id
      LEFT JOIN
        review_summary r ON p.id = r.product_id
      WHERE
        p.deleted_at IS NULL
        AND p.status = $${countParams}
    `;
    queryParams.push(PRODUCT_STATUS.ACTIVE);

    if (params.categoryId) {
      countParams++;
      query += ` AND c.id = $${countParams}`;
      queryParams.push(params.categoryId);
    }

    if (params.subCategoryId) {
      countParams++;
      query += ` AND sc.id = $${countParams}`;
      queryParams.push(params.subCategoryId);
    }

    if (params.countries && params.countries.length > 0) {
      countParams++;
      query += ` AND p.country_id = ANY($${countParams})`;
      queryParams.push(params.countries);
    }

    if (params.cities && params.cities.length > 0) {
      countParams++;
      query += ` AND p.city_id = ANY($${countParams})`;
      queryParams.push(params.cities);
    }

    // this query for matched word
    // if (params.query) {
    //   const keywords = params.query.split(/\s+/).map(word => `${word}:*`).join(' | ');
    //   countParams++;
    //   query += ` AND p.search_vector @@ to_tsquery('english', $${countParams})`;
    //   queryParams.push(keywords);
    // }

    if (params.query) {
      countParams++;
      query += ` AND
        (
          LOWER(p.name) LIKE LOWER($${countParams}) OR
          LOWER(re.name) LIKE LOWER($${countParams}) OR
          LOWER(co.name) LIKE LOWER($${countParams}) OR
          LOWER(ci.name) LIKE LOWER($${countParams}) OR
          LOWER(c.name) LIKE LOWER($${countParams}) OR
          LOWER(sc.name) LIKE LOWER($${countParams}) OR
          LOWER(t.name) LIKE LOWER($${countParams})
        )
      `;
      queryParams.push(`%${params.query}%`);
    }

    query += ' GROUP BY p.id, u.id, c.id, sc.id, pi.id, r.total_reviews, r.average_score, rank';

    query += ' ORDER BY r.total_reviews DESC NULLS LAST, r.average_score DESC NULLS LAST, rank DESC';

    if (typeof params.pagination?.limit === 'number') {
      countParams++;
      query += ` LIMIT $${countParams}`;
      queryParams.push(params.pagination.limit);
    }

    if (typeof params.pagination?.offset === 'number') {
      countParams++;
      query += ` OFFSET $${countParams}`;
      queryParams.push(params.pagination.offset);
    }

    query += ';';

    const result: QueryResult<ProductListCardQuery> = await client.query(query, queryParams);

    const categories = await client.query('SELECT id AS "categoryId", name AS "categoryName" FROM categories;');
    
    const data: ProductListCardProps[] = result.rows.map(item => ({
      productId: item.product_id,
      productName: item.product_name,
      startingPrice: Number(item.starting_price),
      currency: item.currency,
      categoryId: item.category_id,
      categoryName: item.category_name,
      subCategoryid: item.sub_category_id,
      subCategoryName: item.sub_category_name,
      tags: item.tags,
      ctaType: item.cta_type,
      ctaUrl: item.cta_url,
      imageUrl: item.image_url,
      reviewTotal: Number(item.total_reviews),
      reviewScore: Number(item.average_score),
      categoryList: categories.rows,
    }));

    return { data };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getSearchDetails(searchQuery: string) {
  const client = await pool.connect();
  try {
    // let activity = searchQuery;
    // let location = '';
    // if (searchQuery.toLowerCase().includes(' in ')) {
    //   const parts = searchQuery.split(/ in /i);
    //   activity = parts[0].trim();
    //   location = parts[1].trim();
    // }

    const sql = `
      SELECT 
        p.id::text as id, 
        p.name as suggestion,
        p.starting_price::text as suggestion_2,
        p.summary::text as suggestion_3,
        CONCAT_WS(', ', ci.name, cn.name) as detail,
        'product' as type
      FROM products p
      LEFT JOIN place_cities ci ON p.city_id = ci.id
      LEFT JOIN place_countries cn ON p.country_id = cn.id
      WHERE p.name ILIKE $1
      UNION
      SELECT 
        cat.id::text as id,
        cat.name as suggestion,
        cat.image::text as suggestion_2,
        cat.sequence::text as suggestion_3,
        'Category' as detail,
        'category' as type
      FROM categories cat
      WHERE cat.name ILIKE $1
      UNION
      SELECT 
        subcat.id::text as id,
        subcat.name as suggestion,
        subcat.category_id::text as suggestion_2,
        (SELECT cat.name FROM categories cat WHERE cat.id = subcat.category_id) as suggestion_3,
        'Subcategory' as detail,
        'sub_category' as type
      FROM sub_categories subcat
      WHERE subcat.name ILIKE $1
      UNION
      SELECT 
        ci.id::text as id,
        ci.name as suggestion,
        ci.image::text as suggestion_2,
        ci.country_id::text as suggestion_3,
        (SELECT cn.name FROM place_countries cn WHERE cn.id = ci.country_id) as detail,
        'city' as type
      FROM place_cities ci
      WHERE ci.name ILIKE $1
      UNION
      SELECT 
        cn.id::text as id,
        cn.name as suggestion,
        cn.subregion::text as suggestion_2,
        cn.region::text as suggestion_3,
        'Country' as detail,
        'country' as type
      FROM countries cn
      WHERE cn.name ILIKE $1
      UNION
      SELECT 
        r.id::text as id,
        r.name as suggestion,
        r.flag::text as suggestion_2,
        r.updated_at::text as suggestion_3,
        'Region' as detail,
        'region' as type
      FROM regions r
      WHERE r.name ILIKE $1
      ORDER BY suggestion
      LIMIT 7;
    `;

    const params = [`%${searchQuery}%`];
    const result = await client.query(sql, params);

    return { data: result.rows };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return { data: [], error: 'Error executing query' };
  } finally {
    client.release();
  }
}
    // Removed console statement
export async function fetchFilterData() {
  const client = await pool.connect();
  try {
    const categoriesQuery = `
      SELECT id, name, 'category' as type FROM categories;
    `;
    const subcategoriesQuery = `
      SELECT id, name, 'subcategory' as type FROM sub_categories;
    `;
    const citiesQuery = `
      SELECT id, name, 'city' as type FROM place_cities;
    `;
    const countriesQuery = `
      SELECT id, name, 'country' as type FROM place_countries;
    `;

    const [categoriesResult, subcategoriesResult, citiesResult, countriesResult] = await Promise.all([
      client.query(categoriesQuery),
      client.query(subcategoriesQuery),
      client.query(citiesQuery),
      client.query(countriesQuery),
    ]);

    return {
      categories: categoriesResult.rows,
      subcategories: subcategoriesResult.rows,
      cities: citiesResult.rows,
      countries: countriesResult.rows,
    };
    
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error('Error fetching filters');
  } finally {
    client.release();
  }
}