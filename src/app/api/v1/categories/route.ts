import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { unpackError } from '@ffp-web/utils/error.utils';

// Global Prisma Client instance to reuse across requests
const prisma = new PrismaClient();

export type CategoryRes = {
  categoryId: string;
  categoryName: string;
  image: string;
  subCategories?: SubCategoryRes[],
  subCategoriesCount?: number,
};

export type SubCategoryRes = {
  subCategoryId: string,
  subCategoryName: string,
  image: string,
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url ?? '');
  const showHidden = url.searchParams.get('showHidden') === 'true';
  const withCategories = url.searchParams.get('withCategories') === 'true';
  const withCategoriesCount = url.searchParams.get('withCategoriesCount') === 'true';

  try {
    const categories = await prisma.categories.findMany({
      where: {
        deleted_at: null,
        ...(showHidden ? {} : { is_hidden: false }),
      },
      include: {
        sub_categories: withCategories ? {
          where: {
            deleted_at: null,
          },
          orderBy: {
            name: 'asc',
          },
        } : false,
        _count: withCategoriesCount ? {
          select: {
            sub_categories: {
              where: {
                deleted_at: null,
              },
            },
          },
        } : false,
      },
      orderBy: {
        sequence: 'asc',
      },
    });

    const formattedCategories: CategoryRes[] = categories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      image: category.image,
      subCategories: withCategories ? category.sub_categories.map(subcategory => ({
        subCategoryId: subcategory.id,
        subCategoryName: subcategory.name,
        image: subcategory.image,
      })) : undefined,
      subCategoriesCount: withCategoriesCount ? category._count.sub_categories : undefined,
    }));

    return NextResponse.json({ data: formattedCategories });
  } catch (err) {
    return NextResponse.json({ error: unpackError(err) }, { status: 500 });
  }
}

