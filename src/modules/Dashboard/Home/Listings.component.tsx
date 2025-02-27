'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FaChevronDown } from 'react-icons/fa6';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, FilterModal, SummaryCard } from '@ffp-web/components';
import { formatNumberWithCommas } from '@ffp-web/utils/number.utils';

import useDashboard from './useDashboard';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Dashboard', href: '/dashboard/home' },
  { id: '2', name: 'All Listings', href: '#' },
];

const DashboardListingsPage = () => {
  const {
    countries,
    cities,
    listings,
    filterListing,
    setFilterListing,
    handleCloseListingCountry,
    handleCloseListingCity,
  } = useDashboard({
    fetchCountry: true,
    fetchCity: true,
    fetchListing: true,
  });

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='flex flex-col gap-1'>
          <div className='text-3xl font-semibold'>
            All Listings
          </div>
          <div className='text-lg font-normal'>
            Total active listings: {formatNumberWithCommas(listings.total, 0)} Listings
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-center gap-2 text-sm font-semibold'>
          <div>Filter by</div>
          <button
            onClick={() => setFilterListing(prev => ({ ...prev, openModalCountry: true }))}
            className={classNames(
              'py-1.5 md:py-2.5 px-2 md:px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filterListing.selectedCountry),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterListing.selectedCountry),
            })}
          >
            <span>Country</span> <FaChevronDown />
          </button>
          <button
            onClick={() => setFilterListing(prev => ({ ...prev, openModalCity: true }))}
            disabled={isEmpty(filterListing.selectedCountry)}
            className={classNames(
              'py-1.5 md:py-2.5 px-2 md:px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filterListing.selectedCity) && !isEmpty(filterListing.selectedCountry),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterListing.selectedCity) && !isEmpty(filterListing.selectedCountry),
              'bg-gray-100': isEmpty(filterListing.selectedCountry),
            })}
          >
            <span>City</span> <FaChevronDown />
          </button>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4'>
          {listings.listings.map(item =>
            <SummaryCard
              key={item.category}
              title={item.category}
              value={item.count}
              category='Listings'
              loading={filterListing.loading}
            />
          )}
        </div>
      </div>

      {filterListing.openModalCountry &&
        <FilterModal
          items={countries.map(item => ({ value: item.countryId, label: item.countryName }))}
          selectedItems={filterListing.selectedCountry}
          onSave={handleCloseListingCountry}
          onBack={handleCloseListingCountry}
          title='Countries'
        />
      }
      {filterListing.openModalCity &&
        <FilterModal
          items={cities.map(item => ({ value: item.cityId, label: item.cityName }))}
          selectedItems={filterListing.selectedCity}
          onSave={handleCloseListingCity}
          onBack={handleCloseListingCity}
          title='Cities'
          isMulti
        />
      }
    </div>
  );
};

export default DashboardListingsPage;