'use server';

import { QueryResult } from 'pg';

import { City, Country, QueryData, Region } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

const getRegions = async (): Promise<QueryData<Region[]>> => {
  const client = await pool.connect();
  try {
    const data: QueryResult<Region> = await client.query(
      'SELECT * FROM regions;'
    );

    return { data: data.rows };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
};

const getCountries = async (): Promise<QueryData<Country[]>> => {
  const client = await pool.connect();
  try {
    const data: QueryResult<Country> = await client.query(
      'SELECT * FROM countries;'
    );

    return { data: data.rows };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
};

const getCountriesByRegion = async (
  { regionId }: { regionId: number }
): Promise<QueryData<Country[]>> => {
  const client = await pool.connect();
  try {
    const data: QueryResult<Country> = await client.query(
      `
        SELECT *
        FROM countries
        WHERE region_id = $1;
      `,
      [regionId]
    );

    return { data: data.rows };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
};


const getCitiesByCountry = async (
  { countryId }: { countryId: number }
): Promise<QueryData<City[]>> => {
  const client = await pool.connect();
  try {
    const data: QueryResult<City> = await client.query(
      `
        SELECT *
        FROM cities
        WHERE country_id = $1;
      `,
      [countryId]
    );

    return { data: data.rows };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
};

export {
  getRegions,
  getCountries,
  getCountriesByRegion,
  getCitiesByCountry,
};
