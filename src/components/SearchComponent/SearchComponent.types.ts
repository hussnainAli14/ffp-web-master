import { ChangeEvent, KeyboardEvent } from 'react';

export type Props = {
  id: string,
  onPressEnter: (query: string) => void,
  placeholder?: string,
};

export type UseSearchComponent = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void,
};