'use client';

import { Input, Textarea } from '@headlessui/react';
import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { BreadcrumbsProps, CTA_TYPE, SelectOption, USER_TYPE } from '@ffp-web/app/index.types';
import { Breadcrumbs, ConfirmationModal, Currency, LoadingSpinner, ReactDropzone, ReactSelect, ReactSwitch, SeparatorLine } from '@ffp-web/components';
import { hasAccess } from '@ffp-web/utils/storage.utils';

import { ContentSection, OperationalHours, QuickDetail } from '../../component';
import { filteredCtaOption } from '../../data';

import useEdit from './useEdit';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Active Listings', href: '/dashboard/listings/active' },
  { id: '2', name: 'Edit Listing', href: '#' },
];

const EditActiveListingPage = () => {
  const {
    handleSubmit,
    onSubmit,
    register,
    setValue,
    watch,
    control,
    formState: { errors },
    listProvider,
    listCategory,
    listSubCategory,
    regions,
    countries,
    cities,
    listTag,
    isLoadingSubmit,
    openModalDelete,
    setOpenModalDelete,
    onDelete,
    isLoadingDelete,
    onSavaPending,
    globalCountries,
  } = useEdit();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>Edit Listing</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Provider
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='provider'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  isDisabled={!hasAccess(USER_TYPE.ADMIN)}
                  id='provider'
                  options={listProvider.map(e => ({ value: e.userId, label: e.businessName }))}
                  isClearable
                  placeholder='Select provider'
                />
              )}
            />
            {errors.provider?.type === 'required' &&
              <div className='error-form'>Please select provider</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Category
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='category'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='category'
                  onChange={value => {
                    setValue('category', value as SingleValue<SelectOption>, { shouldValidate: true });
                    setValue('subCategory', '');
                  }}
                  options={listCategory.map(e => ({ value: e.categoryId, label: e.categoryName }))}
                  isClearable
                  placeholder='Select category'
                />
              )}
            />
            {errors.category?.type === 'required' &&
              <div className='error-form'>Please select category</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Sub-category
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='subCategory'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='subCategory'
                  options={listSubCategory.map(e => ({ value: e.subCategoryId, label: e.subCategoryName }))}
                  isClearable
                  placeholder='Select sub-category'
                />
              )}
            />
            {errors.subCategory?.type === 'required' &&
              <div className='error-form'>Please select sub-category</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='name' className='text-sm font-semibold'>
            Listing name<br />
            <span className='text-tertiary-gray font-normal'>
              Include key words in your listing
            </span>
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Input
              {...register('name', {
                required: true,
              })}
              id='name'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Input listing name'
            />
            {errors.name?.type === 'required' &&
              <div className='error-form'>Please input lising name</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Listing images<br />
            <span className='text-tertiary-gray font-normal'>
              Provide a minimum of 4 images. Recommended 10-20.
            </span>
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='images'
              control={control}
              rules={{ required: true }}
              render={() => (
                <ReactDropzone
                  value={watch('images')}
                  onChange={urls => setValue('images', urls, { shouldValidate: true })}
                />
              )}
            />
            {errors.images?.type === 'required' &&
              <div className='error-form'>Please upload listing images</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='summary' className='text-sm font-semibold'>
            Summary<br />
            <span className='text-tertiary-gray font-normal'>
              Provide a brief summary up to 300 characters.
            </span>
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Textarea
              {...register('summary', {
                required: true,
              })}
              id='summary'
              autoComplete='on'
              className='text-base font-normal rounded-md p-3 h-32 focus:outline-primary-btn border'
              placeholder='Input listing summary'
            />
            {errors.summary?.type === 'required' &&
              <div className='error-form'>Please input lising summary</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Region
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='region'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='region'
                  onChange={value => {
                    setValue('region', value as SingleValue<SelectOption>, { shouldValidate: true });
                    setValue('country', '');
                    setValue('city', '');
                  }}
                  options={regions.map(e => ({ value: e.regionId.toString(), label: e.regionName }))}
                  isClearable
                  placeholder='Select region'
                />
              )}
            />
            {errors.region?.type === 'required' &&
              <div className='error-form'>Please select region</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Country
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='country'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='country'
                  onChange={value => {
                    setValue('country', value as SingleValue<SelectOption>, { shouldValidate: true });
                    setValue('city', '');
                  }}
                  options={countries.map(e => ({ value: e.countryId.toString(), label: e.countryName }))}
                  isClearable
                  placeholder='Select country'
                />
              )}
            />
            {errors.country?.type === 'required' &&
              <div className='error-form'>Please select country</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            City
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='city'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='city'
                  options={cities.map(e => ({ value: e.cityId.toString(), label: e.cityName }))}
                  isClearable
                  placeholder='Select city'
                />
              )}
            />
            {errors.city?.type === 'required' &&
              <div className='error-form'>Please select city</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Tags<br />
            <span className='text-tertiary-gray font-normal'>
              Choose up to 4 tags
            </span>
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='tags'
              control={control}
              rules={{ required: true, validate: val => val.length <= 4 }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='tags'
                  isMulti
                  options={listTag.map(e => ({ value: e.tagId, label: e.tagName }))}
                  isClearable
                  placeholder='Add tags'
                />
              )}
            />
            {errors.tags?.type === 'required' &&
              <div className='error-form'>Please add tags</div>}
            {errors.tags?.type === 'validate' &&
              <div className='error-form'>Maximum 4 tags</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='video' className='text-sm font-semibold'>
            Listing video<br />
            <span className='text-tertiary-gray font-normal'>
              Youtube url link
            </span>
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Input
              {...register('video')}
              id='video'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Input video link'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Starting from price (Optional)
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <ReactSwitch
              checked={watch('hasPrice')}
              onChange={(val) => setValue('hasPrice', val)}
              size='lg'
            />
            {watch('hasPrice') &&
              <div className='relative w-full flex items-center'>
                <div className='absolute left-0 flex justify-center items-center h-full'>
                  <Currency
                    countries={globalCountries}
                    value={watch('currency')}
                    onChange={val => setValue('currency', val)}
                  />
                </div>
                <Input
                  {...register('price', {
                    required: watch('hasPrice'),
                  })}
                  id='price'
                  autoComplete='on'
                  type='number'
                  className='w-full text-base font-normal rounded-md pl-20 pr-3 h-11 focus:outline-primary-btn border'
                  placeholder='Input listing starting from price'
                />
              </div>
            }
            {watch('hasPrice') && errors.price?.type === 'required' &&
              <div className='error-form'>Please input starting from price</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Opening hours (Optional)
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <ReactSwitch
              checked={watch('hasOperationalHours')}
              onChange={(val) => setValue('hasOperationalHours', val)}
              size='lg'
            />
            {watch('hasOperationalHours') &&
              <OperationalHours
                control={control}
                register={register}
                errors={errors}
                className='flex flex-col gap-2'
              />
            }
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Quick details<br />
            <span className='text-tertiary-gray font-normal'>
              Must add Location & Price as your first two Quick Details. All other quick details are optional.
            </span>
          </div>

          <QuickDetail
            control={control}
            register={register}
            errors={errors}
            className='col-span-2 flex flex-col gap-2'
          />
        </div>

        <SeparatorLine horizontal />

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Content<br />
            <span className='text-tertiary-gray font-normal'>
              This is where you can customize which information you provide for site visitors. You can display in Bullet Point format of Free Text paragraph format.
            </span>
          </div>

          <ContentSection
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            className='col-span-2 flex flex-col gap-2'
          />
        </div>

        <SeparatorLine horizontal />

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Call to Action
          </div>

          <div className='col-span-2 flex flex-col gap-2'>
            <div className='flex flex-col gap-1'>
              <Controller
                name='ctaText'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    id='ctaText'
                    options={filteredCtaOption([{
                      isInclude: watch('category.label') === 'Professionals',
                      keys: [CTA_TYPE.CONTACT_ME],
                    }])}
                    isClearable
                    placeholder='Select call to action'
                  />
                )}
              />
              {errors.ctaText?.type === 'required' &&
                <div className='error-form'>Please select call to action</div>}
            </div>
            <div className='flex flex-col gap-1'>
              <Input
                {...register('ctaLink', {
                  required: true,
                })}
                id='ctaLink'
                autoComplete='on'
                type='text'
                className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
                placeholder='Input call to action link'
              />
              {errors.ctaLink?.type === 'required' &&
                <div className='error-form'>Please input call to action link</div>}
            </div>
          </div>
        </div>

        <div className='text-sm font-semibold flex justify-between items-center gap-4'>
          <div className='flex justify-start items-center gap-4'>
            {hasAccess(USER_TYPE.ADMIN) && <button
              type='button'
              disabled={isLoadingSubmit || isLoadingDelete}
              onClick={() => setOpenModalDelete(true)}
              className='px-4 py-2 text-red-500 hover:text-red-700'
            >
              {isLoadingDelete ? <LoadingSpinner size='small' /> : 'Delete Listing'}
            </button>}
          </div>
          <div className='flex justify-end items-center gap-4'>
            <Link
              href={(isLoadingSubmit || isLoadingDelete) ? '#' : '/dashboard/listings/active'}
              type='button' className='px-4 py-2 bg-primary-white hover:bg-opacity-90 rounded-full border'
            >
              Cancel
            </Link>
            {hasAccess(USER_TYPE.ADMIN) && <button
              type='submit'
              disabled={isLoadingSubmit || isLoadingDelete}
              className='px-4 py-2 text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
            >
              {isLoadingSubmit ? <LoadingSpinner size='small' variant='secondary' /> : 'Save'}
            </button>}
            {hasAccess(USER_TYPE.PROVIDER) && <button
              type='button'
              disabled={isLoadingSubmit || isLoadingDelete}
              onClick={onSavaPending}
              className='px-4 py-2 text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
            >
              {isLoadingSubmit ? <LoadingSpinner size='small' variant='secondary' /> : 'Save as Pending'}
            </button>}
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        type='delete'
        objectName='listings'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModalDelete(false),
            variant: 'secondary',
          },
          {
            label: 'Delete',
            onClick: onDelete,
            variant: 'danger',
          },
        ]}
      />
    </div>
  );
};

export default EditActiveListingPage;