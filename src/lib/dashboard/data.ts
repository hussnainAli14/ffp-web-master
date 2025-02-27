'use server';

import { ListingByCategory, PRODUCT_STATUS, UserByCity, UserByCountry, QueryData, USER_TYPE } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

export async function getListingByCategory(
  params?: {
    countries?: number[],
    cities?: number[],
    limit?: number,
  }
): Promise<QueryData<ListingByCategory>> {
  const client = await pool.connect();

  try {
    let listingsQuery = `
      SELECT 
        c.name AS category,
        COUNT(p.id) AS count
      FROM 
        categories c
      JOIN 
        products p ON c.id = p.category_id
      WHERE 
        c.deleted_at IS NULL AND 
        p.deleted_at IS NULL AND 
        p.status = $1
      
    `;
    let paramsCount = 1;
    const queryParams: (PRODUCT_STATUS | number[] | number)[] = [PRODUCT_STATUS.ACTIVE];

    if (params?.countries?.length) {
      paramsCount++;
      listingsQuery += ` AND p.country_id = ANY($${paramsCount})`;
      queryParams.push(params.countries);
    }

    if (params?.cities?.length) {
      paramsCount++;
      listingsQuery += ` AND p.city_id = ANY($${paramsCount})`;
      queryParams.push(params.cities);
    }

    listingsQuery += ' GROUP BY c.name';

    if (params?.limit) {
      paramsCount++;
      listingsQuery += ` LIMIT $${paramsCount}`;
      queryParams.push(params.limit);
    }

    listingsQuery += ';';

    const listings = await client.query(listingsQuery, queryParams);

    const total = await client.query(
      `
        SELECT
          COUNT(p.id) AS count
        FROM 
          products p
        WHERE
          p.deleted_at IS NULL AND 
          p.status = $1;
      `,
      [PRODUCT_STATUS.ACTIVE]
    );

    return {
      data: {
        listings: listings.rows.sort((a, b) => b.count - a.count),
        total: total.rows[0].count,
      },
    };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getUserByCountry(
  params: {
    type: USER_TYPE,
    countries?: number[],
    cities?: number[],
    limit?: number,
  }
): Promise<QueryData<UserByCountry>> {
  const client = await pool.connect();

  try {
    const isProvider = params.type === USER_TYPE.PROVIDER;
    let userQuery = `
      SELECT
        co.id,
        co.name AS country,
        COUNT(u.id) AS count
      FROM
        place_countries co
      JOIN
        users u ON co.id = u.country_id
      WHERE
        u.deleted_at IS NULL AND
        u.type = $1
    `;

    let paramsCount = 1;
    const queryParams: (USER_TYPE | number[] | number)[] = [params.type];

    if (params?.countries?.length) {
      paramsCount++;
      userQuery += ` AND u.country_id = ANY($${paramsCount})`;
      queryParams.push(params.countries);
    }

    if (params?.cities?.length) {
      paramsCount++;
      userQuery += ` AND u.city_id = ANY($${paramsCount})`;
      queryParams.push(params.cities);
    }

    userQuery += ' GROUP BY co.id';

    if (params?.limit) {
      paramsCount++;
      userQuery += ` LIMIT $${paramsCount}`;
      queryParams.push(params.limit);
    }

    userQuery += ';';

    const users = await client.query(userQuery, queryParams);

    const summary = await client.query(
      `
        SELECT
          COUNT(u.id) AS total,
          COUNT(CASE WHEN u.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) AS new
        FROM
          users u
        WHERE 
          u.deleted_at IS NULL AND 
          u.type = $1;
      `,
      [params.type]
    );

    return {
      data: {
        summary: [
          { 'category': `Total ${isProvider ? 'Providers' : 'Users'}`, 'count': summary.rows[0].total },
          { 'category': `New ${isProvider ? 'Providers' : 'Users'} this Month`, 'count': summary.rows[0].new },
        ],
        countries: users.rows,
      },
    };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getUserByCity(
  params: {
    type: USER_TYPE,
    countries?: number[],
    cities?: number[],
  }
): Promise<QueryData<UserByCity>> {
  const client = await pool.connect();

  try {
    let usersQuery = `
      SELECT
        ci.name AS city,
        COUNT(u.id)
      FROM
        place_cities ci
      JOIN
        users u ON ci.id = u.city_id
      WHERE
        u.deleted_at IS NULL AND
        u.type = $1
    `;

    let paramsCount = 1;
    const queryParams: (USER_TYPE | number[])[] = [params.type];

    if (params?.countries?.length) {
      paramsCount++;
      usersQuery += ` AND u.country_id = ANY($${paramsCount})`;
      queryParams.push(params.countries);
    }

    if (params?.cities?.length) {
      paramsCount++;
      usersQuery += ` AND u.city_id = ANY($${paramsCount})`;
      queryParams.push(params.cities);
    }

    usersQuery += ' GROUP BY ci.id;';

    const users = await client.query(usersQuery, queryParams);

    return {
      data: {
        cities: users.rows,
      },
    };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}