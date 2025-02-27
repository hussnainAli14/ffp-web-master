import { UserData, VoidFunction } from '@ffp-web/app/index.types';

export type Props = {
  onClick?: VoidFunction
};

export type UseAccountMenu = {
  userData: UserData | null,
  isUser: boolean,
  handleLogout: VoidFunction,
};