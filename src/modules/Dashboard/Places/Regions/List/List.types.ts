import { PlaceRegionProps, RowAction, Setter, VoidFunction } from '@ffp-web/app/index.types';

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
  listRegion: PlaceRegionProps[],
  setListRegion: Setter<PlaceRegionProps[]>,
  selectedRegion?: PlaceRegionProps,
  setSelectedRegion: Setter<PlaceRegionProps | undefined>,
  handleDelete: RowAction<PlaceRegionProps>,
  onDelete: VoidFunction,
};

export type ColumnProps = {
  handleDelete: RowAction<PlaceRegionProps>,
};