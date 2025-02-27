import classNames from 'classnames';

import { Props } from './LoadingSpinner.types';

const LoadingSpinner = (props: Props) => {
  const {
    size = 'medium',
    variant = 'primary',
  } = props;

  return (
    <div className='flex justify-center items-center'>
      <div className={classNames(
        'border-4 border-t-transparent rounded-full animate-spin', {
        'w-5 h-5 border-2': size === 'xsmall',
        'w-6 h-6': size === 'small',
        'w-12 h-12': size === 'medium',
        'w-16 h-16': size === 'large',
        'border-primary-btn': variant === 'primary',
        'border-gray-50': variant === 'secondary',
      }
      )} />
    </div>
  );
};

export default LoadingSpinner;
