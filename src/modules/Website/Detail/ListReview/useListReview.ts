import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ListReviewProps, ReviewSummary, SORT_REVIEW } from '@ffp-web/app/index.types';
import { getListReview, getReviewSummary } from '@ffp-web/lib/review/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { LoadingState, Props, UseListReview } from './ListReview.types';

const useListReview = ({ productId }: Props): UseListReview => {
  const [isLoading, setIsLoading] = useState<LoadingState>({ review: true });
  const [reviews, setReviews] = useState<Record<string, ListReviewProps[]>>({ [SORT_REVIEW.NEWEST]: [] });
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary>({ reviewTotal: 0, reviewScore: 0 });
  const [sort, setSort] = useState<SORT_REVIEW>(SORT_REVIEW.NEWEST);

  const states = {
    isLoading,
    setIsLoading,
    reviews,
    setReviews,
    reviewSummary,
    setReviewSummary,
    sort,
    setSort,
  };

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
    productId: string,
    sortBy: SORT_REVIEW
  ) => {
    try {
      setIsLoading(prev => ({ ...prev, review: true }));
      if (reviews[sortBy]?.length > 0) return;
      const { data, message } = await getListReview({ productId, sortBy }, getToken());
      if (data) {
        setReviews(prev => ({ ...prev, [sortBy]: data }));
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(prev => ({ ...prev, review: false }));
    }
  }, [reviews]);

  useEffect(() => {
    if (productId) {
      _fetchReviewSummary(productId);
    }
  }, [_fetchReviewSummary, productId]);

  useEffect(() => {
    if (productId) {
      _fetchReview(productId, sort);
    }
  }, [_fetchReview, productId, sort]);

  return {
    ...states,
  };
};

export default useListReview;