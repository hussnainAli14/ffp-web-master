'use client';

import dynamic from 'next/dynamic';
import { Props } from 'react-select';

const Select = dynamic(() => import('react-select'), { ssr: false });

const ReactSelect = (props: Props) => {
  return (
    <Select
      {...props}
      menuPlacement='auto'
      classNamePrefix='custom-select'
      classNames={{
        control: (state) => `text-base font-normal rounded-md min-h-11 border ${state.isFocused ? 'shadow-primary-btn border-primary-btn' : ''}`,
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          borderColor: state.isFocused ? '#0E7090' : 'transparent',
          boxShadow: state.isFocused ? '0px 0px 0px 1px #0E7090' : '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
          ':hover': {
            borderColor: state.isFocused ? '#0E7090' : 'transparent',
            boxShadow: state.isFocused ? '0px 0px 0px 1px #0E7090' : '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
          },
        }),
      }}
    />
  );
};

export default ReactSelect;