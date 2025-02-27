import { Props } from './Tag.types';

const Tag = (props: Props) => {
  const {
    text,
    size = 'medium',
  } = props;

  let padding = 'px-2.5 py-1';
  let fSize = 'text-sm';

  if (size === 'large') padding = 'px-3 py-1.5';
  if (size === 'small') fSize = 'text-xs';

  return (
    <div className={`${padding} rounded-full border bg-secondary-gray ${fSize} text-primary-chip font-medium`}>
      {text}
    </div>
  );
};

export default Tag;