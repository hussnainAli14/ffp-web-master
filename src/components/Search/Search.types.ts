import { ChangeEvent, KeyboardEvent } from 'react';

export type Props = {
  id?: string,
};

export type UseSearch = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void,
  defaultQuery: string;
};