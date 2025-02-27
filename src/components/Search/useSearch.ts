import { debounce } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { getSearchDetails } from '@ffp-web/lib/product/data';

import { UseSearch } from './Search.types';


const useSearch = (): UseSearch => {
  const searchParams = useSearchParams();
  const defaultQuery = searchParams?.get('query') ?? '';
  const pathname = usePathname();
  const router = useRouter();
  const [querySearch, setQuerySearch] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async (value: string) => {
    if (value.length > 2) {
      try {
        const { data } = await getSearchDetails(value);
        setSuggestions(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Handle the error appropriately
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuerySearch(value);
    debouncedFetchSuggestions(value);
  };


  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(searchParams ?? '');

      if (querySearch) {
        params.delete('city');
        params.set('query', querySearch);
      } else {
        params.delete('query');
      }

      if (pathname !== '/products') {
        router.push(`/products?${params.toString()}`);
      } else {
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  };

  return {
    onChange,
    onKeyDown,
    defaultQuery,
    suggestions,
  };
};

export default useSearch;