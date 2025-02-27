'use client';

import { LuSearch } from 'react-icons/lu';

import { Props } from './SearchComponent.types';
import useSearchComponent from './useSearchComponent';

const SearchComponent = (props: Props) => {
  const { id, placeholder = 'Search' } = props;
  const { onChange, onKeyDown } = useSearchComponent(props);

  return (
    <div className='relative flex flex-grow items-center'>
      <div className='absolute left-4 flex justify-center items-center h-full'>
        <LuSearch className='text-gray-400 text-lg' />
      </div>
      <input
        id={id}
        type='text'
        className='flex flex-grow text-primary-black text-base font-normal border rounded-full pl-10 pr-4 h-11 focus:outline-primary-btn'
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default SearchComponent;
