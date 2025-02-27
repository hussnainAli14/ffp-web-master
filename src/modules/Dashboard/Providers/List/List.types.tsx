import { ListUserProps, PlaceCityProps, PlaceCountryProps, RowAction, Setter, VoidFunction } from '@ffp-web/app/index.types';

export type ColumnProps = {
  handleDelete: RowAction<ListUserProps>,
  handleApprove: RowAction<ListUserProps>,
};

export type ModalStates = {
  delete: boolean,
  approve: boolean,
  filterCountry: boolean,
  filterCity: boolean,
};

export type LoadingStates = {
  loadingList: boolean,
};

export type FilterStates = {
  countries: PlaceCountryProps[],
  cities: PlaceCityProps[],
  selectedCountry: number[],
  selectedCity: number[],
};

export type UseList = {
  listProvider: ListUserProps[],
  setListProvider: Setter<ListUserProps[]>,
  selectedProvider?: ListUserProps,
  setSelectedProvider: Setter<ListUserProps | undefined>,
  loading: LoadingStates,
  setLoading: Setter<LoadingStates>
  openModal: ModalStates,
  setOpenModal: Setter<ModalStates>
  handleDelete: RowAction<ListUserProps>,
  handleApprove: RowAction<ListUserProps>,
  onDelete: VoidFunction,
  onApprove: VoidFunction,
  filter: FilterStates,
  setFilter: Setter<FilterStates>,
  handleCloseFilterCountry: (item?: number[]) => void,
  handleCloseFilterCity: (item?: number[]) => void,
};