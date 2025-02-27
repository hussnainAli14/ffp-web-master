'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FaChevronDown } from 'react-icons/fa6';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, FilterModal, SummaryCard } from '@ffp-web/components';

import useDashboard from './useDashboard';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Dashboard', href: '/dashboard/home' },
  { id: '2', name: 'All Providers', href: '#' },
];

const DashboardProvidersPage = () => {
  const {
    countries,
    providersByCountry,
    filterProvider,
    setFilterProvider,
    handleCloseProviderCountry,
  } = useDashboard({
    fetchCountry: true,
    fetchProviderByCountry: true,
  });

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>
          All Providers
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
          {providersByCountry.summary.map(item =>
            <SummaryCard
              key={item.category}
              title={item.category}
              value={item.count}
              category='Providers'
            />
          )}
        </div>
        <div className='flex flex-wrap items-center gap-2 text-sm font-semibold'>
          <div>Filter by</div>
          <button
            onClick={() => setFilterProvider(prev => ({ ...prev, openModalCountry: true }))}
            className={classNames(
              'py-1.5 md:py-2.5 px-2 md:px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filterProvider.selectedCountry),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterProvider.selectedCountry),
            })}
          >
            <span>Country</span> <FaChevronDown />
          </button>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4'>
          {providersByCountry.countries.map(item =>
            <SummaryCard
              key={item.country}
              title={item.country}
              value={item.count}
              category='Providers'
              href={`/dashboard/home/providers/${item.id}?name=${item.country}`}
              loading={filterProvider.loading}
            />
          )}
        </div>
      </div>

      {filterProvider.openModalCountry &&
        <FilterModal
          items={countries.map(item => ({ value: item.countryId, label: item.countryName }))}
          selectedItems={filterProvider.selectedCountry}
          onSave={handleCloseProviderCountry}
          onBack={handleCloseProviderCountry}
          title='Countries'
          isMulti
        />
      }
    </div>
  );
};

export default DashboardProvidersPage;