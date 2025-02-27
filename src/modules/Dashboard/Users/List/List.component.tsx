'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FaChevronDown } from 'react-icons/fa6';

import { ConfirmationModal, CustomTable, FilterModal, SearchComponent } from '@ffp-web/components';

import { columns } from './column';
import useList from './useList';

const ListUsersPage = () => {
  const {
    listUsers,
    isLoadingList,
    openModal,
    setOpenModal,
    handleDelete,
    onDelete,
    handleBlock,
    onBlock,
    handleVerify,
    onVerify,
    selectedUser,
    filter,
    setFilter,
    handleCloseFilterCountry,
    handleCloseFilterGender,
    handleCloseFilterAgeGroup,
  } = useList();

  return (
    <div className='flex flex-col gap-8'>
      <div className='text-3xl font-semibold'>
        Users
      </div>

      <div className='flex justify-between items-center flex-wrap gap-6'>
        <div className='flex flex-wrap items-center gap-2 text-sm font-semibold'>
          <div>Filter by</div>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, filterCountry: true }))}
            className={classNames(
              'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filter.selectedCountry),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filter.selectedCountry),
            })}
          >
            <span>Country</span> <FaChevronDown />
          </button>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, filterGender: true }))}
            className={classNames(
              'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filter.selectedGender),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filter.selectedGender),
            })}
          >
            <span>Gender</span> <FaChevronDown />
          </button>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, filterAgeGroup: true }))}
            className={classNames(
              'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filter.selectedAgeGroup),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filter.selectedAgeGroup),
            })}
          >
            <span>Age Group</span> <FaChevronDown />
          </button>
        </div>
        <div className='w-96'>
          <SearchComponent
            id='search-users'
            placeholder='Search by name'
            onPressEnter={query => setFilter(prev => ({ ...prev, query }))}
          />
        </div>
      </div>


      <CustomTable
        columns={columns({ handleDelete, handleBlock, handleVerify })}
        data={listUsers}
        emptyCaption='Users are added after they are signed up'
        isLoading={isLoadingList}
      />

      <ConfirmationModal
        isOpen={openModal.delete}
        onClose={() => setOpenModal(prev => ({ ...prev, delete: false }))}
        type='delete'
        objectName='user'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModal(prev => ({ ...prev, delete: false })),
            variant: 'secondary',
          },
          {
            label: 'Delete',
            onClick: onDelete,
            variant: 'danger',
          },
        ]}
      />

      <ConfirmationModal
        isOpen={openModal.block}
        onClose={() => setOpenModal(prev => ({ ...prev, block: false }))}
        type={selectedUser?.isBlocked ? 'unblock' : 'block'}
        objectName='user'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModal(prev => ({ ...prev, block: false })),
            variant: 'secondary',
          },
          {
            label: selectedUser?.isBlocked ? 'Unblock' : 'Block',
            onClick: onBlock,
            variant: 'primary',
          },
        ]}
      />

      <ConfirmationModal
        isOpen={openModal.verify}
        onClose={() => setOpenModal(prev => ({ ...prev, verify: false }))}
        type='verify'
        objectName='user'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModal(prev => ({ ...prev, verify: false })),
            variant: 'secondary',
          },
          {
            label: 'Verify',
            onClick: onVerify,
            variant: 'primary',
          },
        ]}
      />

      {openModal.filterCountry &&
        <FilterModal
          items={filter.countries.map(item => ({ value: item.countryId, label: item.countryName }))}
          selectedItems={filter.selectedCountry}
          onSave={handleCloseFilterCountry}
          onBack={handleCloseFilterCountry}
          title='Countries'
          isMulti
        />
      }
      {openModal.filterGender &&
        <FilterModal
          items={filter.gender}
          selectedItems={filter.selectedGender}
          onSave={handleCloseFilterGender}
          onBack={handleCloseFilterGender}
          title='Genders'
        />
      }
      {openModal.filterAgeGroup &&
        <FilterModal
          items={filter.ageGroup}
          selectedItems={filter.selectedAgeGroup}
          onSave={handleCloseFilterAgeGroup}
          onBack={handleCloseFilterAgeGroup}
          title='Age Group'
        />
      }
    </div>
  );
};

export default ListUsersPage;
