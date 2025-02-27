'use server';

import { QueryResult } from '@neondatabase/serverless';

import { CategoryDetailProps, CategoryRes, CategoryWithSubcategoryRes, GetCategoryProps, ListCategoryProps, QueryData, SubCategoryRes, USER_TYPE } from '@ffp-web/app/index.types';
import pool from '@ffp-web/lib/pool';
import { unpackError } from '@ffp-web/utils/error.utils';

import { authorize } from '../auth/data';

type Category = {
  id: string,
  name: string,
  image: string,
  sequence: number,
};

type SubCategory = {
  id: string,
  name: string,
  image: string,
  category_id: string,
};

type CategoryWithSubcategory = {
  id: string,
  name: string,
  image: string,
  sequence: number,
  sub_categories: {
    id: string,
    name: string,
    image: string,
  }[] | null,
};

type ListCategoryQuery = {
  category_id: string,
  category_name: string,
  sub_category_count: number,
  category_sequence: string,
}

export async function getCategories(
  params?: GetCategoryProps
): Promise<QueryData<CategoryRes[]>> {
  const client = await pool.connect();

  try {
    const data: QueryResult<Category> = await client.query(`
      SELECT * 
      FROM categories
      WHERE deleted_at IS NULL ${params?.showHidden ? '' : 'AND is_hidden IS FALSE'}
      ORDER BY sequence ASC;
  `);

    const categories: CategoryRes[] = data.rows.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      image: category.image,
      sequence: category.sequence,
    }));

    return { data: categories };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getSubCategories(
  { categoryId, categoryIds }: { categoryId?: string, categoryIds?: string }
): Promise<QueryData<SubCategoryRes[]>> {
  const client = await pool.connect();

  try {
    let query = `
      SELECT * 
      FROM sub_categories
      WHERE deleted_at IS NULL
    `;
    const queryParams: (string | string[])[] = [];
    let paramsCount = 0;

    if (categoryId) {
      paramsCount++;
      query += ` AND category_id = $${paramsCount}`;
      queryParams.push(categoryId);
    }

    if (categoryIds?.length) {
      paramsCount++;
      query += ` AND category_id = ANY($${paramsCount})`;
      queryParams.push(categoryIds);
    }

    query += ';';

    const data: QueryResult<SubCategory> = await client.query(query, queryParams);

    const subCategories: SubCategoryRes[] = data.rows.map((subCategory) => ({
      categoryId: subCategory.category_id,
      subCategoryId: subCategory.id,
      subCategoryName: subCategory.name,
      image: subCategory.image,
    }));

    return { data: subCategories };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getCategoriesWithSubcategories(
  params?: GetCategoryProps
): Promise<QueryData<CategoryWithSubcategoryRes[]>> {
  const client = await pool.connect();

  try {
    const data: QueryResult<CategoryWithSubcategory> = await client.query(`
      SELECT 
        c.id, 
        c.name, 
        c.image, 
        c.sequence, 
        CASE WHEN COUNT(sc.id) = 0 THEN NULL ELSE json_agg(
          json_build_object(
            'id', sc.id, 'name', sc.name, 'image', 
            sc.image
          )
          ORDER BY sc.name ASC
        ) END AS sub_categories 
      FROM 
        categories c
      LEFT JOIN
        sub_categories sc ON c.id = sc.category_id 
      WHERE
        c.deleted_at IS NULL AND sc.deleted_at IS NULL ${params?.showHidden ? '' : 'AND c.is_hidden IS FALSE'}
      GROUP BY
        c.id, 
        c.name, 
        c.image, 
        c.sequence
      ORDER BY 
        c.sequence ASC;
    `);

    const categories: CategoryWithSubcategoryRes[] = data.rows.map(category => ({
      categoryId: category.id,
      categoryName: category.name,
      image: category.image,
      subCategories: category.sub_categories?.map(subcategory => ({
        categoryId: category.id,
        subCategoryId: subcategory.id,
        subCategoryName: subcategory.name,
        image: subcategory.image,
      })) ?? [],
    }));

    return { data: categories };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

// dahsboard purpose
export async function getListCategory(
  params?: GetCategoryProps
): Promise<QueryData<ListCategoryProps[]>> {
  const client = await pool.connect();

  try {
    const data: QueryResult<ListCategoryQuery> = await client.query(`
      SELECT
        c.id AS category_id,
        c.name AS category_name,
        COUNT(sc.id) AS sub_category_count,
        c.sequence as category_sequence
      FROM
        categories c
      LEFT JOIN
        sub_categories sc ON c.id = sc.category_id
      WHERE
        c.deleted_at IS NULL and sc.deleted_at IS NULL ${params?.showHidden ? '' : 'AND c.is_hidden IS FALSE'}
      GROUP BY
        c.id, c.name
      ORDER BY
        c.sequence ASC;
    `);

    const categories: ListCategoryProps[] = data.rows.map(item => ({
      categoryId: item.category_id,
      categoryName: item.category_name,
      subCategoryCount: item.sub_category_count,
    }));

    return { data: categories };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function addCategory(payload: CategoryDetailProps, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    const categoryQuery = `
      INSERT INTO categories (name, image)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const categoryResult = await client.query(categoryQuery, [payload.categoryName, payload.image]);
    const categoryId = categoryResult.rows[0].id;

    if (payload.subCategories.length > 0) {
      const subCategoryQuery = `
        INSERT INTO sub_categories (name, image, category_id)
        VALUES ${payload.subCategories
          .map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`)
          .join(', ')}
      `;
      const subCategoryValues = payload.subCategories.flatMap((subCategory) => [
        subCategory.subCategoryName,
        subCategory.image,
        categoryId,
      ]);
      await client.query(subCategoryQuery, subCategoryValues);
    }

    await client.query('COMMIT');

    return { data: 'Success add new category' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function getCategoryDetail(
  { categoryId }: { categoryId: string }, token?: string
): Promise<QueryData<CategoryDetailProps>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    const categoryQuery = `
      SELECT id AS "categoryId", name AS "categoryName", image
      FROM categories
      WHERE id = $1;
    `;
    const categoryResult = await client.query(categoryQuery, [categoryId]);

    if (categoryResult.rows.length === 0) {
      throw new Error('Category not found');
    }

    const category = categoryResult.rows[0];

    const subCategoryQuery = `
      SELECT id AS "subCategoryId", name AS "subCategoryName", image
      FROM sub_categories
      WHERE category_id = $1 AND deleted_at IS NULL;
    `;
    const subCategoryResult = await client.query(subCategoryQuery, [categoryId]);

    const categoryDetail: CategoryDetailProps = {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      image: category.image,
      subCategories: subCategoryResult.rows,
    };

    return { data: categoryDetail };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function removeCategory(
  { categoryId }: { categoryId: string }, token?: string
): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await authorize({ token, types: [USER_TYPE.ADMIN] });

    await client.query(`
    UPDATE 
      categories
    SET 
      deleted_at = NOW()
    WHERE 
      id = $1;
    `, [
      categoryId,
    ]);

    return { data: 'Succesfully removed!' };
  } catch (err) {
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}

export async function updateCategory(payload: CategoryDetailProps, token?: string): Promise<QueryData<string>> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await authorize({ token, types: [USER_TYPE.ADMIN] });

    const categoryQuery = `
      UPDATE categories
      SET name = $1, image = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING id;
    `;
    const categoryResult = await client.query(categoryQuery, [payload.categoryName, payload.image, payload.categoryId]);

    if (categoryResult.rowCount === 0) {
      throw new Error('Category not found');
    }

    // Step 1: Soft delete subcategories that are no longer in the list
    const subCategoryIdsToKeep = payload.subCategories
      .filter((subCategory) => subCategory.subCategoryId)
      .map((subCategory) => subCategory.subCategoryId);

    const deleteSubCategoryQuery = `
      UPDATE sub_categories
      SET deleted_at = NOW()
      WHERE category_id = $1 AND deleted_at IS NULL
      AND id NOT IN (${subCategoryIdsToKeep.length > 0 ? subCategoryIdsToKeep.map((_, index) => `$${index + 2}`).join(', ') : 'NULL'})
    `;
    await client.query(deleteSubCategoryQuery, [payload.categoryId, ...subCategoryIdsToKeep]);

    // Step 2: Add new subcategories or update existing ones
    for (const subCategory of payload.subCategories) {
      if (subCategory.subCategoryId) {
        // If subCategoryId exists, update the subcategory
        const updateSubCategoryQuery = `
          UPDATE sub_categories
          SET name = $1, image = $2, updated_at = NOW(), deleted_at = NULL
          WHERE id = $3 AND category_id = $4;
        `;
        await client.query(updateSubCategoryQuery, [
          subCategory.subCategoryName,
          subCategory.image,
          subCategory.subCategoryId,
          payload.categoryId,
        ]);
      } else {
        // If subCategoryId doesn't exist, insert a new subcategory
        const insertSubCategoryQuery = `
          INSERT INTO sub_categories (name, image, category_id)
          VALUES ($1, $2, $3);
        `;
        await client.query(insertSubCategoryQuery, [
          subCategory.subCategoryName,
          subCategory.image,
          payload.categoryId,
        ]);
      }
    }

    await client.query('COMMIT');

    return { data: 'Successfully update category' };
  } catch (err) {
    await client.query('ROLLBACK');
    return { message: unpackError(err) };
  } finally {
    client.release();
  }
}
