import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';

import { Props } from './Breadcrumbs.types';

const Breadcrumbs = (props: Props) => {
  const { links } = props;

  return (
    <nav className='flex items-center gap-2'>
      {links.map((item, index) => (
        <div
          key={item.id}
          className='flex items-center gap-2 text-sm text-gray-300'
        >
          {index > 0 && <FaChevronRight size={12} />}
          <Link
            href={item.href}
            className='text-tertiary-gray font-medium'
          >
            {item.name}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;