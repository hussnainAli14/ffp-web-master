'use server';

import { QueryResult } from 'pg';

import { PRODUCT_STATUS, ProductListCardProps, QueryData, USER_TYPE } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

import { authorize } from '../auth/data';
import { ProductListCardQuery } from '../product/data';

type ListBookmarkParams = {
  categoryIds?: string[],
  subCategoryIds?: string[],
  countries?: number[],
  cities?: number[],
  query?: string,
  pagination?: {
    limit?: number,
    offset?: number,
  },
}

export async function addToBookmark({ productId, token }: { productId: string, token?: string }): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    const { data: decodedUser } = await authorize({ types: [USER_TYPE.USER], token });

    if (decodedUser) {
      await client.query(
        `
          INSERT INTO
            product_bookmarks (user_id, product_id)
          VALUES
            ($1, $2)
        `,
        [decodedUser.id, productId]
      );
    }

    return { data: 'Successfully add to bookmark' };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeFromBookmark({ productId, token }: { productId: string, token?: string }): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    const { data: decodedUser } = await authorize({ types: [USER_TYPE.USER], token });

    if (decodedUser) {
      await client.query(
        `
          DELETE FROM
            product_bookmarks
          WHERE
            user_id = $1 AND product_id = $2;
        `,
        [decodedUser.id, productId]
      );
    }

    return { data: 'Successfully remove from bookmark' };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getListBookmarkProduct(params: ListBookmarkParams, token?: string): Promise<QueryData<ProductListCardProps[]>> {
  const client = await pool.connect();

  try {
    const { data: userData } = await authorize({ token, types: [USER_TYPE.USER, USER_TYPE.ADMIN] });

    if (userData) {
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
      FROM
        products p
      JOIN
        product_bookmarks pb ON p.id = pb.product_id
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
        AND p.status = $1
        AND pb.user_id = $2
    `;
      const queryParams: (string | string[] | number | number[] | PRODUCT_STATUS)[] = [
        PRODUCT_STATUS.ACTIVE, userData.id,
      ];
      let countParams = 2;

      if (params.categoryIds?.length) {
        countParams++;
        query += ` AND c.id = ANY($${countParams})`;
        queryParams.push(params.categoryIds);
      }

      if (params.subCategoryIds?.length) {
        countParams++;
        query += ` AND sc.id = ANY($${countParams})`;
        queryParams.push(params.subCategoryIds);
      }

      if (params.countries?.length) {
        countParams++;
        query += ` AND p.country_id = ANY($${countParams})`;
        queryParams.push(params.countries);
      }

      if (params.cities?.length) {
        countParams++;
        query += ` AND p.city_id = ANY($${countParams})`;
        queryParams.push(params.cities);
      }

      if (params.query) {
        countParams++;
        query += ` AND
        (
          LOWER(p.name) LIKE LOWER($${countParams}) OR
          LOWER(re.name) LIKE LOWER($${countParams}) OR
          LOWER(co.name) LIKE LOWER($${countParams}) OR
          LOWER(ci.name) LIKE LOWER($${countParams}) OR
          LOWER(c.name) LIKE LOWER($${countParams}) OR
          LOWER(sc.name) LIKE LOWER($${countParams})
        )
      `;
        queryParams.push(`%${params.query}%`);
      }

      query += ' GROUP BY p.id, u.id, c.id, sc.id, pi.id, re.id, co.id, ci.id, r.total_reviews, r.average_score, pb.id';
      query += ' ORDER BY pb.created_at DESC';

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
      }));

      return { data };
    }

    return { message: 'Unauthorized' };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }

}