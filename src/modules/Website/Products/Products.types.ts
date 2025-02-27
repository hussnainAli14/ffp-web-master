import { ProductListCardProps, Setter } from '@ffp-web/app/index.types';

export type UseProducts = {
  products: ProductListCardProps[],
  setProducts: Setter<ProductListCardProps[]>,
  isLoadingQuery: boolean,
  setIsLoadingQuery: Setter<boolean>,
  query: string,
};