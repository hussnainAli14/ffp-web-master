'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { Footer, Header, LoadingSpinner } from '@ffp-web/components';
import { ffpLogo } from '@public/images';

import { Props } from './Layouts.types';
import Sidebar from './Sidebar.component';
import useAuthRedirect from './useAuthRedirect';
import useLayouts from './useLayouts';

const Layouts = ({ children }: Props) => {
  useAuthRedirect();
  const {
    isAuth,
    isDashboard,
    isCollapsed,
    setIsCollapsed,
    pathname,
    openSubMenus,
    toggleSubMenu,
    handleLogout,
    userType,
    hasAccess,
  } = useLayouts();

  const renderMainLayout = () => (
    <Suspense fallback={<LoadingSpinner />}>
      <Header />
      <div className='flex flex-col flex-1'>
        {children}
      </div>
      <Footer />
    </Suspense>
  );

  const renderAuthLayout = () => (
    <Suspense fallback={<LoadingSpinner />}>
      <div className='bg-primary-bg py-4 flex justify-center'>
        <Link href='/home'>
          <Image src={ffpLogo} height={48} alt='FFP Logo' priority />
        </Link>
      </div>
      <div className='px-8 md:px-20 py-10 md:py-24'>
        {children}
      </div>
    </Suspense>
  );

  const renderDashboardLayout = () => (
    <Suspense fallback={<LoadingSpinner />}>
      <div className='relative flex'>
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          pathname={pathname}
          openSubMenus={openSubMenus}
          toggleSubMenu={toggleSubMenu}
          handleLogout={handleLogout}
          userType={userType}
        />
        <div className={`${isCollapsed ? 'ml-16' : 'ml-16 md:ml-64'} transition-width duration-300 p-6 w-full h-full flex flex-grow flex-col overflow-y-auto`}>
          {hasAccess ? children : null}
        </div>
      </div>
    </Suspense>
  );

  const getRenderLayout = () => {
    if (isAuth) return renderAuthLayout();

    if (isDashboard) return renderDashboardLayout();

    return renderMainLayout();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {getRenderLayout()}
    </LocalizationProvider>
  );
};

export default Layouts;