'use client';

import { Input } from '@headlessui/react';
import { isEmpty } from 'lodash';
import { FaRegCheckCircle } from 'react-icons/fa';

import { ReactCheckBox, SeparatorLine } from '@ffp-web/components';

import { Props } from './FilterModal.types';
import useFilterModal from './useFilterModal';

const FilterModal = <T,>(props: Props<T>) => {
  const {
    title,
    isMulti,
    defaultValue,
  } = props;
  const {
    search,
    selectAll,
    clearAll,
    filteredItems,
    selectedItems,
    handleSearch,
    toggleItem,
    selectItem,
    handleSave,
    handleBack,
    scrollRef,
  } = useFilterModal(props);


  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg max-w-[90%] w-96 p-6'>
        <h2 className='text-lg font-semibold mb-4'>{title}</h2>
        <Input
          id='search'
          type='text'
          placeholder={`Search ${title.toLowerCase()}`}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className='px-3 h-11 mb-3 w-full text-base font-normal rounded-md focus:outline-primary-btn border'
        />

        {isMulti &&
          <div className='flex justify-between text-primary-btn font-medium text-sm mb-3'>
            <button type='button' onClick={selectAll}>
              Select all
            </button>
            <button type='button' onClick={clearAll}>
              Clear all
            </button>
          </div>
        }

        {isMulti && <SeparatorLine horizontal />}

        <div className='max-h-60 overflow-y-auto flex flex-col gap-1' ref={scrollRef}>
          {(!isMulti && !defaultValue) &&
            <button
              className='p-2 flex justify-between items-center hover:bg-gray-50 rounded-md'
              onClick={() => selectItem()}
            >
              <div className={`text-base ${isEmpty(selectedItems) ? 'text-primary-btn font-semibold' : ''}`}>
                All {title}
              </div>
              {isEmpty(selectedItems) && <FaRegCheckCircle className='text-primary-btn size-5' />}
            </button>
          }
          {filteredItems.map((item, index) =>
            isMulti ? (
              <div key={`${item.value}-${index}`} className='p-2 flex items-center'>
                <ReactCheckBox
                  id={`${item.value}-${index}`}
                  checked={selectedItems.includes(item.value)}
                  onChange={() => toggleItem(item.value)}
                />
                <button className='ml-3 text-left' onClick={() => toggleItem(item.value)}>
                  {item.label}
                </button>
              </div>
            ) : (
              <button
                key={`${item.value}-${index}`}
                className='p-2 flex justify-between items-center hover:bg-gray-50 rounded-md'
                onClick={() => selectItem(item.value)}
              >
                <div className={`text-base text-left ${selectedItems.includes(item.value) ? 'text-primary-btn font-semibold' : ''}`}>
                  {item.label}
                </div>
                {selectedItems.includes(item.value) && <FaRegCheckCircle className='text-primary-btn size-5' />}
              </button>
            ))}
        </div>

        <div className='flex justify-end pt-4 space-x-2'>
          <button
            type='button'
            onClick={handleBack}
            className='px-4 py-2 text-sm bg-gray-50 hover:bg-opacity-90 rounded-full border'
          >
            Back
          </button>
          <button
            type='button'
            onClick={handleSave}
            className='px-4 py-2 text-sm text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
