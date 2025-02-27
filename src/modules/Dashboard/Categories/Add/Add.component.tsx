'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { FiTrash2 } from 'react-icons/fi';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, LoadingSpinner, ReactDropzone, SeparatorLine } from '@ffp-web/components';

import useAdd from './useAdd';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Categories', href: '/dashboard/categories' },
  { id: '2', name: 'Add New Category', href: '#' },
];

const AddCategoryPage = () => {
  const {
    onSubmit,
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { errors },
    subCategories,
    handleAddSubCategory,
    handleRemoveSubCategory,
    isLoadingSubmit,
  } = useAdd();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>Add New Category</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='categoryName' className='text-sm font-semibold'>
            Category name
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('categoryName', {
                required: true,
              })}
              id='categoryName'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Input category name'
            />
            {errors.categoryName?.type === 'required' &&
              <div className='error-form'>Please input category name</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Category image
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='image'
              control={control}
              rules={{ required: true }}
              render={() => (
                <ReactDropzone
                  value={watch('image')}
                  onChange={(urls) => setValue('image', urls, { shouldValidate: true })}
                  maxFiles={1}
                />
              )}
            />
            {errors.image?.type === 'required' &&
              <div className='error-form'>Please upload category image</div>}
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Sub-category
          </div>
          <div className='col-span-2 flex flex-col gap-2'>
            {subCategories.fields.map((item, index) => (
              <div key={item.id} className='p-4 flex flex-col gap-4 bg-primary-white rounded-xl border'>
                <div className='flex flex-col gap-1'>
                  <label htmlFor={`subCategoryName-${index}`} className='text-sm font-medium'>
                    Sub-category {index + 1}
                  </label>
                  <div className='flex justify-between items-center gap-4'>
                    <input
                      {...register(`subCategories.${index}.subCategoryName`, {
                        required: true,
                      })}
                      id={`subCategoryName-${index}`}
                      autoComplete='on'
                      type='text'
                      className='flex-grow text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
                      placeholder='Input sub-category name'
                    />
                    <button
                      type='button'
                      className='text-primary-gray'
                      disabled={isLoadingSubmit}
                      onClick={handleRemoveSubCategory(index)}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                  {errors.subCategories?.[index]?.subCategoryName?.type === 'required' &&
                    <div className='error-form'>Please input sub-category name</div>}
                </div>

                <div className='flex flex-col gap-1'>
                  <div className='text-sm font-medium'>
                    Sub-category {index + 1} image
                  </div>
                  <Controller
                    name={`subCategories.${index}.image`}
                    control={control}
                    rules={{ required: true }}
                    render={() => (
                      <ReactDropzone
                        value={watch(`subCategories.${index}.image`)}
                        onChange={(urls) => setValue(`subCategories.${index}.image`, urls, { shouldValidate: true })}
                        maxFiles={1}
                      />
                    )}
                  />
                  {errors.subCategories?.[index]?.image?.type === 'required' &&
                    <div className='error-form'>Please upload sub-category image</div>}
                </div>
              </div>
            ))}

            <button
              type='button'
              disabled={isLoadingSubmit}
              className='flex items-center gap-2 text-sm text-primary-btn font-semibold'
              onClick={handleAddSubCategory}
            >
              <FaPlus /> Add sub-category
            </button>
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-end items-center gap-4'>
          <Link
            href={isLoadingSubmit ? '#' : '/dashboard/categories'}
            type='button' className='px-4 py-2 bg-primary-white hover:bg-opacity-90 rounded-full border'
          >
            Cancel
          </Link>
          <button
            type='submit'
            disabled={isLoadingSubmit}
            className='px-4 py-2 text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
          >
            {isLoadingSubmit ? <LoadingSpinner size='small' variant='secondary' /> : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryPage;