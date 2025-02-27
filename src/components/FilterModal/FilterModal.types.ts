import { RefObject } from 'react';

import { Setter, VoidFunction } from '@ffp-web/app/index.types';

export type Props<T> = {
  items: { value: T, label: string }[],
  selectedItems: T[],
  onSave: (selectedItems: T[]) => void,
  onBack: () => void,
  title: string,
  isMulti?: boolean,
  defaultValue?: { value: T, label: string }
};

export type UseFilterModal<T> = {
  search: string,
  setSearch: Setter<string>,
  selectedItems: T[],
  setSelectedItems: Setter<T[]>,
  filteredItems: { value: T, label: string }[],
  handleSearch: (key: string) => void
  toggleItem: (value: T) => void,
  selectItem: (value?: T) => void,
  selectAll: VoidFunction,
  clearAll: VoidFunction,
  handleSave: VoidFunction,
  handleBack: VoidFunction,
  scrollRef: RefObject<HTMLDivElement>,
};