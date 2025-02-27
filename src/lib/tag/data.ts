'use server';

import { QueryResult } from 'pg';

import { QueryData, TagProps, USER_TYPE } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

import { authorize } from '../auth/data';

type TagQuery = {
  id: string,
  name: string,
  description: string,
};

export async function getTags(): Promise<QueryData<TagProps[]>> {
  const client = await pool.connect();

  try {
    const data: QueryResult<TagQuery> = await client.query(
      `
        SELECT id, name, description
        FROM tags
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC;
      `);

    const tags: TagProps[] = data.rows.map((tag) => ({
      tagId: tag.id,
      tagName: tag.name,
      description: tag.description,
    }));

    return { data: tags };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getTagDetail({ tagId }: { tagId: string }, token?: string): Promise<QueryData<TagProps>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });
    
    const data: QueryResult<TagQuery> = await client.query(
      `
        SELECT id, name, description
        FROM tags
        WHERE deleted_at IS NULL AND id = $1;
      `,
      [tagId]
    );

    if (data.rowCount === 0) {
      throw new Error('Tag not found');
    }

    const tags: TagProps[] = data.rows.map((tag) => ({
      tagId: tag.id,
      tagName: tag.name,
      description: tag.description,
    }));

    return { data: tags[0] };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function addTag({ tagName, description }: TagProps, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        INSERT INTO tags (name, description, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING id;
      `,
      [tagName, description]
    );

    await client.query('COMMIT');

    return { data: `Successfully add "${tagName}" tag` };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function editTag({ tagId, tagName, description }: TagProps, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE tags 
        SET name = $1, description = $2, updated_at = NOW()
        WHERE id = $3;
      `,
      [tagName, description, tagId]
    );

    await client.query('COMMIT');

    return { data: `Successfully edit "${tagName}" tag` };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeTag({ tagId }: { tagId: string }, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(
      `
        UPDATE tags 
        SET deleted_at = NOW()
        WHERE id = $1;
      `,
      [tagId]
    );

    await client.query('COMMIT');

    return { data: 'Successfully remove tag' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}