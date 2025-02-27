import classNames from 'classnames';

import { Props } from './Chip.types';

const Chip = (props: Props) => {
  const {
    size,
    variant,
    children,
  } = props;

  let color = '';
  let sizes = '';

  if (variant === 'success') color = 'text-green-700 bg-green-50 border-green-300';
  if (variant === 'warning') color = 'text-yellow-700 bg-yellow-50 border-yellow-300';
  if (variant === 'error') color = 'text-red-700 bg-red-50 border-red-300';

  if (size === 'sm') sizes = 'px-2.5 py-0.5 font-sm';
  if (size === 'md') sizes = 'px-3 py-1 text-base';
  if (size === 'lg') sizes = 'px-3.5 py-1 text-xl';

  return (
    <div className={classNames('font-semibold border rounded-full', color, sizes)}>
      {children}
    </div>
  );
};

export default Chip;