import { ReactNode } from 'react';

export type Props = {
  tabs: {
    key: string,
    label: string,
    component: ReactNode,
  }[],
  selectedTab: string,
  onSelectTab: (key: string) => void,
};