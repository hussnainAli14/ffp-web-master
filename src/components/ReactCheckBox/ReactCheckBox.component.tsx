import { Checkbox } from '@headlessui/react';

import { Props } from './ReactCheckBox.types';

const ReactCheckBox = (props: Props) => {
  const { id, name, checked, onChange } = props;

  return (
    <Checkbox
      id={id}
      name={name ?? id}
      checked={checked}
      onChange={onChange}
      className='group block size-4 rounded border bg-white data-[checked]:bg-primary-btn'
    >
      <svg className='stroke-white opacity-0 group-data-[checked]:opacity-100' viewBox='0 0 14 14' fill='none'>
        <path d='M3 8L6 11L11 3.5' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    </Checkbox>
  );
};

export default ReactCheckBox;