import { ListReviewProps, ReviewSummary, Setter, SORT_REVIEW } from '@ffp-web/app/index.types';

export type Props = {
  isOpen: boolean,
  onClose: VoidFunction,
  productId?: string,
  handleViewImage?: (images: string[], defaultIndex?: number) => void,
};

export type LoadingState = {
  review: boolean,
};

export type UseListReview = {
  isLoading: LoadingState,
  setIsLoading: Setter<LoadingState>,
  reviews: Record<string, ListReviewProps[]>,
  setReviews: Setter<Record<string, ListReviewProps[]>>,
  reviewSummary: ReviewSummary,
  setReviewSummary: Setter<ReviewSummary>,
  sort: SORT_REVIEW,
  setSort: Setter<SORT_REVIEW>,
};