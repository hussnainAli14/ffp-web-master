import { ReactNode } from 'react';

import { VoidFunction } from '@ffp-web/app/index.types';

export type Props = {
  title: string,
  onClick?: VoidFunction,
  size?: 'medium' | 'large',
  color?: 'primary' | 'secondary' | 'tertiary',
  leftIcon?: ReactNode,
  rightIcon?: ReactNode,
  width?: string,
};