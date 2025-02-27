import { Pagination, PlaceCityProps, PlaceCountryProps, ProductListCardProps, Setter } from '@ffp-web/app/index.types';

export type LoadingStates = {
  products: boolean,
};

export type FilterData = {
  countries: PlaceCountryProps[],
  cities: PlaceCityProps[],
};

export type FilterStates = {
  selectedCountry: number[],
  selectedCity: number[],
};

export type ModalStates = {
  filterCountry: boolean,
  filterCity: boolean,
};

export type UseCategory = {
  categoryId: string,
  categoryName: string,
  subCategoryId: string,
  subCategoryName: string,
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
  filterData: FilterData,
  setFilterData: Setter<FilterData>,
  filterStates: FilterStates,
  setFilterStates: Setter<FilterStates>,
  openModal: ModalStates,
  setOpenModal: Setter<ModalStates>,
  handleCloseFilterCountry: (item?: number[]) => void,
  handleCloseFilterCity: (item?: number[]) => void,
};