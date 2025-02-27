import { CTA_TYPE, ListReviewProps, ProductDetailProps, ProductListCardProps, PromiseVoidFunction, ReviewSummary, Setter, VoidFunction } from '@ffp-web/app/index.types';

export type LoadingState = {
  productDetail: boolean,
  products: boolean,
  review: boolean,
  copy: boolean,
  bookmark: boolean,
};

export type ModalState = {
  images: boolean,
  addReview: boolean,
  listReview: boolean,
  deleteReview: boolean,
  imagesReview: boolean,
};

export type UserState = {
  isLogin: boolean,
  isBookmarked: boolean,
};

export type UseDetail = {
  productId?: string,
  product?: ProductDetailProps,
  setProduct: Setter<ProductDetailProps | undefined>,
  reviews: ListReviewProps[],
  setReviews: Setter<ListReviewProps[]>,
  products: ProductListCardProps[],
  setProducts: Setter<ProductListCardProps[]>,
  getCtaText: (type?: CTA_TYPE) => string,
  isLoading: LoadingState,
  setIsLoading: Setter<LoadingState>,
  openModal: ModalState,
  setOpenModal: Setter<ModalState>,
  imageIndex: number,
  setImageIndex: Setter<number>,
  handleOpenImage: (index?: number) => void,
  handleShareLink: PromiseVoidFunction,
  onBack: VoidFunction,
  userInfo: UserState,
  setUserInfo: Setter<UserState>,
  handleBookmark: PromiseVoidFunction,
  reviewSummary: ReviewSummary,
  setReviewSummary: Setter<ReviewSummary>,
  handleClickReview: VoidFunction,
  handleRefecthReview: VoidFunction,
  handleDeleteReview: (review: ListReviewProps) => void,
  onDeleteReview: VoidFunction,
  selectedReview?: ListReviewProps,
  setSelectedReview: Setter<ListReviewProps | undefined>,
  handleViewImage: (images: string[], defaultIndex?: number) => void,
  imageReview: { images: string[], defaultIndex?: number },
  setImageReview: Setter<{ images: string[], defaultIndex?: number }>,
};