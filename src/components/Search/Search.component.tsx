'use client';

import Link from 'next/link';
import { LuSearch } from 'react-icons/lu';

import { Props } from './Search.types';
import useSearch from './useSearch';

const Search = (props: Props) => {
  const { id } = props;
  const { onChange, onKeyDown, defaultQuery, suggestions } = useSearch();

  return (
    <div className="relative flex flex-grow items-center">
      <div className="absolute left-4 flex justify-center items-center h-full">
      <LuSearch className="text-gray-400 text-lg" />
      </div>
      <input
      id={id ?? 'search'}
      type="text"
      className="flex flex-grow text-primary-black text-base font-normal rounded-full pl-10 pr-4 h-11 focus:outline-primary-btn"
      placeholder="Find places & things to do"
      defaultValue={defaultQuery}
      onChange={onChange}
      onKeyDown={onKeyDown}
      />
      {suggestions.length > 0 && (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 text-primary-black">
        {suggestions.map((suggestion: any, index: number) => (
        <Link
          key={index}
          href={
          suggestion.type === 'city'
            ? `/city/${suggestion.id}?city=${suggestion.suggestion}`
            : suggestion.type === 'category'
            ? `/category/${suggestion.id}?categoryName=${suggestion.suggestion}`
            : suggestion.type === 'sub_category'
            ? `/category/${suggestion.suggestion_2}?categoryName=${suggestion.suggestion_3}&subCategoryId=${suggestion.id}&subCategoryName=${suggestion.suggestion}`
            : `/detail/${suggestion.id}`
          }
          className="p-2 hover:bg-gray-100 cursor-pointer flex flex-col"
        >
          {suggestion.suggestion}
          <span className="text-sm pl-3 text-gray-500 font-bold">
          {suggestion.detail}
          </span>
        </Link>
        ))}
      </div>
      )}
    </div>
  );
};

export default Search;
