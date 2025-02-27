import { Setter, UserDetailProps, VoidFunction } from '@ffp-web/app/index.types';

export type UseView = {
  providerDetail?: UserDetailProps,
  setProviderDetail: Setter<UserDetailProps | undefined>,
  openModalDelete: boolean,
  setOpenModalDelete: Setter<boolean>,
  openModalApprove: boolean,
  setOpenModalApprove: Setter<boolean>,
  handleDelete: VoidFunction,
  handleApprove: VoidFunction,
  onDelete: VoidFunction,
  onApprove: VoidFunction,
};