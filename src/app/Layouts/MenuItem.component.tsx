'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa6';

import { MenuItemProps } from './Layouts.types';

const MenuItem = (props: MenuItemProps) => {
  const {
    label,
    icon,
    isCollapsed,
    setIsCollapsed,
    href,
    subMenuItems,
    isSubMenuOpen,
    onToggleSubMenu,
    pathname,
    userType,
  } = props;

  const isMenuActive = pathname?.includes(href);
  const isSubMenuActive = subMenuItems?.some(e => pathname?.includes(e.href));

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div>
      {subMenuItems && subMenuItems.length > 0 ? (
        <button
          onClick={onToggleSubMenu}
          className={`block w-full text-base hover:text-primary-white text-left font-semibold py-2.5 px-4 hover:bg-secondary-bg flex items-center
            ${isMenuActive || isSubMenuActive ? 'text-primary-white bg-secondary-bg' : 'text-quarternary-gray'}`}
        >
          <span className='mr-2'>{icon}</span>
          {isCollapsed ? null : label}
          <span className='ml-auto'>{isSubMenuOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
      ) : (
        <Link
          href={href}
          onClick={() => isMobile && setIsCollapsed(true)}
          className={`block w-full text-base hover:text-primary-white text-left font-semibold py-2.5 px-4 hover:bg-secondary-bg flex items-center
            ${isMenuActive || isSubMenuActive ? 'text-primary-white bg-secondary-bg' : 'text-quarternary-gray'}`}
        >
          <span className='mr-2'>{icon}</span>
          {isCollapsed ? null : label}
        </Link>
      )}
      {isSubMenuOpen && (
        <div>
          {subMenuItems?.map((item, index) => userType && item.access.includes(userType) && (
            <Link
              key={index + item.label}
              href={item.href}
              onClick={() => isMobile && setIsCollapsed(true)}
              className={`flex items-center py-2.5 px-4 hover:bg-secondary-bg text-base hover:text-primary-white font-semibold
                ${pathname.includes(item.href) ? 'text-primary-white bg-secondary-bg' : 'text-quarternary-gray'}`}
            >
              <span className='ml-2 mr-2'>{item.icon}</span>
              {isCollapsed ? null : item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;