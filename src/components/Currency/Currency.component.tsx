import { Listbox } from '@headlessui/react';

import { Country } from '@ffp-web/app/index.types';

type Props = {
  countries: Country[],
  value: string,
  onChange: (val: string) => void,
}

const Currency = (props: Props) => {
  const { countries, value, onChange } = props;

  const breakValue = value.split('-');
  const country = breakValue[0];

  return (
    <div className='w-auto'>
      <Listbox value={value} onChange={onChange}>
        <div className='relative'>
          <Listbox.Button className='w-auto cursor-pointer rounded-lg py-2 px-4 flex items-center justify-between'>
            <span className='flex items-center space-x-2'>
              <span>{countries.find(e => e.iso2 === country)?.emoji}</span>
              <span>{countries.find(e => e.iso2 === country)?.currency}</span>
            </span>
          </Listbox.Button>

          <Listbox.Options className='absolute mt-2 w-auto bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto'>
            {countries.map((country) => (
              <Listbox.Option
                key={country.id}
                value={`${country.iso2}-${country.currency}-${country.currency_symbol}`}
                className={'cursor-pointer py-2 px-4 flex items-center space-x-2 hover:bg-gray-100'}
              >
                <span>{country.emoji}</span>
                <span>{country.currency}</span>
                <span>{country.name}</span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default Currency;