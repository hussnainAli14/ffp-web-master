import { ListCategoryProps, RowAction, Setter } from '@ffp-web/app/index.types';

export type UseList = {
  lisCategory: ListCategoryProps[],
  setLisCategory: Setter<ListCategoryProps[]>,
  isLoadingList: boolean,
  setIsLoadingList: Setter<boolean>,
  openModalDelete: boolean,
  setOpenModalDelete: Setter<boolean>,
  handleDelete: RowAction<ListCategoryProps>,
  onDelete: VoidFunction,
};

export type ColumnProps = {
  handleDelete: RowAction<ListCategoryProps>,
};