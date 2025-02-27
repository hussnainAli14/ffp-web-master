import { PlaceCountryProps, RowAction, Setter, VoidFunction } from '@ffp-web/app/index.types';

export type ModalStates = {
  delete: boolean,
};

export type LoadingStates = {
  list: boolean,
};

export type UseList = {
  openModal: ModalStates,
  setOpenModal: Setter<ModalStates>
  loading: LoadingStates,
  setLoading: Setter<LoadingStates>,
  listCountry: PlaceCountryProps[],
  setListCountry: Setter<PlaceCountryProps[]>,
  selectedCountry?: PlaceCountryProps,
  setSelectedCountry: Setter<PlaceCountryProps | undefined>,
  handleDelete: RowAction<PlaceCountryProps>,
  onDelete: VoidFunction,
};

export type ColumnProps = {
  handleDelete: RowAction<PlaceCountryProps>,
};