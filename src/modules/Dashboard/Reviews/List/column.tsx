import { isEmpty } from 'lodash';
import moment from 'moment';
import { FiImage, FiTrash2 } from 'react-icons/fi';

import { Column, ListReviewProps } from '@ffp-web/app/index.types';

import { ColumnProps } from './List.types';

export const columns = ({
  handleDelete, handleViewImage,
}: ColumnProps): Column<ListReviewProps>[] =>
  [
    {
      header: 'Listing name',
      accessor: 'productName',
    },
    {
      header: 'User',
      accessor: 'userName',
    },
    {
      header: 'Review',
      accessor: 'review',
      render: (value) => <div className='text-wrap max-w-96'>{value}</div>,
    },
    {
      header: 'Overall',
      accessor: 'overallScore',
    },
    {
      header: 'Staff',
      accessor: 'staffScore',
    },
    {
      header: 'Facilities',
      accessor: 'facilitesScore',
    },
    {
      header: 'Value for money',
      accessor: 'valueForMoneyScore',
    },
    {
      header: 'Reviewed at',
      accessor: 'createdAt',
      render: (value) => moment(value).format('hh:mm A - DD/MM/YYYY'),
    },
    {
      header: '',
      render: (_, row) => (
        <div className='flex justify-end gap-4'>
          {!isEmpty(row.images) &&
            <button
              onClick={() => handleViewImage(row)}
            >
              <FiImage size={20} />
            </button>
          }
          <button
            onClick={() => handleDelete(row)}
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      ),
    },
  ];