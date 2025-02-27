'use server';

import { QueryData } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

export async function addSubscriber({ email }: { email: string }): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const data = await client.query(
      `
          SELECT email
          FROM subscribers
          WHERE email = $1;
        `,
      [email]
    );

    if (data.rowCount && data?.rowCount > 0) {
      throw new Error('Email already subscribed');
    }

    await client.query(
      `
          INSERT INTO subscribers (email, created_at)
          VALUES ($1, NOW());
        `,
      [email]
    );

    await client.query('COMMIT');

    return { data: 'Successfully subscribe your email' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}