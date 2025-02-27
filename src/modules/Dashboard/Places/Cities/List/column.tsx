import Link from 'next/link';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { Column, PlaceCityProps, PlaceHomeCityProps } from '@ffp-web/app/index.types';

import { ColumnCitiesProps, ColumnHomeCitiesProps } from './List.types';

export const columnCities = ({
  handleDelete, handleAddToHome,
}: ColumnCitiesProps): Column<PlaceCityProps>[] =>
  [
    {
      header: 'City',
      accessor: 'cityName',
    },
    {
      header: 'Country',
      accessor: 'countryName',
    },
    {
      header: 'Region',
      accessor: 'regionName',
    },
    {
      header: '',
      render: (_, row) => (
        <div className='flex justify-end gap-4'>
          <button
            onClick={() => handleAddToHome(row)}
            disabled={row.isShowOnHome}
            className={`${(row.isShowOnHome) ? 'text-gray-300' : 'text-primary-btn'} font-semibold`}
          >
            Show on Home
          </button>
          <button
            onClick={() => handleDelete(row)}
          >
            <FiTrash2 size={20} />
          </button>
          <Link
            href={`/dashboard/places/cities/edit/${row.cityId}`}
          >
            <FiEdit2 size={20} />
          </Link>
        </div>
      ),
    },
  ];

export const columnHomeCities = ({
  handleRemoveFromHome,
}: ColumnHomeCitiesProps): Column<PlaceHomeCityProps>[] =>
  [
    {
      header: 'City',
      accessor: 'cityName',
    },
    {
      header: 'Country',
      accessor: 'countryName',
    },
    {
      header: 'Region',
      accessor: 'regionName',
    },
    {
      header: '',
      render: (_, row) => (
        <div className='flex justify-end gap-4'>
          <button
            onClick={() => handleRemoveFromHome(row)}
            className='text-primary-btn font-semibold'
          >
            Hide from Home
          </button>
        </div>
      ),
    },
  ];