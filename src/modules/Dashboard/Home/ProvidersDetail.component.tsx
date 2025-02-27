'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FaChevronDown } from 'react-icons/fa6';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, FilterModal, SummaryCard } from '@ffp-web/components';

import useDashboard from './useDashboard';

const DashboardProvidersDetailPage = () => {
  const {
    countryName,
    cities,
    providersByCity,
    filterProvider,
    setFilterProvider,
    handleCloseProviderCity,
  } = useDashboard({
    fetchCity: true,
    fectProviderByCity: true,
  });

  const links: BreadcrumbsProps[] = [
    { id: '1', name: 'Dashboard', href: '/dashboard/home' },
    { id: '2', name: 'All Providers', href: '/dashboard/home/providers' },
    { id: '3', name: countryName, href: '#' },
  ];

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>
          {countryName}
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-center gap-2 text-sm font-semibold'>
          <div>Filter by</div>
          <button
            onClick={() => setFilterProvider(prev => ({ ...prev, openModalCity: true }))}
            className={classNames(
              'py-1.5 md:py-2.5 px-2 md:px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filterProvider.selectedCity),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterProvider.selectedCity),
            })}
          >
            <span>City</span> <FaChevronDown />
          </button>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4'>
          {providersByCity.cities.map(item =>
            <SummaryCard
              key={item.city}
              title={item.city}
              value={item.count}
              category='Providers'
              loading={filterProvider.loading}
            />
          )}
        </div>
      </div>

      {filterProvider.openModalCity &&
        <FilterModal
          items={cities.map(item => ({ value: item.cityId, label: item.cityName }))}
          selectedItems={filterProvider.selectedCity}
          onSave={handleCloseProviderCity}
          onBack={handleCloseProviderCity}
          title='Cities'
          isMulti
        />
      }
    </div>
  );
};

export default DashboardProvidersDetailPage;