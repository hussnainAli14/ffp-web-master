import { ChangeEvent, KeyboardEvent } from 'react';

export type Props = {
  id?: string,
};

export type UseSearch = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void,
  defaultQuery: string;
  suggestions: { id: string; suggestion: string; type: string; detail?: string; suggestion_2?: string; suggestion_3?: string }[];
};