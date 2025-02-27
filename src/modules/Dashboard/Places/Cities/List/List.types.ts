import { PlaceCityProps, PlaceHomeCityProps, RowAction, Setter, VoidFunction } from '@ffp-web/app/index.types';

export type ModalStates = {
  delete: boolean,
};

export type LoadingStates = {
  list: boolean,
};

export type UseList = {
  selectedTab: string,
  setSelectedTab: Setter<string>,
  openModal: ModalStates,
  setOpenModal: Setter<ModalStates>
  loading: LoadingStates,
  setLoading: Setter<LoadingStates>,
  listCity: PlaceCityProps[],
  setListCity: Setter<PlaceCityProps[]>,
  selectedCity?: PlaceCityProps,
  setSelectedCity: Setter<PlaceCityProps | undefined>,
  listHomeCity: PlaceHomeCityProps[],
  setListHomeCity: Setter<PlaceHomeCityProps[]>,
  handleDelete: RowAction<PlaceCityProps>,
  handleAddToHome: RowAction<PlaceCityProps>,
  handleRemoveFromHome: RowAction<PlaceHomeCityProps>,
  handleMoveUp: (order: number) => void,
  handleMoveDown: (order: number) => void,
  onDelete: VoidFunction,
};

export type ColumnCitiesProps = {
  handleDelete: RowAction<PlaceCityProps>,
  handleAddToHome: RowAction<PlaceCityProps>,
};

export type ColumnHomeCitiesProps = {
  handleRemoveFromHome: RowAction<PlaceHomeCityProps>,
};