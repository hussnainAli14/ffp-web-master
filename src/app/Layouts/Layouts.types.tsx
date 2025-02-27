import { ReactNode } from 'react';

import { Setter, USER_TYPE } from '../index.types';

export type Props = {
  children: ReactNode,
};

export type UseLayouts = {
  pathname: string,
  isDashboard: boolean,
  isAuth: boolean,
  isCollapsed: boolean,
  setIsCollapsed: Setter<boolean>,
  openSubMenus: { [key: string]: boolean },
  setOpenSubMenus: Setter<{ [key: string]: boolean }>,
  handleLogout: VoidFunction,
  toggleSubMenu: (label: string) => void,
  userType?: USER_TYPE,
  hasAccess: boolean,
};

export type SidebarProps = {
  isCollapsed: boolean,
  setIsCollapsed: Setter<boolean>,
  pathname: string,
  openSubMenus: { [key: string]: boolean },
  toggleSubMenu: (label: string) => void,
  handleLogout: VoidFunction,
  userType?: USER_TYPE,
};

export type MenuItemProps = {
  label: string;
  icon?: ReactNode;
  isCollapsed: boolean;
  setIsCollapsed: Setter<boolean>,
  href: string;
  subMenuItems?: { label: string; href: string; icon?: ReactNode, access: string[] }[];
  isSubMenuOpen?: boolean;
  onToggleSubMenu?: () => void;
  pathname: string;
  userType?: USER_TYPE,
};