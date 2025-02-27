import { ReactNode } from 'react';

export type Props = {
  children: ReactNode,
  size: 'sm' | 'md' | 'lg',
  variant: 'success' | 'warning' | 'error',
};