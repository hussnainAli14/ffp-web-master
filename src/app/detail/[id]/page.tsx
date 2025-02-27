import { Metadata, ResolvingMetadata } from 'next/types';

import { ProductDetailProps } from '@ffp-web/app/index.types';
import { getProductDetail } from '@ffp-web/lib/product/data';
import { DetailPage } from '@ffp-web/modules/Website';

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;

  const { data: product } = await getProductDetail({ productId: id });

  const previousImages = (await parent).openGraph?.images || [];

  const _getProductImages = (data: ProductDetailProps | undefined): string[] => (
    data?.images ? data.images : [`${process.env.NEXT_PUBLIC_BASE_URL}/images/ffp-logo.png`]
  );

  return {
    title: `FFP Travels - ${product?.name}`,
    openGraph: {
      title: `FFP Travels - ${product?.name} | ${product?.city.cityName} | ${product?.category.categoryName} | ${product?.subCategory.subCategoryName}`,
      description: `${product?.summary}`,
      images: [..._getProductImages(product), ...previousImages],
    },
  };
}

const Page = () => {
  return <DetailPage />;
};

export default Page;