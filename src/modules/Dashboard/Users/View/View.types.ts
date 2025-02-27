import { Setter, UserDetailProps, VoidFunction } from '@ffp-web/app/index.types';

export type UseView = {
  userDetail?: UserDetailProps,
  setUserDetail: Setter<UserDetailProps | undefined>,
  openModalDelete: boolean,
  setOpenModalDelete: Setter<boolean>,
  handleDelete: VoidFunction,
  onDelete: VoidFunction,
};