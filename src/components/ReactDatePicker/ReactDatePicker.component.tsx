import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { Props } from './ReactDatePicker.types';

const ReactDatePicker = (props: Props) => {
  const { value, onChange } = props;

  return (
    <DatePicker
      value={value ? dayjs(value) : null}
      onChange={val => onChange?.(val ? dayjs(val).format('YYYY-MM-DD') : '')}
      format='DD/MM/YYYY'
      sx={{
        '.MuiOutlinedInput-root': {
          height: '44px',
          backgroundColor: 'white',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB', // Default border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB', // Border color on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0E7090', // Border color when focused
          },
        },
      }}

    />
  );
};

export default ReactDatePicker;