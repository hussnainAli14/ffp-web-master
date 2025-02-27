'use client';

import { useState } from 'react';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';

import { Props } from './Accordian.types';

const Accordion = (props: Props) => {
  const { title, content } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={`${isOpen ? 'bg-primary-white' : 'transparent'}
      p-4 md:p-8 rounded-xl transition-all duration-1000 ease-in-out`}>
      <button
        className='flex w-full gap-6'
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className={`${isOpen ? 'rotate-180' : 'rotate-0'}
          transition-all duration-1000 ease-in-out text-primary-gray`}>
          {isOpen ?
            <AiOutlineMinusCircle className='w-6 h-6' /> :
            <AiOutlinePlusCircle className='w-6 h-6' />
          }
        </div>
        <div className='flex flex-col items-start'>
          <div className='text-lg text-left font-bold'>{title}</div>
          <div className={`${isOpen ? 'max-h-auto scale-y-100 opacity-100 mt-2' : 'max-h-0 scale-y-0 opacity-0'}
            origin-top transition-all duration-100 ease-in-out text-base text-tertiary-gray text-left font-normal`}>
            {content}
          </div>
        </div>
      </button>
    </div>
  );
};

export default Accordion;
