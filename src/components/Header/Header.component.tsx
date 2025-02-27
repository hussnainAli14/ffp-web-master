'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa6';
import { MdOutlineAccountCircle } from 'react-icons/md';

import { AccountMenu, LoadingSpinner, Search } from '@ffp-web/components';
import { convertGDriveLinkToSrc } from '@ffp-web/utils/link.utils';
import { ffpLogo } from '@public/images';

import useHeader from './useHeader';

const Header = () => {
  const {
    isHome,
    isProductDetail,
    isScrollTop,
    isOpenMenu,
    setIsOpenMenu,
    buttonRef,
    menuRef,
    categories,
    selectedCategory,
    handleSelectCategory,
    handleClickMenuCategory,
    handleClickMenuAccount,
    places,
    selectedPlace,
    handleSelectPlaces,
    handleClickMenuPlaces,
    loading,
    isDekstop,
  } = useHeader();

  return (
    <div className='relative sticky top-0 z-50'>
      <div
        className={`${(isScrollTop && isHome && !isOpenMenu.category && !isOpenMenu.places && !isOpenMenu.account) ? 'bg-transparent' : 'bg-primary-bg'}
          transition-all duration-1000 ease-in-out px-4 md:px-20 xl:px-28 py-4 text-primary-white
          flex flex-col lg:flex-row lg:items-center gap-4`}
      >
        {/* for mobile view */}
        {!isDekstop &&
          <div className='w-full flex gap-2 justify-between items-center'>
            <div className='relative flex items-center gap-2'>
              <Link href='/home' className='min-w-12'>
                <Image src={ffpLogo} height={32} alt='FFP Logo' priority />
              </Link>
            </div>
            <div className='flex items-center gap-3'>
              <button
                ref={buttonRef.places}
                className='text-base text-shadow font-semibold flex items-center gap-2'
                onClick={handleClickMenuPlaces}
              >
                <div>Places</div>
                <div>{isOpenMenu.places ? <FaChevronUp /> : <FaChevronDown />}</div>
              </button>
              <button
                ref={buttonRef.category}
                className='text-base text-shadow font-semibold flex items-center gap-2'
                onClick={handleClickMenuCategory}
              >
                <div>Things to Do</div>
                <div>{isOpenMenu.category ? <FaChevronUp /> : <FaChevronDown />}</div>
              </button>
              <button
                ref={buttonRef.account}
                onClick={handleClickMenuAccount}
              >
                <div><MdOutlineAccountCircle size={32} /></div>
              </button>
            </div>
          </div>
        }
        {!isDekstop && !isProductDetail &&
          <div className='w-full flex'>
            <Search id='search-mobile' />
          </div>
        }

        {/* for web view */}
        {isDekstop &&
          <div className='w-full lg:w-2/5 xl:w-1/2 flex items-center gap-4'>
            <Link href='/home' className='min-w-12'>
              <Image src={ffpLogo} height={48} alt='FFP Logo' priority />
            </Link>
            <Search id='search-web' />
          </div>
        }
        {isDekstop &&
          <div className='w-full lg:w-3/5 xl:w-1/2 flex flex-wrap-reverse justify-between items-center gap-4'>
            <div className='flex items-center gap-4'>
              <button
                ref={buttonRef.places}
                className='text-base text-shadow font-semibold flex items-center gap-4'
                onClick={handleClickMenuPlaces}
              >
                <div>Places</div>
                <div>{isOpenMenu.places ? <FaChevronUp /> : <FaChevronDown />}</div>
              </button>
              <button
                ref={buttonRef.category}
                className='text-base text-shadow font-semibold flex items-center gap-4'
                onClick={handleClickMenuCategory}
              >
                <div>Things to Do</div>
                <div>{isOpenMenu.category ? <FaChevronUp /> : <FaChevronDown />}</div>
              </button>
            </div>
            <div className='flex flex-wrap items-center gap-8'>
              <Link
                className='text-base text-shadow font-semibold'
                href='/become-a-provider'
              >
                Become a Provider
              </Link>
              <button
                ref={buttonRef.account}
                onClick={handleClickMenuAccount}
              >
                <MdOutlineAccountCircle size={36} />
              </button>
            </div>
          </div>
        }
      </div>

      <div
        ref={menuRef.category}
        className={`${isOpenMenu.category ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
          absolute origin-top w-full bg-primary-bg transition-all duration-1000 ease-in-out`}
      >
        {loading.category ?
          <div className='py-8'><LoadingSpinner /> </div> : (
            <div className='w-full px-4 md:px-20 xl:px-28 py-8 text-primary-white flex flex-col xl:flex-row xl:flex-no-wrap gap-4'>
              <div className='w-full xl:w-1/6 pb-3 xl:pr-3 overflow-scroll no-scroll-indicator
                flex xl:flex-col xl:w-48 border-b xl:border-b-0 border-r-0 xl:border-r border-primary-gray'>
                {categories.map(item => (
                  <button
                    key={item.categoryId}
                    onClick={() => handleSelectCategory(item)}
                    className={`${item.categoryId === selectedCategory?.categoryId ? 'text-primary-white bg-secondary-bg' : 'text-primary-gray bg-primary-bg'}
                      p-3 w-auto rounded-md hover:text-primary-white hover:bg-secondary-bg`}
                  >
                    <div className='text-left text-base text-nowrap font-semibold'>
                      {item.categoryName}
                    </div>
                  </button>
                ))}
              </div>
              <div className='w-full xl:w-5/6 max-h-96 overflow-y-scroll no-scroll-indicator'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1'>
                  {selectedCategory?.subCategories?.map(item => (
                    <Link
                      href={`/category/${selectedCategory.categoryId}?categoryName=${selectedCategory.categoryName}&subCategoryId=${item.subCategoryId}&subCategoryName=${item.subCategoryName}`}
                      key={item.subCategoryId}
                      className='flex items-center gap-4 hover:bg-secondary-bg rounded-full p-1'
                      onClick={handleClickMenuCategory}
                    >
                      <div className='h-9 w-9 rounded-full relative'>
                        {item.image &&
                          <Image
                            src={convertGDriveLinkToSrc(item.image)}
                            alt={item.subCategoryName}
                            fill
                            sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
                            className='rounded-full object-cover'
                            priority
                          />
                        }
                      </div>
                      <div className='text-base font-semibold text-nowrap'>
                        {item.subCategoryName}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>

      <div
        ref={menuRef.places}
        className={`${isOpenMenu.places ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
          absolute origin-top w-full bg-primary-bg transition-all duration-1000 ease-in-out`}
      >
        {loading.places ?
          <div className='py-8'><LoadingSpinner /> </div> : (
            <div className='w-full px-4 md:px-20 xl:px-28 py-8 text-primary-white flex flex-col xl:flex-row xl:flex-no-wrap gap-4'>
              <div className='w-full xl:w-1/6 pb-3 xl:pr-3 overflow-scroll no-scroll-indicator
                flex xl:flex-col xl:w-48 border-b xl:border-b-0 border-r-0 xl:border-r border-primary-gray'>
                {places.map(item => (
                  <button
                    key={item.regionId}
                    onClick={() => handleSelectPlaces(item)}
                    className={`${item.regionId === selectedPlace?.regionId ? 'text-primary-white bg-secondary-bg' : 'text-primary-gray bg-primary-bg'}
                      p-3 w-auto rounded-md hover:text-primary-white hover:bg-secondary-bg`}
                  >
                    <div className='text-left text-base text-nowrap font-semibold'>
                      {item.regionName}
                    </div>
                  </button>
                ))}
              </div>
              <div className='w-full xl:w-5/6 max-h-96 overflow-y-scroll no-scroll-indicator'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1'>
                  {selectedPlace?.cities?.map(item => (
                    <Link
                      href={`/city/${item.cityId}?city=${item.cityName}`}
                      key={item.cityId}
                      className='flex items-center gap-4 hover:bg-secondary-bg rounded-full p-1'
                      onClick={handleClickMenuPlaces}
                    >
                      <div className='h-9 w-9 rounded-full relative'>
                        {item.image &&
                          <Image
                            src={convertGDriveLinkToSrc(item.image)}
                            alt={item.cityName}
                            fill
                            sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
                            className='rounded-full object-cover'
                            priority
                          />
                        }
                      </div>
                      <div className='text-base font-semibold text-nowrap'>
                        {item.cityName}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>

      <div
        ref={menuRef.account}
        className={`${isOpenMenu.account ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
          absolute origin-top w-full md:w-auto right-0 transition-all duration-1000 ease-in-out`}
      >
        <AccountMenu onClick={() => setIsOpenMenu(prev => ({ ...prev, account: false }))} />
      </div>
    </div>
  );
};

export default Header;