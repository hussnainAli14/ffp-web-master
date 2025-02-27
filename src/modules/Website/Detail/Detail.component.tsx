'use client';

import { isNumber } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { FaArrowLeft, FaQuestion, FaStar } from 'react-icons/fa';
import { FiArrowUpRight, FiCalendar, FiUsers } from 'react-icons/fi';
import { IoMdTime, IoMdHeartEmpty, IoMdHeart, IoMdShare } from 'react-icons/io';
import { IoLocationOutline } from 'react-icons/io5';
import { LuShare2, LuPhoneCall, LuCopyCheck } from 'react-icons/lu';
import { MdOutlineNoteAlt } from 'react-icons/md';
import { PiMoneyWavy, PiRuler } from 'react-icons/pi';

import { CTA_TYPE } from '@ffp-web/app/index.types';
import { ConfirmationModal, ImagesModal, LoadingSpinner, ProductCard, ReviewComponent, ReviewModal, SectionTitle, Tag } from '@ffp-web/components';
import { formatYoutubeLinkToEmbed } from '@ffp-web/utils/link.utils';
import { formatNumberWithCommas } from '@ffp-web/utils/number.utils';

import { ImageLayout } from './ImageLayout';
import { ListReview } from './ListReview';
import { OperationalHours } from './OperationalHours';
import { SectionInformation } from './SectionInformation';
import useDetail from './useDetail';

const DetailPage = () => {
  const {
    product,
    reviews,
    reviewSummary,
    products,
    getCtaText,
    isLoading,
    openModal,
    setOpenModal,
    handleOpenImage,
    imageIndex,
    handleShareLink,
    onBack,
    userInfo,
    handleBookmark,
    handleClickReview,
    handleRefecthReview,
    onDeleteReview,
    handleViewImage,
    imageReview,
  } = useDetail();

  const currency = product?.currency?.split('-')?.[1] ?? 'USD';
  const currencySymbol = product?.currency?.split('-')?.[2] ?? '$';

  const getQuickDetailIcon = (type: string, size: number) => {
    switch (type) {
      case 'Location': return <IoLocationOutline size={size} />;
      case 'Price': return <PiMoneyWavy size={size} />;
      case 'Duration':
      case 'Working Hours':
      case 'Time': return <IoMdTime size={size} />;
      case 'Age': return <FiUsers size={size} />;
      case 'Type': return <CgProfile size={size} />;
      case 'Intensity':
      case 'Zone': return <IoMdHeartEmpty size={size} />;
      case 'Date':
      case 'Qualified in': return <FiCalendar size={size} />;
      case 'Distance': return <PiRuler size={size} />;
      default: return <FaQuestion size={size} />;
    }
  };

  const getCtaLeftIcon = (type?: CTA_TYPE, size?: number) => {
    switch (type) {
      case CTA_TYPE.CONTACT_ME:
      case CTA_TYPE.CONTACT: return <LuPhoneCall size={size} />;
      case CTA_TYPE.MAP: return <IoLocationOutline size={size} />;
      case CTA_TYPE.REGISTER: return <MdOutlineNoteAlt size={size} />;
      default: return null;
    }
  };

  const getBookmarkIcon = (size: number) => {
    if (isLoading.bookmark) return <LoadingSpinner size='xsmall' />;
    if (userInfo.isBookmarked) return <IoMdHeart size={size} />;
    return <IoMdHeartEmpty size={size} />;
  };

  return isLoading.productDetail ? (
    <div className='py-24 md:py-56'>
      <LoadingSpinner size='large' />
    </div>
  ) : (
    <div className='mb-8 md:mb-16'>
      {/* for web view */}
      <div className='px-4 md:px-20 xl:px-28 py-6 md:py-12 bg-primary-bg text-primary-white hidden md:flex flex-col gap-6'>
        <div className='flex gap-6 justify-between items-start'>
          <div className='text-2xl md:text-4xl text-wrap font-semibold'>{product?.name}</div>
          <div className='flex gap-2 items-center'>
            <button
              onClick={handleShareLink}
              className='bg-primary-white px-4 py-2.5 rounded-full text-primary-btn flex justify-center items-center'
            >
              {isLoading.copy ? <LuCopyCheck size={20} /> : <LuShare2 size={20} />}
            </button>
            <button
              onClick={handleBookmark}
              className={`${userInfo.isLogin ? 'bg-primary-white text-primary-btn' : 'bg-gray-100 text-gray-400'} px-4 py-2.5 rounded-full flex justify-center items-center`}
            >
              {getBookmarkIcon(20)}
            </button>
            <Link
              href={product?.callToAction.ctaUrl ?? '#'}
              target='_blank'
              className='px-4 py-2 w-56 flex gap-2 items-center justify-center text-primary-black font-semibold bg-secondary-btn hover:bg-opacity-90 rounded-full'
            >
              {getCtaLeftIcon(product?.callToAction.ctaType, 20)}
              {getCtaText(product?.callToAction.ctaType)}
              {product?.callToAction.ctaType === CTA_TYPE.BOOK && <FiArrowUpRight size={20} />}
            </Link>
          </div>
        </div>
        <div className='flex flex-wrap flex-col md:flex-row gap-4 md:gap-6 xl:gap-10 items-start md:items-center'>
          {product?.quickDetails.map((item, index) => (
            <div key={'index-' + index} className='flex items-center gap-2'>
              <div className='p-1.5 md:p-3 flex justify-center items-center rounded-full bg-primary-btn'>
                {getQuickDetailIcon(item.detailType, 22)}
              </div>
              <div className='text-base'>
                {item.detailType}: <span className='font-semibold'>{item.detailValue}</span>
              </div>
            </div>
          ))}
        </div>
        <ImageLayout images={product?.images ?? []} handleOpenImage={handleOpenImage} />
        <div className='flex flex-wrap items-center gap-2'>
          {product?.tags.map(e => <Tag key={e.tagId} text={e.tagName} size='large' />)}
        </div>
      </div>

      {/* for mobile view */}
      <div className='relative w-full md:hidden'>
        <button onClick={onBack} className='absolute left-6 top-3 z-10 text-primary-btn p-2 rounded-full bg-primary-white'>
          <FaArrowLeft size={20} />
        </button>
        <div className='relative w-full bg-primary-bg px-4 py-6 flex gap-3 overflow-x-scroll no-scroll-indicator'>
          {product?.images.map((item, index) => (
            <button
              key={item[0] + index}
              onClick={() => handleOpenImage(index)}
              className='relative min-w-44 flex flex-grow h-60'
            >
              <Image
                src={item}
                alt={`Product image ${index}`}
                fill
                sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
                className='card object-cover rounded-xl'
                priority
              />
            </button>
          ))}
        </div>
        <div className='px-4 py-4 flex flex-col gap-3'>
          <div className='flex justify-between gap-4'>
            <div className='text-2xl text-wrap font-semibold'>
              {product?.name}
            </div>
            <div className='flex items-start gap-2'>
              <button
                onClick={handleShareLink}
                className='text-primary-btn flex justify-start items-start self-start'
              >
                {isLoading.copy ? <LuCopyCheck size={24} /> : <IoMdShare size={24} />}
              </button>
              <button
                onClick={handleBookmark}
                className={`${userInfo.isLogin ? 'text-primary-btn' : 'text-gray-400'} flex justify-start items-start self-start`}
              >
                {getBookmarkIcon(24)}
              </button>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <FaStar color='#F1BC44' size={20} />
              <div className='text-sm font-semibold'>
                {Number(reviewSummary?.reviewScore?.toFixed(2) ?? 0)}
              </div>
            </div>
            <div>•</div>
            <div className='text-sm font-normal text-tertiary-gray'>
              {`${formatNumberWithCommas(reviewSummary?.reviewTotal, 0)} Reviews`}
            </div>
          </div>
          <div className='hidden text-base text-tertiary-gray font-normal'>
            {product?.summary}
          </div>
        </div>
        <div className='px-4 py-4 flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-3'>
            {product?.quickDetails.map((item, index) => (
              <div key={'index-' + index} className='flex items-center gap-2'>
                <div className='p-1.5 flex justify-center items-center rounded-full text-primary-white bg-primary-btn'>
                  {getQuickDetailIcon(item.detailType, 18)}
                </div>
                <div className='text-base font-semibold'>{item.detailValue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-16 px-4 md:px-20 xl:px-28 py-4 md:py-16'>
        <div className='w-full md:w-3/5 xl:w-2/3 flex flex-col gap-6'>
          <div className='flex flex-col gap-3 pb-8 border-b border-gray-300'>
            <div className='hidden text-2xl font-semibold'>
              Summary
            </div>
            <div className='text-base md:text-lg text-tertiary-gray font-normal'>
              {product?.summary}
            </div>
          </div>
          {product?.contents?.map(item => (
            <SectionInformation key={item.title} data={item} />
          ))}
          <Link
            href={product?.callToAction.ctaUrl ?? '#'}
            target='_blank'
            className='hidden px-4 py-2.5 flex gap-2 items-center justify-center text-lg text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full'
          >
            {getCtaLeftIcon(product?.callToAction.ctaType, 20)}
            {getCtaText(product?.callToAction.ctaType)}
            {product?.callToAction.ctaType === CTA_TYPE.BOOK && <FiArrowUpRight size={20} />}
          </Link>
        </div>

        <div className='w-full md:w-2/5 xl:w-1/3 flex flex-col gap-4'>
          {isNumber(product?.startingPrice) && (
            <div className='p-8 bg-tertiary-white rounded-xl flex gap-4 justify-between items-center'>
              <div className='flex flex-col gap-0.5'>
                <div className='text-sm text-primary-gray font-normal'>{`From (${currency})`}</div>
                <div className='text-xl text-primary-black font-semibold'>
                  {currencySymbol}{formatNumberWithCommas(product?.startingPrice ?? 0)}
                </div>
                <div className='text-sm text-primary-black font-semibold'>
                  Per person
                </div>
              </div>
              <Link
                href={product?.callToAction.ctaUrl ?? '#'}
                target='_blank'
                className='px-4 py-2 flex gap-2 items-center justify-center text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full'
              >
                {getCtaText(product?.callToAction.ctaType)}
              </Link>
            </div>
          )}

          {product?.operationalHours.some(e => e.isOpen) &&
            <OperationalHours operationalHours={product.operationalHours} />
          }

          {formatYoutubeLinkToEmbed(product?.videoUrl) &&
            <div className='w-full rounded-xl'>
              <iframe
                id='video-player'
                className='w-full h-56 rounded-2xl'
                src={formatYoutubeLinkToEmbed(product?.videoUrl)}
                title='YouTube video player'
                allowFullScreen
              />
            </div>
          }

          <div className='p-8 flex flex-col gap-6 bg-tertiary-white rounded-xl'>
            <div className='flex flex-wrap justify-between items-center'>
              <div className='text-2xl font-semibold'>Reviews</div>
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2'>
                  <FaStar color='#F1BC44' size={24} />
                  <div className='text-base font-semibold'>{Number(reviewSummary?.reviewScore?.toFixed(2) ?? 0)}</div>
                </div>
                <div>•</div>
                <div className='text-base font-normal text-primary-gray'>{`${formatNumberWithCommas(reviewSummary?.reviewTotal, 0)} Reviews`}</div>
              </div>
            </div>
            {isLoading.review ? (
              <div className='my-4'><LoadingSpinner /></div>
            ) : (
              reviews.map(review => <ReviewComponent key={review.reviewId} review={review} handleViewImage={handleViewImage} />))}
            <div className='flex flex-col gap-4'>
              <button
                disabled={reviewSummary.reviewTotal < 3}
                onClick={() => setOpenModal(prev => ({ ...prev, listReview: true }))}
                className={`${reviewSummary.reviewTotal < 3 ? 'text-gray-300' : 'text-primary-btn'} text-base font-semibold`}
              >
                See More Review
              </button>
              <button
                onClick={handleClickReview}
                className='px-4 py-2 text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full'
              >
                {userInfo.isLogin ? 'Leave Review' : 'Login to Review'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4 md:gap-6 '>
        <div className='px-4 md:px-20 xl:px-28 flex justify-between gap-8'>
          <SectionTitle keyTitle='Related' restTitle={product?.subCategory.subCategoryName} />
          <Link
            href={
              `/category/${product?.category.categoryId}?categoryName=${product?.category.categoryName}&subCategoryId=${product?.subCategory.subCategoryId}&subCategoryName=${product?.subCategory.subCategoryName}&cityId=${product?.city.cityId}&cityName=${product?.city.cityName}`
            }
            className='mt-1.5 text-base md:text-lg text-nowrap text-primary-btn font-semibold'>
            View More
          </Link>
        </div>
        <div className='py-4 px-4 md:px-20 xl:px-28 flex xl:grid xl:grid-cols-4 gap-6 overflow-x-scroll no-scroll-indicator'>
          {products.map(item => <ProductCard key={item.productId} product={item} />)}
        </div>
      </div>

      <div className='fixed w-full md:hidden flex justify-between items-center border-t-2 bottom-0 bg-tertiary-white p-4'>
        <div className='text-tertiary-gray font-normal'>
          <div className='text-sm'>From:</div>
          <div className='text-xs'>
            <span className='text-base text-primary-black font-semibold'>
              {currency} {formatNumberWithCommas(product?.startingPrice ?? 0) ?? '0.00'}
            </span> per person
          </div>
        </div>
        <Link
          href={product?.callToAction.ctaUrl ?? '#'}
          target='_blank'
          className='px-4 py-2 flex gap-2 items-center justify-center text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full'
        >
          {getCtaText(product?.callToAction.ctaType)}
        </Link>
      </div>

      {openModal.images &&
        <ImagesModal
          isOpen={openModal.images}
          onClose={() => setOpenModal(prev => ({ ...prev, images: false }))}
          images={product?.images ?? []}
          defaultImageIndex={imageIndex}
        />
      }

      {openModal.addReview &&
        <ReviewModal
          isOpen={openModal.addReview}
          onClose={() => setOpenModal(prev => ({ ...prev, addReview: false }))}
          productId={product?.productId}
          refetch={handleRefecthReview}
        />
      }

      {openModal.listReview &&
        <ListReview
          isOpen={openModal.listReview}
          onClose={() => setOpenModal(prev => ({ ...prev, listReview: false }))}
          productId={product?.productId}
          handleViewImage={handleViewImage}
        />
      }

      <ConfirmationModal
        isOpen={openModal.deleteReview}
        onClose={() => setOpenModal(prev => ({ ...prev, deleteReview: false }))}
        type='delete'
        objectName='review'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModal(prev => ({ ...prev, deleteReview: false })),
            variant: 'secondary',
          },
          {
            label: 'Delete',
            onClick: onDeleteReview,
            variant: 'danger',
          },
        ]}
      />

      {openModal.imagesReview &&
        <ImagesModal
          isOpen={openModal.imagesReview}
          onClose={() => setOpenModal(prev => ({ ...prev, imagesReview: false }))}
          images={imageReview.images}
          defaultImageIndex={imageReview.defaultIndex}
        />
      }
    </div>
  );
};

export default DetailPage;