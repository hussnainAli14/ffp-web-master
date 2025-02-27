import { HTMLAttributeAnchorTarget } from 'react';
import { IconType } from 'react-icons';

import { CategoryRes, Setter, VoidFunction } from '@ffp-web/app/index.types';

export type UseFooter = {
  categories: CategoryRes[],
  setCategories: Setter<CategoryRes[]>,
  email: string,
  setEmail: Setter<string>,
  loadingSubscribe: boolean,
  setLoadingSubscribe: Setter<boolean>,
  isUser: boolean,
  setIsUser: Setter<boolean>,
  onSubscribe: VoidFunction,
};

export type Sosmed = {
  key: string,
  icon: IconType,
  href: string,
};

export type Resource = {
  key: string,
  name: string,
  href: string,
  target?: HTMLAttributeAnchorTarget,
};