import { Pagination, ProductListCardProps, Setter } from '@ffp-web/app/index.types';

export type LoadingStates = {
  popularProduct: boolean,
  moreProduct: boolean
};

export type UseCity = {
  cityId: string,
  cityName: string,
  popularProducts: ProductListCardProps[],
  setPopularProducts: Setter<ProductListCardProps[]>,
  products: ProductListCardProps[],
  setProducts: Setter<ProductListCardProps[]>,
  pagination: Pagination,
  setPagination: Setter<Pagination>,
  loading: LoadingStates,
  setLoading: Setter<LoadingStates>,
  categories: number[],
};