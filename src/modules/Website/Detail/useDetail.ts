import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CTA_TYPE, ListReviewProps, ProductDetailProps, ProductListCardProps, ReviewSummary, SORT_REVIEW, STORAGE_KEY, USER_TYPE, UserData } from '@ffp-web/app/index.types';
import { addToBookmark, removeFromBookmark } from '@ffp-web/lib/bookmark/data';
import { getProductDetail, getProductListCard } from '@ffp-web/lib/product/data';
import { getListReview, getReviewSummary, removeReview } from '@ffp-web/lib/review/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getStorage, getToken, hasAccess, removeStorage, setStorage } from '@ffp-web/utils/storage.utils';

import { LoadingState, ModalState, UseDetail, UserState } from './Detail.types';

const defaultLoading: LoadingState = {
  productDetail: true,
  products: false,
  review: false,
  copy: false,
  bookmark: false,
};

const defaultModal: ModalState = {
  images: false,
  addReview: false,
  listReview: false,
  deleteReview: false,
  imagesReview: false,
};

const useDetail = (): UseDetail => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [product, setProduct] = useState<ProductDetailProps>();
  const [reviews, setReviews] = useState<ListReviewProps[]>([]);
  const [products, setProducts] = useState<ProductListCardProps[]>([]);
  const [isLoading, setIsLoading] = useState<LoadingState>(defaultLoading);
  const [openModal, setOpenModal] = useState<ModalState>(defaultModal);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<UserState>({ isLogin: false, isBookmarked: false });
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary>({ reviewTotal: 0, reviewScore: 0 });
  const [selectedReview, setSelectedReview] = useState<ListReviewProps>();
  const [imageReview, setImageReview] = useState<{ images: string[], defaultIndex?: number }>({ images: [], defaultIndex: 0 });

  const states = {
    productId,
    product,
    setProduct,
    reviews,
    setReviews,
    products,
    setProducts,
    isLoading,
    setIsLoading,
    openModal,
    setOpenModal,
    imageIndex,
    setImageIndex,
    userInfo,
    setUserInfo,
    reviewSummary,
    setReviewSummary,
    selectedReview,
    setSelectedReview,
    imageReview,
    setImageReview,
  };

  const getCtaText = (type?: CTA_TYPE): string => {
    if (type === CTA_TYPE.BOOK) return 'Book Now';
    if (type === CTA_TYPE.CONTACT) return 'Contact Us';
    if (type === CTA_TYPE.MAP) return 'View Map';
    if (type === CTA_TYPE.REGISTER) return 'Register';
    if (type === CTA_TYPE.CONTACT_ME) return 'Contact Me';

    return 'Action';
  };

  const onBack = () => {
    router.back();
  };

  const handleOpenImage = (index?: number) => {
    if (index) {
      setImageIndex(index);
    } else {
      setImageIndex(0);
    }

    setOpenModal(prev => ({ ...prev, images: true }));
  };

  const handleShareLink = async () => {
    try {
      setIsLoading(prev => ({ ...prev, copy: true }));
      if (pathname && product) {
        const urlParams = new URLSearchParams();
        urlParams.set('name', product.name);
        urlParams.set('city', product.city.cityName);
        urlParams.set('category', product.category.categoryName);
        urlParams.set('subcategory', product.subCategory.subCategoryName);
        await navigator.clipboard.writeText(
          `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}?${urlParams.toString()}`
        );
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setTimeout(() => {
        setIsLoading(prev => ({ ...prev, copy: false }));
      }, 2000);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsLoading(prev => ({ ...prev, bookmark: true }));
      if (!userInfo.isLogin) {
        toast.warning('Login to add “Must Do“ listings');
        return;
      }

      const userData = getStorage(STORAGE_KEY.USER) as UserData;

      if (!userInfo.isBookmarked && productId) {
        await _addBookmark(productId, userData);
        return;
      }

      if (userInfo.isBookmarked && productId) {
        await _removeBookmark(productId, userData);
        return;
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(prev => ({ ...prev, bookmark: false }));
    }
  };

  const handleClickReview = () => {
    if (!userInfo.isLogin) {
      router.push('/user/login');
    } else {
      setOpenModal(prev => ({ ...prev, addReview: true }));
    }
  };

  const handleRefecthReview = () => {
    if (productId) {
      setIsLoading(prev => ({ ...prev, review: true }));
      _fetchReviewSummary(productId);
      _fetchReview(SORT_REVIEW.NEWEST, productId, 2);
    }
  };

  const handleDeleteReview = (review: ListReviewProps) => {
    setSelectedReview(review);
    setOpenModal(prev => ({ ...prev, deleteReview: true }));
  };

  const onDeleteReview = () => {
    setOpenModal(prev => ({ ...prev, deleteReview: false }));
    _deleteReview();
  };

  const handleViewImage = (images: string[], defaultIndex?: number) => {
    setImageReview({ images, defaultIndex });
    setOpenModal(prev => ({ ...prev, imagesReview: true }));
  };

  const _addBookmark = async (productId: string, userData: UserData) => {
    const { data, message } = await addToBookmark({ productId, token: getToken() });

    if (data) {
      setUserInfo(prev => ({ ...prev, isBookmarked: true }));
      const bookmarks = [...userData.bookmarks, productId];
      setStorage(STORAGE_KEY.USER, { ...userData, bookmarks });
      toast.success(`“${product?.name}” successfully added to your Must Do`);
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
      setUserInfo(prev => ({ ...prev, isBookmarked: false }));
      const bookmarks = userData.bookmarks.filter(e => e !== productId);
      setStorage(STORAGE_KEY.USER, { ...userData, bookmarks });
      toast.success(`“${product?.name}” successfully removed from your Must Do`);
    } else {
      if (message === 'Unauthorized') {
        removeStorage(STORAGE_KEY.USER);
        router.refresh();
      }
      toast.error(message);
    }
  };

  const _fetchProductDetail = useCallback(async (productId: string) => {
    try {
      const { data, message } = await getProductDetail({ productId });
      if (data) {
        setProduct(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(prev => ({ ...prev, productDetail: false }));
    }
  }, []);

  const _fetchReviewSummary = useCallback(async (productId: string) => {
    try {
      const { data, message } = await getReviewSummary({ productId });
      if (data) {
        setReviewSummary(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, []);

  const _fetchReview = useCallback(async (
    sortBy: SORT_REVIEW,
    productId?: string,
    limit?: number
  ) => {
    try {
      const { data, message } = await getListReview({ productId, sortBy, limit }, getToken());
      if (data) {
        setReviews(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(prev => ({ ...prev, review: false }));
    }
  }, []);

  const _deleteReview = async () => {
    try {
      setIsLoading?.(prev => ({ ...prev, review: true }));
      const { data, message } = await removeReview({ reviewId: selectedReview?.reviewId }, getToken());
      if (data) {
        toast.success(data);
        setSelectedReview(undefined);
        handleRefecthReview();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _fetchProducts = useCallback(async (subCategoryId: string, cityId: number) => {
    try {
      setIsLoading(prev => ({ ...prev, products: true }));
      const { data, message } = await getProductListCard({
        subCategoryId: subCategoryId,
        cities: cityId ? [cityId] : undefined,
        pagination: { limit: 4, offset: 0 },
      });
      if (data) {
        const filtered = data.filter(e => e.productId !== productId);
        setProducts(filtered.slice(0, 4));
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(prev => ({ ...prev, products: false }));
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      setIsLoading(prev => ({ ...prev, review: true, products: true }));
      _fetchProductDetail(productId);
      _fetchReviewSummary(productId);
      _fetchReview(SORT_REVIEW.NEWEST, productId, 2);
    }
  }, [_fetchProductDetail, _fetchReview, _fetchReviewSummary, productId]);

  useEffect(() => {
    if (product?.subCategory.subCategoryId && product?.city.cityId) _fetchProducts(product?.subCategory.subCategoryId, product.city.cityId);
  }, [_fetchProducts, product?.city.cityId, product?.subCategory.subCategoryId]);

  useEffect(() => {
    const userData = getStorage(STORAGE_KEY.USER) as UserData | null;
    if (productId && userData) {
      setUserInfo({
        isLogin: hasAccess(USER_TYPE.USER),
        isBookmarked: userData?.bookmarks?.includes(productId),
      });
    }
  }, [productId]);

  return {
    ...states,
    getCtaText,
    handleOpenImage,
    handleShareLink,
    onBack,
    handleBookmark,
    handleClickReview,
    handleRefecthReview,
    handleDeleteReview,
    onDeleteReview,
    handleViewImage,
  };
};

export default useDetail;