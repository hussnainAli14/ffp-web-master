import { UseFormReturn } from 'react-hook-form';

import { ListReviewProps, Setter } from '@ffp-web/app/index.types';

export type Props = {
  isEdit?: boolean,
  isOpen: boolean,
  onClose: VoidFunction,
  initialReview?: ListReviewProps,
  productId?: string,
  refetch?: VoidFunction,
};

export type ReviewForm = {
  overallScore: number;
  staffScore: number;
  facilitesScore: number;
  valueForMoneyScore: number;
  review: string;
  images: string[];
};

export type LoadingState = {
  submit: boolean,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseReviewModal extends UseFormReturn<ReviewForm, any, undefined> {
  onSubmit: (data: ReviewForm) => void,
  isLoading: LoadingState,
  setIsLoading: Setter<LoadingState>,
}