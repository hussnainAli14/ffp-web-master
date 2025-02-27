'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FaChevronDown } from 'react-icons/fa6';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, FilterModal, SummaryCard } from '@ffp-web/components';

import useDashboard from './useDashboard';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Dashboard', href: '/dashboard/home' },
  { id: '2', name: 'All Users', href: '#' },
];

const DashboardUsersPage = () => {
  const {
    countries,
    usersByCountry,
    filterUser,
    setFilterUser,
    handleCloseUserCountry,
  } = useDashboard({
    fetchCountry: true,
    fetchUserByCountry: true,
  });

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>
          All Users
        </div>
      </div>

      <div className='flex flex-col gap-4'>
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
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4'>
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
    </div>
  );
};

export default DashboardUsersPage;