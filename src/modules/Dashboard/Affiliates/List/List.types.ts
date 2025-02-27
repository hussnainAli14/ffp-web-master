import { ListUserProps, RowAction, Setter, VoidFunction } from '@ffp-web/app/index.types';

export type ColumnProps = {
  handleDelete: RowAction<ListUserProps>,
};

export type UseList = {
  listAffiliate: ListUserProps[],
  setListAffiliate: Setter<ListUserProps[]>,
  isLoadingList: boolean,
  setIsLoadingList: Setter<boolean>,
  selectedAffiliate?: ListUserProps,
  setSelectedAffiliate: Setter<ListUserProps | undefined>,
  openModalDelete: boolean,
  setOpenModalDelete: Setter<boolean>,
  handleDelete: RowAction<ListUserProps>,
  onDelete: VoidFunction,
};