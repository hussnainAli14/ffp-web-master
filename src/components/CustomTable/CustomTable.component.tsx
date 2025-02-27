import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { ReactNode } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

import { Column, CustomTableProps } from '@ffp-web/app/index.types';
import { EmptyPage } from '@ffp-web/modules/Website';

const emptyRow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CustomTable = <T,>(props: CustomTableProps<T>) => {
  const { columns, data, emptyCaption, isLoading, orderRow } = props;

  const renderCells = (row: T, column: Column<T>) => {
    if (column.accessor && column.render) return column.render(row[column.accessor], row);

    if (column.accessor && !column.render) return (row[column.accessor] as ReactNode);

    if (!column.accessor && column.render) return column.render(undefined, row);

    return null;
  };

  const renderTable = () => (
    <div className='overflow-x-auto'>
      <table className='min-w-full table-auto border-collapse border rounded-lg'>
        <thead className='bg-gray-100'>
          <tr>
            {orderRow &&
              <th className='px-4 py-2 w-12 text-left text-sm font-semibold text-gray-700 border-y'>

              </th>
            }
            <th className='px-4 py-2 w-12 text-left text-sm font-semibold text-gray-700 border-y'>
              {orderRow ? 'Order' : 'No.'}
            </th>
            {columns.map((column, index) => (
              <th
                key={index}
                className={classNames('px-4 py-2 text-left text-sm text-nowrap font-semibold text-gray-700', column.headerClassName)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!isLoading && data.map((row, rowIndex) => (
            <tr key={rowIndex} className='even:bg-gray-50 odd:bg-primary-white border-y'>
              {orderRow &&
                <td className='px-4 py-4 text-sm text-gray-500 flex items-center gap-4'>
                  <button
                    disabled={rowIndex === 0}
                    className='disabled:text-gray-300'
                    onClick={() => orderRow.moveUp(row[orderRow.orderKey] as number)}
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    disabled={rowIndex === (data.length - 1)}
                    className='disabled:text-gray-300'
                    onClick={() => orderRow.moveDown(row[orderRow.orderKey] as number)}
                  >
                    <FaArrowDown />
                  </button>
                </td>
              }
              <td className='px-4 py-4 text-sm text-gray-800'>
                {orderRow ? row[orderRow.orderKey] as number : rowIndex + 1}
              </td>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={classNames('px-4 py-4 text-left text-sm text-gray-800', column.cellClassName)}
                >
                  {renderCells(row, column)}
                </td>
              ))}
            </tr>
          ))}
          {isLoading && (data.length ? data : emptyRow).map((row, rowIndex) => (
            <tr key={rowIndex} className='even:bg-gray-50 odd:bg-primary-white border-y'>
              {orderRow &&
                <td className='px-4 py-4 text-sm text-gray-800'>
                  <div className='w-10 py-1.5 my-1 animate-pulse bg-gray-200 rounded-full' />
                </td>
              }
              <td className='px-4 py-4 text-sm text-gray-800'>
                <div className='w-full py-1.5 my-1 animate-pulse bg-gray-200 rounded-full' />
              </td>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className='px-4 py-4 text-sm text-gray-800'
                >
                  <div className='w-full py-1.5 my-1 animate-pulse bg-gray-200 rounded-full' />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEmptyData = () => (
    <EmptyPage caption={emptyCaption} />
  );

  if (!isLoading && isEmpty(data)) return renderEmptyData();

  return renderTable();
};

export default CustomTable;