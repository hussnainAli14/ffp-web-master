import { Setter, UserDetailProps, VoidFunction } from '@ffp-web/app/index.types';

export type UseView = {
  affiliateDetail?: UserDetailProps,
  setAffiliateDetail: Setter<UserDetailProps | undefined>,
  openModalDelete: boolean,
  setOpenModalDelete: Setter<boolean>,
  handleDelete: VoidFunction,
  onDelete: VoidFunction,
};