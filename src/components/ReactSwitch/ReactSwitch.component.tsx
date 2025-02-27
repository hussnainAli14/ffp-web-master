import { Switch } from '@headlessui/react';
import classNames from 'classnames';

import { Props } from './ReactSwitch.types';

const ReactSwitch = (props: Props) => {
  const { checked, onChange, size } = props;
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={classNames(
        'group inline-flex items-center rounded-full bg-gray-200 transition data-[checked]:bg-primary-btn',
        {
          'h-4 w-9': size === 'sm',
          'h-5 w-10': size === 'md',
          'h-6 w-11': size === 'lg',
        }
      )}
    >
      <span className={classNames(
        'translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6',
        {
          'size-2': size === 'sm',
          'size-3': size === 'md',
          'size-4': size === 'lg',
        }
      )} />
    </Switch>
  );
};

export default ReactSwitch;