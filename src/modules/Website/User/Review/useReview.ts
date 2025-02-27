import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ListReviewProps, SORT_REVIEW } from '@ffp-web/app/index.types';
import { getListReview, removeReview } from '@ffp-web/lib/review/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { Props, UseReview } from '../User.types';

const useReview = ({ setIsLoading, setOpenModal }: Partial<Props>): UseReview => {
  const [reviews, setReviews] = useState<ListReviewProps[]>([]);
  const [selectedReview, setSelectedReview] = useState<ListReviewProps>();

  const states = {
    reviews,
    setReviews,
    selectedReview,
    setSelectedReview,
  };

  const handleDeleteReview = (data: ListReviewProps) => {
    setSelectedReview(data);
    setOpenModal?.(prev => ({ ...prev, deleteReview: true }));
  };

  const onDeleteReview = () => {
    setOpenModal?.(prev => ({ ...prev, deleteReview: false }));
    _deleteReview();
  };

  const handleEditReview = (data: ListReviewProps) => {
    setSelectedReview(data);
    setOpenModal?.(prev => ({ ...prev, editReview: true }));
  };

  const handleRefecthReview = () => {
    _fetchReview();
  };

  const _fetchReview = useCallback(async () => {
    try {
      setIsLoading?.(prev => ({ ...prev, review: true }));
      const { data, message } = await getListReview({ sortBy: SORT_REVIEW.NEWEST, isThisUser: true }, getToken());
      if (data) {
        setReviews(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading?.(prev => ({ ...prev, review: false }));
    }
  }, [setIsLoading]);

  const _deleteReview = async () => {
    try {
      setIsLoading?.(prev => ({ ...prev, review: true }));
      const { data, message } = await removeReview({ reviewId: selectedReview?.reviewId }, getToken());
      if (data) {
        toast.success(data);
        setSelectedReview(undefined);
        _fetchReview();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };


  useEffect(() => {
    _fetchReview();
  }, [_fetchReview]);

  return {
    ...states,
    handleDeleteReview,
    onDeleteReview,
    handleEditReview,
    handleRefecthReview,
  };
};

export default useReview;