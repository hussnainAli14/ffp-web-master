'use client';

import Image from 'next/image';
import { FaSignOutAlt } from 'react-icons/fa';

import { ffpLogo } from '@public/images';

import { SidebarProps } from './Layouts.types';
import MenuItem from './MenuItem.component';
import { menus } from './menus';

const Sidebar = (props: SidebarProps) => {
  const {
    isCollapsed,
    setIsCollapsed,
    pathname,
    openSubMenus,
    toggleSubMenu,
    handleLogout,
    userType,
  } = props;

  return (
    <div
      className={`fixed top-0 left-0 z-50 flex flex-col h-screen bg-primary-bg text-primary-white transition-width duration-300 ${isCollapsed ? 'w-16' : 'w-64'
        }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className='p-4 focus:outline-none hover:bg-secondary-bg'
      >
        <Image src={ffpLogo} height={48} alt='FFP Logo' priority />
      </button>

      <nav className='flex-grow'>
        {menus.map((menu, index) => userType && menu.access.includes(userType) && (
          <div key={index + menu.label}>
            <MenuItem
              label={menu.label}
              icon={menu.icon}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              href={menu.href}
              subMenuItems={menu.subMenuItems}
              isSubMenuOpen={openSubMenus[menu.label]}
              onToggleSubMenu={() => toggleSubMenu(menu.label)}
              pathname={pathname}
              userType={userType}
            />
          </div>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className='block py-2 px-4 hover:bg-red-600 text-base font-semibold flex items-center'
      >
        <span className='mr-2'>
          <FaSignOutAlt />
        </span>
        {isCollapsed ? null : 'Logout'}
      </button>
    </div>
  );
};

export default Sidebar;
