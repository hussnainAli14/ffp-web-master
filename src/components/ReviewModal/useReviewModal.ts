import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { ReviewProps } from '@ffp-web/app/index.types';
import { addReview, editReview } from '@ffp-web/lib/review/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { LoadingState, Props, ReviewForm, UseReviewModal } from './ReviewModal.types';

const useReviewModal = (props: Props): UseReviewModal => {
  const { isEdit, initialReview, productId, onClose, refetch } = props;
  const methods = useForm<ReviewForm>({
    defaultValues: {
      overallScore: 0,
      staffScore: 0,
      facilitesScore: 0,
      valueForMoneyScore: 0,
      review: '',
      images: [],
    },
  });
  const { reset } = methods;

  const [isLoading, setIsLoading] = useState<LoadingState>({ submit: false });

  const states = {
    isLoading,
    setIsLoading,
  };

  const onSubmit = (data: ReviewForm) => {
    const payload: ReviewProps = {
      reviewId: initialReview?.reviewId,
      productId: initialReview?.productId || productId || '',
      overallScore: data.overallScore,
      staffScore: data.staffScore,
      facilitesScore: data.facilitesScore,
      valueForMoneyScore: data.valueForMoneyScore,
      review: data.review,
      images: data.images,
    };

    if (isEdit) {
      _editReview(payload);
      return;
    }

    _addReview(payload);
  };

  const _editReview = async (payload: ReviewProps) => {
    try {
      setIsLoading(prev => ({ ...prev, submit: true }));
      const { data, message } = await editReview(payload, getToken());
      if (data) {
        toast.success(data);
        refetch?.();
        onClose();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const _addReview = async (payload: ReviewProps) => {
    try {
      setIsLoading(prev => ({ ...prev, submit: true }));
      const { data, message } = await addReview(payload, getToken());
      if (data) {
        toast.success(data);
        refetch?.();
        onClose();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  useEffect(() => {
    if (isEdit && initialReview) {
      reset({
        overallScore: initialReview.overallScore,
        staffScore: initialReview.staffScore,
        facilitesScore: initialReview.facilitesScore,
        valueForMoneyScore: initialReview.valueForMoneyScore,
        review: initialReview.review,
        images: initialReview.images,
      });
    }
  }, [initialReview, isEdit, reset]);

  return {
    ...methods,
    ...states,
    onSubmit,
  };
};

export default useReviewModal;