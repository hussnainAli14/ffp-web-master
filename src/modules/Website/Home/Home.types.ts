import { CategoryRes, PlaceHomeCityProps, ProductListCardProps, PromiseFunction, Setter } from '@ffp-web/app/index.types';

export type LoadingStates = {
  category: boolean,
  product: boolean,
  places: boolean,
};

export type UseHome = {
  loading: LoadingStates,
  setLoading: Setter<LoadingStates>,
  categories: CategoryRes[],
  setCategories: Setter<CategoryRes[]>,
  selectedCategoryId: string,
  setSelectedCategoryId: Setter<string>,
  products: Record<string, ProductListCardProps[]>,
  setProducts: Setter<Record<string, ProductListCardProps[]>>,
  fetchProducts: PromiseFunction<string>,
  places: PlaceHomeCityProps[],
  setPlaces: Setter<PlaceHomeCityProps[]>,
};