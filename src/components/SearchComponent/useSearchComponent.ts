import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { Props, UseSearchComponent } from './SearchComponent.types';

const useSearchComponent = ({ onPressEnter }: Props): UseSearchComponent => {
  const [querySearch, setQuerySearch] = useState<string>('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuerySearch(e.target.value);
    if (!e.target.value) {
      onPressEnter('');
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPressEnter(querySearch);
    }
  };

  return {
    onChange,
    onKeyDown,
  };
};

export default useSearchComponent;