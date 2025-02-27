'use server';
import jwt from 'jsonwebtoken';

import { QueryData, USER_TYPE } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';

type AuthParams = {
  token?: string,
  types: USER_TYPE[],
};

export async function authorize(
  { token, types }: AuthParams
): Promise<QueryData<{
  id: string,
  fullName: string,
  email: string,
  phoneNumber: string,
  type: USER_TYPE,
} | undefined>> {
  const client = await pool.connect();

  try {
    if (!token) {
      throw new Error('Unauthorized');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string,
      fullName: string,
      email: string,
      phoneNumber: string,
      type: USER_TYPE,
    };

    const hasAcces = types.includes(decoded.type);

    if (!hasAcces) {
      throw new Error('Unauthorized');
    }

    return { data: decoded };
  } catch {
    throw new Error('Unauthorized');
  } finally {
    client.release();
  }
}

export async function decodeToken(
  { token }: Pick<AuthParams, 'token'>
): Promise<QueryData<{
  id: string,
  fullName: string,
  email: string,
  phoneNumber: string,
  type: USER_TYPE,
} | undefined>> {
  const client = await pool.connect();

  try {
    if (!token) {
      return { message: 'No Token' };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string,
      fullName: string,
      email: string,
      phoneNumber: string,
      type: USER_TYPE,
    };

    return { data: decoded };
  } catch {
    return { message: 'No Token' };
  } finally {
    client.release();
  }
}