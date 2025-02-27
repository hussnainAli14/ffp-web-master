import { ListUserProps, PlaceCountryProps, RowAction, Setter, USER_AGE_GROUP, USER_GENDER, VoidFunction } from '@ffp-web/app/index.types';

export type ColumnProps = {
  handleDelete: RowAction<ListUserProps>,
  handleBlock: RowAction<ListUserProps>,
  handleVerify: RowAction<ListUserProps>,
};

export type ModalState = {
  delete: boolean,
  block: boolean,
  verify: boolean,
  filterCountry: boolean,
  filterGender: boolean,
  filterAgeGroup: boolean,
};

export type FilterStates = {
  countries: PlaceCountryProps[],
  selectedCountry: number[],
  gender: { value: USER_GENDER, label: string }[],
  selectedGender: USER_GENDER[],
  ageGroup: { value: USER_AGE_GROUP, label: string }[],
  selectedAgeGroup: USER_AGE_GROUP[],
  query: string,
};

export type UseList = {
  listUsers: ListUserProps[],
  setListUsers: Setter<ListUserProps[]>,
  isLoadingList: boolean,
  setIsLoadingList: Setter<boolean>,
  selectedUser?: ListUserProps,
  setSelectedUser: Setter<ListUserProps | undefined>,
  openModal: ModalState,
  setOpenModal: Setter<ModalState>,
  filter: FilterStates,
  setFilter: Setter<FilterStates>,
  handleDelete: RowAction<ListUserProps>,
  onDelete: VoidFunction,
  handleBlock: RowAction<ListUserProps>,
  onBlock: VoidFunction,
  handleVerify: RowAction<ListUserProps>,
  onVerify: VoidFunction,
  handleCloseFilterCountry: (item?: number[]) => void,
  handleCloseFilterGender: (item?: USER_GENDER[]) => void,
  handleCloseFilterAgeGroup: (item?: USER_AGE_GROUP[]) => void,
};