import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { STORAGE_KEY, USER_TYPE, UserData } from '@ffp-web/app/index.types';
import { addToBookmark, removeFromBookmark } from '@ffp-web/lib/bookmark/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getStorage, getToken, hasAccess, removeStorage, setStorage } from '@ffp-web/utils/storage.utils';

import { BookmarkState, LoadingState, Props, UseProductCard } from './ProductCard.types';

const useProductCard = ({ product }: Props): UseProductCard => {
  const router = useRouter();

  const [bookmarkInfo, setBookmarkInfo] = useState<BookmarkState>({ isLogin: false, isBookmarked: false });
  const [isLoading, setIsLoading] = useState<LoadingState>({ bookmark: false });

  const states = {
    bookmarkInfo,
    setBookmarkInfo,
    isLoading,
    setIsLoading,
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.preventDefault();
    }
  };

  const handleBookmark = async () => {
    try {
      setIsLoading(prev => ({ ...prev, bookmark: true }));
      if (!bookmarkInfo.isLogin) {
        toast.warning('Login to add “Must Do“ listings');
        return;
      }

      const userData = getStorage(STORAGE_KEY.USER) as UserData;

      if (!bookmarkInfo.isBookmarked && product.productId) {
        await _addBookmark(product.productId, userData);
        return;
      }

      if (bookmarkInfo.isBookmarked && product.productId) {
        await _removeBookmark(product.productId, userData);
        return;
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(prev => ({ ...prev, bookmark: false }));
    }
  };

  const _addBookmark = async (productId: string, userData: UserData) => {
    const { data, message } = await addToBookmark({ productId, token: getToken() });

    if (data) {
      setBookmarkInfo(prev => ({ ...prev, isBookmarked: true }));
      const bookmarks = [...userData.bookmarks, productId];
      setStorage(STORAGE_KEY.USER, { ...userData, bookmarks });
      toast.success(`“${product?.productName}” successfully added to your Must Do`);
    } else {
      if (message === 'Unauthorized') {
        removeStorage(STORAGE_KEY.USER);
        router.refresh();
      }
      toast.error(message);
    }
  };

  const _removeBookmark = async (productId: string, userData: UserData) => {
    const { data, message } = await removeFromBookmark({ productId, token: getToken() });
    if (data) {
      setBookmarkInfo(prev => ({ ...prev, isBookmarked: false }));
      const bookmarks = userData.bookmarks.filter(e => e !== productId);
      setStorage(STORAGE_KEY.USER, { ...userData, bookmarks });
      toast.success(`“${product?.productName}” successfully removed from your Must Do`);
    } else {
      if (message === 'Unauthorized') {
        removeStorage(STORAGE_KEY.USER);
        router.refresh();
      }
      toast.error(message);
    }
  };

  useEffect(() => {
    const userData = getStorage(STORAGE_KEY.USER) as UserData | null;
    if (product.productId && userData) {
      setBookmarkInfo(prev => ({
        ...prev,
        isLogin: hasAccess(USER_TYPE.USER),
        isBookmarked: userData?.bookmarks?.includes(product.productId),
      }));
    }
  }, [product.productId]);

  return {
    ...states,
    handleCardClick,
    handleBookmark,
  };
};

export default useProductCard;