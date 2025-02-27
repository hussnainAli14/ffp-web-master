import { RowAction, Setter, TagProps, VoidFunction } from '@ffp-web/app/index.types';

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
  listTag: TagProps[],
  setListTag: Setter<TagProps[]>,
  selectedTag?: TagProps,
  setSelectedTag: Setter<TagProps | undefined>,
  handleDelete: RowAction<TagProps>,
  onDelete: VoidFunction,
};

export type ColumnProps = {
  handleDelete: RowAction<TagProps>,
};