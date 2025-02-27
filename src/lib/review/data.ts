'use server';

import { QueryResult } from 'pg';

import { ListReviewProps, QueryData, ReviewParams, ReviewProps, ReviewSummary, SORT_REVIEW, USER_TYPE } from '@ffp-web/app/index.types';
import { authorize, decodeToken } from '@ffp-web/lib/auth/data';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

export async function addReview(payload: ReviewProps, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { data: userData } = await authorize({ token, types: [USER_TYPE.USER] });

    if (userData) {
      const reviewResult = await client.query(
        `
          INSERT INTO reviews
            (product_id, user_id, overall_score, staff_score, facilities_score, value_for_money_score, review)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id;
        `,
        [
          payload.productId,
          userData.id,
          payload.overallScore,
          payload.staffScore,
          payload.facilitesScore,
          payload.valueForMoneyScore,
          payload.review,
        ]
      );

      const reviewId = reviewResult.rows[0].id;

      if (payload.images.length) {
        await client.query(
          `
            INSERT INTO review_images
              (review_id, image_uri)
            VALUES
              ($1, UNNEST($2::TEXT[])); 
          `,
          [reviewId, payload.images]
        );
      }
    }

    await client.query('COMMIT');

    return { data: 'Your review successfully added to this listing' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function editReview(payload: ReviewProps, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { data: userData } = await authorize({ token, types: [USER_TYPE.USER] });

    if (userData) {
      await client.query(
        `
          UPDATE reviews
          SET
            overall_score = $2,
            staff_score = $3,
            facilities_score = $4,
            value_for_money_score = $5,
            review = $6,
            updated_at = NOW()
          WHERE
            id = $1;
        `,
        [
          payload.reviewId,
          payload.overallScore,
          payload.staffScore,
          payload.facilitesScore,
          payload.valueForMoneyScore,
          payload.review,
        ]
      );

      await client.query(
        `
          DELETE FROM review_images
          WHERE review_id = $1;
        `,
        [payload.reviewId]
      );

      if (payload.images.length) {
        await client.query(
          `
            INSERT INTO review_images
              (review_id, image_uri)
            VALUES
              ($1, UNNEST($2::TEXT[])); 
          `,
          [payload.reviewId, payload.images]
        );
      }
    }

    await client.query('COMMIT');

    return { data: 'Your review successfully edited' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeReview(payload: Pick<ReviewProps, 'reviewId'>, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { data: userData } = await authorize({ token, types: [USER_TYPE.USER] });

    if (userData) {
      await client.query(
        `
          UPDATE reviews
          SET deleted_at = NOW()
          WHERE id = $1;
        `,
        [payload.reviewId]
      );
    }

    await client.query('COMMIT');

    return { data: 'Your review successfully deleted from this listing' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getListReview(params: ReviewParams, token?: string): Promise<QueryData<ListReviewProps[]>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const reviews: ListReviewProps[] = [];

    const { data: userData } = await decodeToken({ token });

    let query = `
        SELECT 
          r.id AS "reviewId",
          r.product_id AS "productId",
          p.name AS "productName",
          r.user_id AS "userId",
          u.full_name AS "userName",
          r.overall_score AS "overallScore",
          r.staff_score AS "staffScore",
          r.facilities_score AS "facilitesScore",
          r.value_for_money_score AS "valueForMoneyScore",
          r.review,
          r.created_at AS "createdAt",
          r.updated_at AS "updatedAt",
          ARRAY_AGG(ri.image_uri) AS images
        FROM
          reviews r
        LEFT JOIN
          review_images ri ON r.id = ri.review_id
        LEFT JOIN
          products p ON r.product_id = p.id
        LEFT JOIN
          users u ON r.user_id = u.id
        WHERE
          r.deleted_at IS NULL
      `;
    let paramsCount = 0;
    const queryParams: (string | number | number[] | SORT_REVIEW)[] = [];

    if (params.productId) {
      paramsCount++;
      query += ` AND r.product_id = $${paramsCount}`;
      queryParams.push(params.productId);
    }

    if (params.isThisUser && userData) {
      paramsCount++;
      query += ` AND r.user_id = $${paramsCount}`;
      queryParams.push(userData.id);
    }

    if (params.query) {
      paramsCount++;
      query += ` AND
        (
          LOWER(r.review) LIKE LOWER($${paramsCount}) OR
          LOWER(p.name) LIKE LOWER($${paramsCount}) OR
          LOWER(u.full_name) LIKE LOWER($${paramsCount})
        )
      `;
      queryParams.push(`%${params.query}%`);
    }

    if (params.rating?.length) {
      paramsCount++;
      query += ` AND (
        (r.overall_score = ANY($${paramsCount})) OR
        (r.staff_score = ANY($${paramsCount})) OR
        (r.facilities_score = ANY($${paramsCount})) OR
        (r.value_for_money_score = ANY($${paramsCount}))
      )`;
      queryParams.push(params.rating);
    }

    paramsCount++;
    query += `
        GROUP BY r.id, p.id, u.id
        ORDER BY 
          CASE WHEN $${paramsCount} = '${SORT_REVIEW.HIGHEST}' THEN r.overall_score END DESC,
          CASE WHEN $${paramsCount} = '${SORT_REVIEW.LOWEST}' THEN r.overall_score END ASC,
          CASE WHEN $${paramsCount} = '${SORT_REVIEW.NEWEST}' THEN r.created_at END DESC,
          CASE WHEN $${paramsCount} = '${SORT_REVIEW.OLDEST}' THEN r.created_at END ASC
      `;
    queryParams.push(params.sortBy);

    if (params.limit) {
      paramsCount++;
      query += ` LIMIT $${paramsCount}`;
      queryParams.push(params.limit);
    }

    query += ';';

    const reviewResult: QueryResult<ListReviewProps> = await client.query(query, queryParams);

    const mappedReview = reviewResult.rows
      .map(review => ({
        ...review,
        userId: review.userId === userData?.id ? review.userId : undefined,
        images: review.images[0] ? review.images : [],
      }));

    reviews.push(...mappedReview);

    await client.query('COMMIT');

    return { data: reviews };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getReviewSummary({ productId }: { productId: string }): Promise<QueryData<ReviewSummary>> {
  const client = await pool.connect();

  try {
    const summary = await client.query(
      `
        SELECT 
          COUNT(*) AS "reviewTotal",
          COALESCE(AVG(overall_score), 0) AS "reviewScore"
        FROM reviews
        WHERE product_id = $1 AND deleted_at IS NULL;
      `,
      [productId]
    );

    return {
      data: {
        reviewTotal: Number(summary.rows[0].reviewTotal),
        reviewScore: Number(summary.rows[0].reviewScore),
      },
    };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}