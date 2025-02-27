'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa6';

import { FilterModal, SummaryCard } from '@ffp-web/components';
import { formatNumberWithCommas } from '@ffp-web/utils/number.utils';

import useDashboard from './useDashboard';

const DashboardPage = () => {
  const {
    countries,
    cities,
    listings,
    usersByCountry,
    providersByCountry,
    filterUser,
    setFilterUser,
    filterListing,
    setFilterListing,
    filterProvider,
    setFilterProvider,
    handleCloseListingCountry,
    handleCloseListingCity,
    handleCloseProviderCountry,
    handleCloseUserCountry,
  } = useDashboard({
    limit: 12,
    fetchCountry: true,
    fetchCity: true,
    fetchListing: true,
    fetchProviderByCountry: true,
    fetchUserByCountry: true,
  });

  return (
    <div className='flex flex-col gap-8'>
      <div className='text-3xl font-semibold'>Dashboard</div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap justify-between items-center gap-4'>
          <div className='text-lg font-normal font-semibold'>
            Users
          </div>
          {usersByCountry.countries.length > 12 &&
            <Link
              href='/dashboard/home/users'
              className='text-sm font-semibold py-1.5 md:py-2.5 px-2 md:px-3.5 bg-primary-white hover:bg-gray-50 border rounded-lg'
            >
              View all
            </Link>
          }
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
          {usersByCountry.summary.map(item =>
            <SummaryCard
              key={item.category}
              title={item.category}
              value={item.count}
              category='Users'
            />
          )}
        </div>
        <div className='flex flex-wrap items-center gap-2 text-sm font-semibold'>
          <div>Filter by</div>
          <button
            onClick={() => setFilterUser(prev => ({ ...prev, openModalCountry: true }))}
            className={classNames(
              'py-1.5 md:py-2.5 px-2 md:px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filterUser.selectedCountry),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterUser.selectedCountry),
            })}
          >
            <span>Country</span> <FaChevronDown />
          </button>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
          {usersByCountry.countries.map(item =>
            <SummaryCard
              key={item.country}
              title={item.country}
              value={item.count}
              category='Users'
              loading={filterUser.loading}
            />
          )}
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap justify-between items-center gap-4'>
          <div className='text-lg font-normal font-semibold'>
            Providers
          </div>
          {providersByCountry.countries.length > 12 &&
            <Link
              href='/dashboard/home/providers'
              className='text-sm font-semibold py-1.5 md:py-2.5 px-2 md:px-3.5 bg-primary-white hover:bg-gray-50 border rounded-lg'
            >
              View all
            </Link>
          }
        </div>
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
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
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

      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap justify-between items-center gap-4'>
          <div className='text-lg font-normal'>
            <span className='font-semibold'>Listings</span> (Total: {formatNumberWithCommas(listings.total, 0)} active listings)
          </div>
          {listings.listings.length > 12 &&
            <Link
              href='/dashboard/home/listings'
              className='text-sm font-semibold py-1.5 md:py-2.5 px-2 md:px-3.5 bg-primary-white hover:bg-gray-50 border rounded-lg'
            >
              View all
            </Link>
          }
        </div>
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
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
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

      {filterUser.openModalCountry &&
        <FilterModal
          items={countries.map(item => ({ value: item.countryId, label: item.countryName }))}
          selectedItems={filterUser.selectedCountry}
          onSave={handleCloseUserCountry}
          onBack={handleCloseUserCountry}
          title='Countries'
          isMulti
        />
      }

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

export default DashboardPage;