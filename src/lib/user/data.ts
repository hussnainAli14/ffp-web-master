'use server';

import crypto from 'crypto';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { QueryResult } from 'pg';

import { AddUserProps, ListUserProps, QueryData, UserData, UserDetailProps, USER_TYPE, PRODUCT_STATUS, UserOnlyDataProps, USER_AGE_GROUP, USER_GENDER } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

import { authorize } from '../auth/data';
import { mailVerifyUser } from '../mailer/data';

type ListUserQuery = {
  id: string,
  full_name: string,
  email: string,
  country_name: string,
  city_name: string,
  type: USER_TYPE,
  is_approved: boolean,
  business_name?: string,
  password?: string,
  gender?: string,
  dob?: string,
  is_blocked: boolean,
};

type ListUserParams = {
  types: string[],
  countries?: number[],
  cities?: number[],
  gender?: USER_GENDER,
  ageGroup?: USER_AGE_GROUP,
  query?: string,
};

export async function login({ email, password, isUser }: { email: string; password: string, isUser?: boolean }): Promise<QueryData<UserData>> {
  const client = await pool.connect();

  try {
    const userQuery = `
      SELECT
        id,
        full_name AS "fullName",
        email,
        phone_number AS "phoneNumber",
        password,
        type,
        business_name AS "businessName",
        is_approved AS "isApproved",
        profile_picture AS "profilePicture",
        is_blocked AS "isBlocked"
      FROM users
      WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL;
    `;

    const data = await client.query(userQuery, [email]);

    if (data.rows.length === 0) {
      throw new Error('Email not found');
    }

    const user = data.rows[0];

    if (!user.isApproved) {
      throw new Error('Email not verified');
    }

    if (user.isBlocked) {
      throw new Error('BLOCKED');
    }

    if (isUser && [USER_TYPE.ADMIN, USER_TYPE.PROVIDER].includes(user?.type)) {
      throw new Error('Invalid email');
    }

    if (!isUser && [USER_TYPE.USER].includes(user?.type)) {
      throw new Error('Invalid email');
    }

    const isPasswordValid = await bcrypt?.compare(password, user?.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        type: user.type,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    const loginExpires = new Date();
    loginExpires.setDate(loginExpires.getDate() + 1);

    const bookmarks = await client.query(
      `
        SELECT
          *
        FROM
          product_bookmarks pb
        JOIN
          products p ON pb.product_id = p.id
        WHERE
          p.deleted_at IS NULL
          AND p.status = $1
          AND pb.user_id = $2;
      `,
      [PRODUCT_STATUS.ACTIVE, user.id]
    );

    const userLogin: UserData = {
      id: user.id,
      fullName: user.fullName,
      businessName: user.businessName,
      email: user.email,
      type: user.type,
      token,
      loginExpires: loginExpires.getTime(),
      bookmarks: bookmarks.rows.map(bookmark => bookmark.product_id),
      profilePicture: user.profilePicture ?? '',
    };

    return { data: userLogin };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function addUser(params: AddUserProps): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    const { userData } = params;

    await client.query('BEGIN');

    const userResult = await client.query(
      `
        SELECT email
        FROM users
        WHERE LOWER(email) LIKE LOWER($1) AND deleted_at IS NULL;
      `,
      [userData.email]
    );

    if (userResult.rowCount) {
      throw new Error('Email already registered');
    }

    const data = await client.query(
      `
      INSERT INTO users (
        full_name, email, phone_number, country_id, country_name,
        city_id, city_name, type, affiliate_type, business_name, phone_country, phone_code
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11, $12
      ) RETURNING id;
      `,
      [
        userData.fullName,
        userData.email,
        userData.phoneNumber || null,
        userData.countryId,
        userData.countryName,
        userData.cityId,
        userData.cityName,
        userData.type,
        userData.affiliateType ?? null,
        userData.businessName,
        userData.phoneCountry || null,
        userData.phoneCode || null,
      ]
    );

    const userId = data.rows[0]?.id as string;

    if (userData.userService) {
      const userService = await client.query(
        `
        INSERT INTO user_services (
          user_id, description, target_audience, service_location
        ) VALUES (
          $1, $2, $3, $4
        ) RETURNING id;
        `,
        [
          userId,
          userData.userService.description,
          userData.userService.targetAudience,
          userData.userService.serviceLocation,
        ]
      );

      if (userData.userService.categories) {
        const userServiceId = userService.rows[0]?.id as string;

        for (const category of userData.userService.categories) {
          await client.query(
            `
            INSERT INTO user_service_categories (
              user_service_id, category_id, name, image, sequence
            ) VALUES (
              $1, $2, $3, $4, $5
            );
            `,
            [
              userServiceId,
              category.categoryId,
              category.name,
              category.image,
              category.sequence,
            ]
          );
        }
      }
    }

    if (userData.userBusiness) {
      await client.query(
        `
        INSERT INTO user_businesses (
          user_id, operation_years, website, instagram, facebook,
          tiktok, youtube, snapchat, preferred_niche, registration_number,
          certification_or_licenses
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11
        );
        `,
        [
          userId,
          userData.userBusiness.operationYear || null,
          userData.userBusiness.website,
          userData.userBusiness.instagram,
          userData.userBusiness.facebook,
          userData.userBusiness.tiktok,
          userData.userBusiness.youtube,
          userData.userBusiness.snapchat,
          userData.userBusiness.preferredNiche,
          userData.userBusiness.registrationNumber,
          userData.userBusiness.certificationOrLicenses,
        ]
      );
    }

    await client.query('COMMIT');

    return { data: userId };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function addUserOnly(params: AddUserProps): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    const { userData } = params;

    await client.query('BEGIN');

    const userResult = await client.query(
      `
        SELECT email
        FROM users
        WHERE LOWER(email) LIKE LOWER($1) AND deleted_at IS NULL;
      `,
      [userData.email]
    );

    if (userResult.rowCount) {
      throw new Error('Email already registered');
    }

    if (!userData.password) {
      throw new Error('Password is required');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(verifyToken, 10);
    const tokenExpires = new Date();
    tokenExpires.setMonth(tokenExpires.getMonth() + 1); // expires in 1 month
    const tokenExpiresISO = tokenExpires.toISOString();

    const data = await client.query(
      `
      INSERT INTO users (
        full_name, email, phone_number, country_id, country_name, city_id, city_name,
        type, affiliate_type, business_name, phone_country, phone_code,
        password, password_reset_token, password_reset_token_expires
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15
      ) RETURNING id;
      `,
      [
        userData.fullName,
        userData.email,
        userData.phoneNumber || null,
        userData.countryId,
        userData.countryName,
        userData.cityId,
        userData.cityName,
        userData.type,
        userData.affiliateType ?? null,
        userData.businessName,
        userData.phoneCountry || null,
        userData.phoneCode || null,
        hashedPassword,
        hashedToken,
        tokenExpiresISO,
      ]
    );

    await mailVerifyUser({ email: userData.email, verifyToken });

    const userId = data.rows[0]?.id as string;

    await client.query('COMMIT');

    return { data: userId };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function editUser(params: AddUserProps): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    const { userData } = params;

    await client.query('BEGIN');

    const data = await client.query(
      `
        UPDATE
          users
        SET
          full_name = $1,
          email = $2,
          phone_number = $3,
          country_id = $4,
          country_name = $5,
          city_id = $6,
          city_name = $7,
          type = $8,
          affiliate_type = $9,
          business_name = $10,
          phone_country = $11,
          phone_code = $12
        WHERE
        id = $13
        RETURNING id;
      `,
      [
        userData.fullName,
        userData.email,
        userData.phoneNumber,
        userData.countryId,
        userData.countryName,
        userData.cityId,
        userData.cityName,
        userData.type,
        userData.affiliateType ?? null,
        userData.businessName,
        userData.phoneCountry || null,
        userData.phoneCode || null,
        userData.userId,
      ]
    );

    const userId = data.rows[0]?.id as string;

    if (userData.userService) {
      const userService = await client.query(
        `
          UPDATE
            user_services
          SET
            description = $1,
            target_audience = $2,
            service_location = $3
          WHERE
            user_id = $4
          RETURNING id;
        `,
        [
          userData.userService.description,
          userData.userService.targetAudience,
          userData.userService.serviceLocation,
          userId,
        ]
      );

      if (userData.userService.categories) {
        const userServiceId = userService.rows[0]?.id as string;

        await client.query(
          `
            DELETE FROM user_service_categories
            WHERE user_service_id = $1;
          `,
          [userServiceId]
        );

        for (const category of userData.userService.categories) {
          await client.query(
            `
              INSERT INTO user_service_categories (
                user_service_id, category_id, name, image, sequence
              ) VALUES (
                $1, $2, $3, $4, $5
              );
            `,
            [
              userServiceId,
              category.categoryId,
              category.name,
              category.image,
              category.sequence,
            ]
          );
        }
      }
    }

    if (userData.userBusiness) {
      await client.query(
        `
          UPDATE
            user_businesses
          SET
            operation_years = $1,
            website = $2,
            instagram = $3,
            facebook = $4,
            tiktok = $5,
            youtube = $6,
            snapchat = $7,
            preferred_niche = $8,
            registration_number = $9,
            certification_or_licenses = $10
          WHERE
            user_id = $11;
        `,
        [
          userData.userBusiness.operationYear || null,
          userData.userBusiness.website,
          userData.userBusiness.instagram,
          userData.userBusiness.facebook,
          userData.userBusiness.tiktok,
          userData.userBusiness.youtube,
          userData.userBusiness.snapchat,
          userData.userBusiness.preferredNiche,
          userData.userBusiness.registrationNumber,
          userData.userBusiness.certificationOrLicenses,
          userId,
        ]
      );
    }

    await client.query('COMMIT');

    return { data: userId };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function editUserOnly(params: UserOnlyDataProps, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.USER] });

    await client.query(
      `
        UPDATE
          users
        SET
          profile_picture = $1,
          full_name = $2,
          gender = $3,
          dob = $4,
          email = $5,
          phone_number = $6,
          phone_country = $7,
          phone_code = $8,
          country_id = $9,
          country_name = $10,
          nationality = $11
        WHERE
          id = $12;
      `,
      [
        params.profilePicture,
        params.fullName,
        params.gender,
        params.dob ? moment(params.dob).format('YYYY-MM-DD') : null,
        params.email,
        params.phoneNumber,
        params.phoneCountry,
        params.phoneCode,
        params.countryId,
        params.countryName,
        params.nationality,
        params.userId,
      ]
    );

    await client.query(
      `
        DELETE FROM user_interest
        WHERE user_id = $1;
      `,
      [params.userId]
    );
    if (params.interests?.length) {
      const interestInsert = params.interests.map(item => {
        return client.query(
          `
            INSERT INTO user_interest (
              user_id, sub_category_id
            ) VALUES (
              $1, $2
            );
          `,
          [params.userId, item.subCategoryId]
        );
      });
      await Promise.all(interestInsert);
    }

    await client.query('COMMIT');

    return { data: 'Profile successfully been updated' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getListUserByType(params: ListUserParams): Promise<QueryData<ListUserProps[]>> {
  const client = await pool.connect();

  try {
    let query = `
      SELECT
        id, full_name, business_name, email, country_name, city_name,
        type, is_approved, created_at, updated_at, password, gender, dob, is_blocked
      FROM
        users
      WHERE
        deleted_at IS NULL
    `;
    const queryParams = [];
    let paramsCount = 0;

    if (params.types?.length) {
      paramsCount++;
      query += ` AND type = ANY($${paramsCount})`;
      queryParams.push(params.types);
    }

    if (params.countries?.length) {
      paramsCount++;
      query += ` AND country_id = ANY($${paramsCount})`;
      queryParams.push(params.countries);
    }

    if (params.cities?.length) {
      paramsCount++;
      query += ` AND city_id = ANY($${paramsCount})`;
      queryParams.push(params.cities);
    }

    if (params.gender) {
      paramsCount++;
      query += ` AND gender = $${paramsCount}`;
      queryParams.push(params.gender);
    }

    if (params.ageGroup) {
      paramsCount++;
      query += ` AND dob IS NOT NULL AND (
        ($${paramsCount} = '${USER_AGE_GROUP.UNDER_18}' AND date_part('year', age(dob)) < 18)
        OR ($${paramsCount} = '${USER_AGE_GROUP.BETWEEN_18_24}' AND date_part('year', age(dob)) BETWEEN 18 AND 24)
        OR ($${paramsCount} = '${USER_AGE_GROUP.BETWEEN_25_34}' AND date_part('year', age(dob)) BETWEEN 25 AND 34)
        OR ($${paramsCount} = '${USER_AGE_GROUP.BETWEEN_35_44}' AND date_part('year', age(dob)) BETWEEN 35 AND 44)
        OR ($${paramsCount} = '${USER_AGE_GROUP.BETWEEN_45_54}' AND date_part('year', age(dob)) BETWEEN 45 AND 54)
        OR ($${paramsCount} = '${USER_AGE_GROUP.OVER_55}' AND date_part('year', age(dob)) >= 55)
      )`;
      queryParams.push(params.ageGroup);
    }

    if (params.query) {
      paramsCount++;
      query += ` AND (
        (LOWER(full_name) LIKE LOWER($${paramsCount})) OR
        (LOWER(email) LIKE LOWER($${paramsCount}))
      )`;
      queryParams.push(`%${params.query}%`);
    }

    query += ' ORDER BY created_at DESC;';

    const data: QueryResult<ListUserQuery> = await client.query(query, queryParams);

    const users: ListUserProps[] = data.rows.map((item) => ({
      userId: item.id,
      fullName: item.full_name,
      email: item.email,
      countryName: item.country_name,
      cityName: item.city_name,
      type: item.type,
      businessName: item.business_name ?? '',
      isApproved: item.is_approved,
      isPasswordCreated: !isEmpty(item.password),
      gender: item.gender,
      dob: item.dob ? moment(item.dob).format('YYYY-MM-DD') : undefined,
      isBlocked: item.is_blocked,
    }));

    return { data: users };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeUser({ userId }: { userId: string }, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(`
    UPDATE 
      users
    SET 
      deleted_at = NOW(),
      email = CONCAT(email, '-deleted-', NOW()::TEXT)
    WHERE 
      id = $1;
    `, [
      userId,
    ]);

    await client.query('COMMIT');

    return { data: 'Succesfully removed!' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function blockUser({ userId, currentState }: { userId: string, currentState: boolean }, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(`
    UPDATE 
      users
    SET 
      is_blocked = $2
    WHERE 
      id = $1;
    `, [
      userId, !currentState,
    ]);

    await client.query('COMMIT');

    return { data: 'Succesfully blocked/unblocked!' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getUserDetail({ userId }: { userId: string }): Promise<QueryData<UserDetailProps | null>> {
  const client = await pool.connect();

  try {
    const data: QueryResult = await client.query(
      `
      WITH user_service_data AS (
        SELECT
          us.id AS "userServiceId",
          us.user_id AS "userId",
          us.description,
          us.target_audience AS "targetAudience",
          us.service_location AS "serviceLocation",
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'userServiceCategryId', usc.id,
              'categoryId', usc.category_id,
              'name', usc.name,
              'image', usc.image,
              'sequence', usc.sequence
            )
          ) AS "categories"
        FROM user_services us
        LEFT JOIN user_service_categories usc ON us.id = usc.user_service_id
        WHERE us.deleted_at IS NULL
        GROUP BY us.id
      ),
      user_business_data AS (
        SELECT
          ub.id AS "userBusinessId",
          ub.user_id AS "userId",
          ub.operation_years AS "operationYear",
          ub.website,
          ub.instagram,
          ub.facebook,
          ub.tiktok,
          ub.youtube,
          ub.snapchat,
          ub.preferred_niche AS "preferredNiche",
          ub.registration_number AS "registrationNumber",
          ub.certification_or_licenses AS "certificationOrLicenses"
        FROM user_businesses ub
        WHERE ub.deleted_at IS NULL
      )
      SELECT
        u.id AS "userId",
        u.full_name AS "fullName",
        u.email,
        u.phone_country AS "phoneCountry",
        u.phone_code AS "phoneCode",
        u.phone_number AS "phoneNumber",
        u.country_id AS "countryId",
        u.country_name AS "countryName",
        u.city_id AS "cityId",
        u.city_name AS "cityName",
        u.type,
        u.affiliate_type AS "affiliateType",
        u.business_name AS "businessName",
        u.is_approved AS "isApproved",
        u.dob,
        u.gender,
        u.nationality,
        JSON_AGG(DISTINCT us.*) FILTER (WHERE us."userId" IS NOT NULL) AS "userService",
        JSON_AGG(DISTINCT ub.*) FILTER (WHERE ub."userId" IS NOT NULL) AS "userBusiness",
        COALESCE(JSON_AGG(
          JSON_BUILD_OBJECT(
            'subCategoryId', sc.id, 
            'subCategoryName', sc.name
          )
        ) FILTER (WHERE sc.id IS NOT NULL), '[]') AS interests
      FROM users u
      LEFT JOIN user_service_data us ON u.id = us."userId"
      LEFT JOIN user_business_data ub ON u.id = ub."userId"
      LEFT JOIN user_interest ui ON u.id = ui.user_id
      LEFT JOIN sub_categories sc ON ui.sub_category_id = sc.id
      WHERE u.id = $1
        AND u.deleted_at IS NULL
      GROUP BY u.id;
      `,
      [userId]
    );

    if (data.rows.length === 0) {
      return { data: null };
    }

    const row = data.rows[0];

    const userDetail: UserDetailProps = {
      userId: row.userId,
      fullName: row.fullName,
      email: row.email,
      phoneCountry: row.phoneCountry,
      phoneCode: row.phoneCode,
      phoneNumber: row.phoneNumber,
      countryId: row.countryId,
      countryName: row.countryName,
      cityId: row.cityId,
      cityName: row.cityName,
      businessName: row.businessName,
      type: row.type,
      affiliateType: row.affiliateType,
      userService: row.userService?.[0] ?? {},
      userBusiness: row.userBusiness?.[0] ?? {},
      isApproved: row.isApproved,
      dob: row.dob ? moment(row.dob).format('YYYY-MM-DD') : undefined,
      gender: row.gender,
      nationality: row.nationality,
      interests: row.interests?.[0]?.subCategoryId ? row.interests : [],
    };

    return { data: userDetail };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getUserOnlyDetail(token?: string): Promise<QueryData<UserOnlyDataProps>> {
  const client = await pool.connect();

  try {
    const { data: userData } = await authorize({ token, types: [USER_TYPE.USER] });

    if (!userData) {
      return { message: 'Unauthorized' };
    }

    const data: QueryResult = await client.query(
      `
        WITH interest_detail AS (
          SELECT
            ui.id,
            ui.user_id,
            ui.sub_category_id,
            sc.name AS sub_category_name
          FROM
            user_interest ui
          JOIN
            sub_categories sc ON ui.sub_category_id = sc.id
          WHERE
            sc.deleted_at IS NULL
        )
        SELECT
          u.id AS "userId",
          u.profile_picture AS "profilePicture",
          u.full_name AS "fullName",
          u.gender,
          u.dob,
          u.email,
          u.phone_country AS "phoneCountry",
          u.phone_code AS "phoneCode",
          u.phone_number AS "phoneNumber",
          u.country_id AS "countryId",
          u.country_name AS "countryName",
          u.nationality,
          COALESCE(JSON_AGG(
            JSON_BUILD_OBJECT(
              'subCategoryId', i.sub_category_id, 
              'subCategoryName', i.sub_category_name
            )
          ), '[]') AS interests
        FROM
          users u
        LEFT JOIN
          interest_detail i ON u.id = i.user_id
        WHERE
          u.id = $1
          AND u.deleted_at IS NULL
        GROUP BY u.id;
      `,
      [userData.id]
    );

    if (data.rows.length === 0) {
      return { message: 'User detail not found' };
    }

    const user = data.rows[0];

    const userDetail: UserOnlyDataProps = {
      userId: user.userId,
      profilePicture: user.profilePicture ?? '',
      fullName: user.fullName,
      gender: user.gender ?? '',
      dob: user.dob ? moment(user.dob).format('YYYY-MM-DD') : '',
      email: user.email,
      phoneCountry: user.phoneCountry,
      phoneCode: user.phoneCode,
      phoneNumber: user.phoneNumber,
      countryId: user.countryId,
      countryName: user.countryName,
      nationality: user.nationality ?? '',
      interests: user.interests?.[0]?.subCategoryId ? user.interests : [],
    };

    return { data: userDetail };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function generateResetToken({ email, isUser }: { email: string, isUser?: boolean }): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const user = await client.query(
      `
        SELECT email, type
        FROM users
        WHERE LOWER(email) LIKE LOWER($1) AND deleted_at IS NULL;
      `,
      [email]
    );

    if (user.rows.length === 0) {
      throw new Error('Email not registered');
    }

    if (isUser && [USER_TYPE.ADMIN, USER_TYPE.PROVIDER].includes(user?.rows[0]?.type)) {
      throw new Error('Email not registered.');
    }

    if (!isUser && [USER_TYPE.USER].includes(user?.rows[0]?.type)) {
      throw new Error('Email not registered.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const tokenExpires = new Date();
    tokenExpires.setMinutes(tokenExpires.getMinutes() + 10); // expires in 10 minutes
    const tokenExpiresISO = tokenExpires.toISOString();

    await client.query(`
      UPDATE
        users 
      SET
        password_reset_token = $1, password_reset_token_expires = $2
      WHERE
        email = $3;
    `,
      [hashedToken, tokenExpiresISO, email]
    );

    await client.query('COMMIT');

    return { data: resetToken };
  } catch (err) {
    await client.query('ROLLBACK');
    throw new Error(unpackError(err));
  } finally {
    client.release();
  }
}

export async function generateNewPasswordToken(email: string): Promise<QueryData<string>> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const user = await client.query(
      `
        SELECT email
        FROM users
        WHERE LOWER(email) LIKE LOWER($1) AND deleted_at IS NULL;
      `,
      [email]
    );

    if (user.rows.length === 0) {
      throw new Error('User not found');
    }

    const passwordToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(passwordToken, 10);
    const tokenExpires = new Date();
    tokenExpires.setMonth(tokenExpires.getMonth() + 1); // expires in 1 month
    const tokenExpiresISO = tokenExpires.toISOString();

    await client.query(`
      UPDATE
        users 
      SET
      password_reset_token = $1, password_reset_token_expires = $2, is_approved = $3
      WHERE
        email = $4;
    `,
      [hashedToken, tokenExpiresISO, true, email]
    );

    await client.query('COMMIT');

    return { data: passwordToken };
  } catch (err) {
    await client.query('ROLLBACK');
    throw new Error(unpackError(err));
  } finally {
    client.release();
  }
}

export async function verifyAndResetPassword(token: string, newPassword: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const data = await client.query(`
      SELECT
        *
      FROM
        users
      WHERE
        password_reset_token IS NOT NULL;
    `);

    const users = data.rows;

    if (isEmpty(users)) {
      throw new Error('Link is invalid');
    }

    const user = await (async () => {
      const results = await Promise.all(
        users.map(async (item) => ({
          user: item,
          match: item?.password_reset_token ? await bcrypt.compare(token, item.password_reset_token) : false,
        }))
      );
      return results.find((res) => res.match)?.user || null;
    })();

    if (isEmpty(user)) {
      throw new Error('Link is invalid');
    }

    if (new Date().toISOString() > user?.password_reset_token_expires) {
      throw new Error('Link is expired');
    }

    const isValidToken = await bcrypt.compare(token, user?.password_reset_token);

    if (isValidToken) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await client.query(`
        UPDATE
          users
        SET
          password = $1, password_reset_token = NULL, password_reset_token_expires = NULL
        WHERE
          id = $2
        `, [
        hashedPassword, user.id,
      ]);
    } else {
      throw new Error('Link is invalid');
    }

    await client.query('COMMIT');

    return { data: 'Password successfully created' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function changePassword(
  { password, newPassword }: { password: string, newPassword: string }, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { data: userData } = await authorize({ token, types: [USER_TYPE.ADMIN, USER_TYPE.AFFILIATE, USER_TYPE.PROVIDER, USER_TYPE.USER] });

    if (!userData) {
      return { message: 'Unauthorized' };
    }

    const data = await client.query(
      `
        SELECT password
        FROM users
        WHERE id = $1 AND deleted_at IS NULL;
      `,
      [userData.id]
    );

    if (data.rows.length === 0) {
      throw new Error('User data not found');
    }

    const user = data.rows[0];

    const isPasswordValid = await bcrypt?.compare(password, user?.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.query(`
        UPDATE
          users
        SET
          password = $1
        WHERE
          id = $2
        `, [
      hashedPassword, userData.id,
    ]);

    await client.query('COMMIT');

    return { data: 'Password successfully changed. Please relogin.' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function verifyRegistration(token: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const data = await client.query(
      `
        SELECT
          *
        FROM
          users
        WHERE
          password_reset_token IS NOT NULL;
      `
    );

    const users = data.rows;

    if (isEmpty(users)) {
      throw new Error('Link is invalid');
    }

    const user = await (async () => {
      const results = await Promise.all(
        users.map(async (item) => ({
          user: item,
          match: item?.password_reset_token ? await bcrypt.compare(token, item.password_reset_token) : false,
        }))
      );
      return results.find((res) => res.match)?.user || null;
    })();

    if (isEmpty(user)) {
      throw new Error('Link is invalid');
    }

    if (user?.is_approved) {
      throw new Error('Account already verified');
    }

    if (new Date().toISOString() > user?.password_reset_token_expires) {
      throw new Error('Link is expired');
    }

    const isValidToken = await bcrypt.compare(token, user?.password_reset_token);

    if (!isValidToken) {
      throw new Error('Link is invalid');
    }

    await client.query(
      `
        UPDATE
          users
        SET
          is_approved = $1, password_reset_token = NULL, password_reset_token_expires = NULL
        WHERE
          id = $2
      `,
      [true, user.id]
    );

    await client.query('COMMIT');

    return { data: 'Account successfully verified' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function manualVerifyRegistration({ userId }: { userId: string }, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    const data = await client.query(
      `
        SELECT
          *
        FROM
          users
        WHERE
          id = $1;
      `,
      [userId]
    );

    const user = data.rows[0];

    if (user?.is_approved) {
      throw new Error('Account already verified');
    }

    await client.query(
      `
        UPDATE
          users
        SET
          is_approved = $1, password_reset_token = NULL, password_reset_token_expires = NULL
        WHERE
          id = $2
      `,
      [true, userId]
    );

    await client.query('COMMIT');

    return { data: 'Account successfully verified' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}