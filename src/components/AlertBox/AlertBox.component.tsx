import classNames from 'classnames';
import { IoWarning } from 'react-icons/io5';

import { Props } from './AlertBox.types';

const AlertBox = (props: Props) => {
  const { type, children } = props;

  return (
    <div
      className={classNames(
        'w-full rounded p-2 border flex gap-3', {
        'bg-amber-50 border-orange-200': type === 'warning',
      })}
    >
      <div className={classNames(
        'mt-1', {
        'text-orange-500': type === 'warning',
      })}>
        <IoWarning size={24} />
      </div>
      <div className={classNames(
        'text-sm font-medium', {
        'text-orange-800': type === 'warning',
      })}>
        {children}
      </div>
    </div>
  );
};

export default AlertBox;