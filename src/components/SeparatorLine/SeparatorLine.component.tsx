import { Props } from './SeparatorLine.types';

const SeparatorLine = (props: Props) => {
  const { horizontal, vertical } = props;

  if (horizontal) return <div className='border-t w-full h-[1px]' />;
  
  if (vertical) return <div className='border-l w-[1px] h-full' />;

  return null;
};

export default SeparatorLine;