import type { Props } from './SectionTitle.types';

const SectionTitle = (props: Props) => {
  const { keyTitle, restTitle } = props;

  if (keyTitle && restTitle) {
    return (
      <div className='text-2xl xl:text-3xl font-semibold'>
        <span className='text-primary-btn'>{keyTitle}</span>
        {' '}
        <span className='text-primary-black'>{restTitle}</span>
      </div>
    );
  }

  if (keyTitle) return <div className='text-2xl xl:text-3xl font-semibold text-primary-btn'>{keyTitle}</div>;

  if (restTitle) return <div className='text-2xl xl:text-3xl font-semibold text-primary-black'>{restTitle}</div>;

  return null;
};

export default SectionTitle;