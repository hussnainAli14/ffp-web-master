'use server';

import { PlaceCityProps, PlaceCountryProps, PlaceHomeCityProps, PlaceRegionProps, PlaceRegionsAndCitiesProps, QueryData, USER_TYPE } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

import { authorize } from '../auth/data';

export async function getRegions(): Promise<QueryData<PlaceRegionProps[]>> {
  const client = await pool.connect();

  try {
    const data = await client.query(
      `
        SELECT
          id AS "regionId",
          name AS "regionName"
        FROM
          place_regions
        WHERE
          deleted_at IS NULL
        ORDER BY
          created_at DESC;
      `
    );

    const regions = data.rows as PlaceRegionProps[];

    return { data: regions };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getRegionDetail(
  { regionId }: Pick<PlaceRegionProps, 'regionId'>, token?: string
): Promise<QueryData<PlaceRegionProps>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    const data = await client.query(
      `
        SELECT
          id AS "regionId",
          name AS "regionName"
        FROM
          place_regions
        WHERE
          deleted_at IS NULL AND id = $1;
      `,
      [regionId]
    );

    if (data.rowCount === 0) {
      throw new Error('Region not foound');
    }

    const region = data.rows[0] as PlaceRegionProps;

    return { data: region };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function addRegion(
  { regionName }: Pick<PlaceRegionProps, 'regionName'>, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        INSERT INTO
          place_regions (name, created_at, updated_at)
        VALUES
          ($1, NOW(), NOW());
      `,
      [regionName]
    );

    return { data: `"${regionName}" successfully added as new region` };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function editRegion(
  { regionId, regionName }: PlaceRegionProps, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE
          place_regions
        SET
          name = $1, updated_at = NOW()
        WHERE
          id = $2;
      `,
      [regionName, regionId]
    );

    return { data: `"${regionName}" successfully edited` };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeRegion(
  { regionId }: Pick<PlaceRegionProps, 'regionId'>, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE
          place_regions
        SET
          deleted_at = NOW()
        WHERE
          id = $1;
      `,
      [regionId]
    );

    await client.query(
      `
        UPDATE
          place_countries
        SET
          deleted_at = NOW()
        WHERE
          region_id = $1;
      `,
      [regionId]
    );

    await client.query(
      `
        UPDATE
          place_cities
        SET
          deleted_at = NOW()
        WHERE
          region_id = $1;
      `,
      [regionId]
    );

    await client.query(
      `
        DELETE FROM
          place_home_cities
        WHERE
          region_id = $1;
      `,
      [regionId]
    );

    await client.query(
      `
        WITH ordered AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY display_order) AS new_order
          FROM place_home_cities
        )
        UPDATE
          place_home_cities
        SET
          display_order = ordered.new_order
        FROM
          ordered
        WHERE
          place_home_cities.id = ordered.id;
      `
    );

    await client.query('COMMIT');

    return { data: 'Successfully deleted' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getCountries(
  params?: { regionId?: number, regionIds?: number[] }
): Promise<QueryData<PlaceCountryProps[]>> {
  const client = await pool.connect();

  try {
    let query =
      `
        SELECT
          co.id AS "countryId",
          co.name AS "countryName",
          co.region_id AS "regionId",
          r.name AS "regionName"
        FROM
          place_countries co
        JOIN
          place_regions r ON co.region_id = r.id
        WHERE
          co.deleted_at IS NULL
      `;
    const queryParams: (number | number[])[] = [];
    let countParams = 0;

    if (params?.regionId) {
      countParams++;
      query += ` AND co.region_id = $${countParams}`;
      queryParams.push(params.regionId);
    }

    if (params?.regionIds?.length) {
      countParams++;
      query += ` AND co.region_id = ANY($${countParams})`;
      queryParams.push(params.regionIds);
    }

    query += ' ORDER BY co.created_at DESC;';

    const data = await client.query(query, queryParams);

    const countries = data.rows as PlaceCountryProps[];

    return { data: countries };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getCountryDetail(
  { countryId }: Pick<PlaceCountryProps, 'countryId'>, token?: string
): Promise<QueryData<PlaceCountryProps>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    const data = await client.query(
      `
        SELECT
          co.id AS "countryId",
          co.name AS "countryName",
          co.region_id AS "regionId",
          r.name AS "regionName"
        FROM
          place_countries co
        JOIN
          place_regions r ON co.region_id = r.id
        WHERE
          co.deleted_at IS NULL AND co.id = $1;
      `,
      [countryId]
    );

    if (data.rowCount === 0) {
      throw new Error('Country not found');
    }

    const country = data.rows[0] as PlaceCountryProps;

    return { data: country };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function addCountry(
  { regionId, countryName }: Omit<PlaceCountryProps, 'countryId'>, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        INSERT INTO
          place_countries (region_id, name, created_at, updated_at)
        VALUES
          ($1, $2, NOW(), NOW());
      `,
      [regionId, countryName]
    );

    return { data: `"${countryName}" successfully added as new country` };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function editCountry(
  { regionId, countryId, countryName }: PlaceCountryProps, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE
          place_countries
        SET
          region_id = $1, name = $2, updated_at = NOW()
        WHERE
          id = $3;
      `,
      [regionId, countryName, countryId]
    );

    return { data: `"${countryName}" successfully edited` };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeCountry(
  { countryId }: Pick<PlaceCountryProps, 'countryId'>, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE
          place_countries
        SET
          deleted_at = NOW()
        WHERE
          id = $1;
      `,
      [countryId]
    );

    await client.query(
      `
        UPDATE
          place_cities
        SET
          deleted_at = NOW()
        WHERE
          country_id = $1;
      `,
      [countryId]
    );

    await client.query(
      `
        DELETE FROM
          place_home_cities
        WHERE
          country_id = $1;
      `,
      [countryId]
    );

    await client.query(
      `
        WITH ordered AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY display_order) AS new_order
          FROM place_home_cities
        )
        UPDATE
          place_home_cities
        SET
          display_order = ordered.new_order
        FROM
          ordered
        WHERE
          place_home_cities.id = ordered.id;
      `
    );

    await client.query('COMMIT');

    return { data: 'Successfully deleted' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getCities(
  params?: { regionId?: number, regionIds?: number[], countryId?: number, countryIds?: number[] }
): Promise<QueryData<PlaceCityProps[]>> {
  const client = await pool.connect();

  try {
    let query =
      `
        SELECT
          ci.id AS "cityId",
          ci.name AS "cityName",
          ci.country_id AS "countryId",
          co.name AS "countryName",
          ci.region_id AS "regionId",
          r.name AS "regionName",
          ci.image AS image,
          ci.is_show_on_home AS "isShowOnHome"
        FROM
          place_cities ci
        JOIN
          place_countries co ON ci.country_id = co.id
        JOIN
          place_regions r ON ci.region_id = r.id
        WHERE
          ci.deleted_at IS NULL
      `;
    const queryParams: (number | number[])[] = [];
    let countParams = 0;

    if (params?.regionId) {
      countParams++;
      query += ` AND ci.region_id = $${countParams}`;
      queryParams.push(params.regionId);
    }

    if (params?.regionIds?.length) {
      countParams++;
      query += ` AND ci.region_id = ANY($${countParams})`;
      queryParams.push(params.regionIds);
    }

    if (params?.countryId) {
      countParams++;
      query += ` AND ci.country_id = $${countParams}`;
      queryParams.push(params.countryId);
    }

    if (params?.countryIds?.length) {
      countParams++;
      query += ` AND ci.country_id = ANY($${countParams})`;
      queryParams.push(params.countryIds);
    }

    query += ' ORDER BY ci.created_at DESC;';

    const data = await client.query(query, queryParams);

    const cities = data.rows as PlaceCityProps[];

    return { data: cities };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getCityDetail(
  { cityId }: Pick<PlaceCityProps, 'cityId'>, token?: string
): Promise<QueryData<PlaceCityProps>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    const data = await client.query(
      `
        SELECT
          ci.id AS "cityId",
          ci.name AS "cityName",
          ci.country_id AS "countryId",
          co.name AS "countryName",
          ci.region_id AS "regionId",
          r.name AS "regionName",
          ci.image AS image,
          ci.is_show_on_home AS "isShowOnHome"
        FROM
          place_cities ci
        JOIN
          place_countries co ON ci.country_id = co.id
        JOIN
          place_regions r ON ci.region_id = r.id
        WHERE
          ci.deleted_at IS NULL AND ci.id = $1;
      `,
      [cityId]
    );

    if (data.rowCount === 0) {
      throw new Error('City not found');
    }

    const city = data.rows[0] as PlaceCityProps;

    return { data: city };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function addCity(
  { regionId, countryId, cityName, image }: Omit<PlaceCityProps, 'cityId'>, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        INSERT INTO
          place_cities (region_id, country_id, name, image, created_at, updated_at)
        VALUES
          ($1, $2, $3, $4, NOW(), NOW());
      `,
      [regionId, countryId, cityName, image]
    );

    return { data: `"${cityName}" successfully added as new city` };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function editCity(
  { regionId, countryId, cityId, cityName, image }: PlaceCityProps, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE
          place_cities
        SET
          region_id = $1, country_id = $2, name = $3, image = $4, updated_at = NOW()
        WHERE
          id = $5;
      `,
      [regionId, countryId, cityName, image, cityId]
    );

    return { data: `"${cityName}" successfully edited` };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeCity(
  { cityId }: Pick<PlaceCityProps, 'cityId'>, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE
          place_cities
        SET
          deleted_at = NOW()
        WHERE
          id = $1;
      `,
      [cityId]
    );

    await client.query(
      `
        DELETE FROM
          place_home_cities
        WHERE
          city_id = $1;
      `,
      [cityId]
    );

    await client.query(
      `
        WITH ordered AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY display_order) AS new_order
          FROM place_home_cities
        )
        UPDATE
          place_home_cities
        SET
          display_order = ordered.new_order
        FROM
          ordered
        WHERE
          place_home_cities.id = ordered.id;
      `
    );

    await client.query('COMMIT');

    return { data: 'Successfully deleted' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getHomeCities(): Promise<QueryData<PlaceHomeCityProps[]>> {
  const client = await pool.connect();

  try {
    const data = await client.query(
      `
        SELECT
          hci.id AS "homeCityId",
          hci.city_id AS "cityId",
          ci.name AS "cityName",
          hci.country_id AS "countryId",
          co.name AS "countryName",
          hci.region_id AS "regionId",
          r.name AS "regionName",
          ci.image,
          hci.display_order AS "displayOrder"
        FROM
          place_home_cities hci
        JOIN
          place_cities ci ON hci.city_id = ci.id
        JOIN
          place_countries co ON hci.country_id = co.id
        JOIN
          place_regions r ON hci.region_id = r.id
        GROUP BY
          hci.id, ci.id, co.id, r.id
        ORDER BY
          hci.display_order ASC;
      `
    );

    const homeCities = data.rows as PlaceHomeCityProps[];

    return { data: homeCities };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function addHomeCity(
  { regionId, countryId, cityId }: Pick<PlaceHomeCityProps, 'regionId' | 'countryId' | 'cityId'>, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    // get display order
    const displayOrder = await client.query(
      `
        SELECT
          COALESCE(MAX(display_order), 0) + 1 as new_display_order
        FROM
          place_home_cities;
      `
    );

    const newDisplayOrder = displayOrder?.rows[0]?.new_display_order ?? 1;

    // add row home cities
    await client.query(
      `
        INSERT INTO
          place_home_cities (region_id, country_id, city_id, display_order)
        VALUES
          ($1, $2, $3, $4);
      `,
      [regionId, countryId, cityId, newDisplayOrder]
    );

    // update status city
    const cities = await client.query(
      `
        UPDATE
          place_cities
        SET
          is_show_on_home = $1, updated_at = NOW()
        WHERE
          id = $2
        RETURNING
          name;
      `,
      [true, cityId]
    );

    const cityName = cities?.rows[0]?.name ?? '';

    await client.query('COMMIT');

    return { data: `"${cityName}" successfully added to homepage` };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeHomeCity(
  { homeCityId, cityId }: Pick<PlaceHomeCityProps, 'homeCityId' | 'cityId'>, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    // delete selected home cities
    await client.query(
      `
        DELETE FROM
          place_home_cities
        WHERE
          id = $1;
      `,
      [homeCityId]
    );

    // re-assign new display order
    await client.query(
      `
        WITH ordered AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY display_order) AS new_order
          FROM place_home_cities
        )
        UPDATE
          place_home_cities
        SET
          display_order = ordered.new_order
        FROM
          ordered
        WHERE
          place_home_cities.id = ordered.id;
      `
    );

    // update status city
    const cities = await client.query(
      `
        UPDATE
          place_cities
        SET
          is_show_on_home = $1, updated_at = NOW()
        WHERE
          id = $2
        RETURNING
          name;
      `,
      [false, cityId]
    );

    const cityName = cities?.rows[0]?.name ?? '';

    await client.query('COMMIT');

    return { data: `"${cityName}" successfully removed from homepage` };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function moveUpHomeCity(
  { currentOrder }: { currentOrder: number }, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE place_home_cities
        SET display_order = -99
        WHERE display_order = $1 - 1;
      `,
      [currentOrder]
    );

    await client.query(
      `
        UPDATE place_home_cities
        SET display_order = $1 - 1
        WHERE display_order = $1;
      `,
      [currentOrder]
    );

    await client.query(
      `
        UPDATE place_home_cities
        SET display_order = $1
        WHERE display_order = -99;
      `,
      [currentOrder]
    );

    await client.query('COMMIT');

    return { data: 'Successfully move up city' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function moveDownHomeCity(
  { currentOrder }: { currentOrder: number }, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE place_home_cities
        SET display_order = -99
        WHERE display_order = $1 + 1;
      `,
      [currentOrder]
    );

    await client.query(
      `
        UPDATE place_home_cities
        SET display_order = $1 + 1
        WHERE display_order = $1;
      `,
      [currentOrder]
    );

    await client.query(
      `
        UPDATE place_home_cities
        SET display_order = $1
        WHERE display_order = -99;
      `,
      [currentOrder]
    );

    await client.query('COMMIT');

    return { data: 'Successfully move down city' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getPlacesAndCities(): Promise<QueryData<PlaceRegionsAndCitiesProps[]>> {
  const client = await pool.connect();

  try {
    const data = await client.query(`
      SELECT 
        re.id AS "regionId", 
        re.name AS "regionName", 
        CASE
          WHEN COUNT(ci.id) = 0 THEN NULL
          ELSE JSON_AGG(
            JSON_BUILD_OBJECT(
              'cityId', ci.id,
              'cityName', ci.name,
              'image', ci.image
            )
            ORDER BY ci.name ASC
          ) END AS cities 
      FROM 
        place_regions re
      JOIN
        place_cities ci ON re.id = ci.region_id 
      WHERE
        re.deleted_at IS NULL AND ci.deleted_at IS NULL
      GROUP BY
        re.id, re.name;
    `);

    const placesAndCities = data.rows as PlaceRegionsAndCitiesProps[];

    return { data: placesAndCities };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}