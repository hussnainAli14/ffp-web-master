'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ListReviewProps, SORT_REVIEW } from '@ffp-web/app/index.types';
import { getListReview, removeReview } from '@ffp-web/lib/review/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { FilterStates, ModalState, UseList } from './List.types';

const defaultModal: ModalState = {
  delete: false,
  filterSortings: false,
  filterRatings: false,
  imagesReview: false,
};

const defaultFilter: FilterStates = {
  sortings: [SORT_REVIEW.NEWEST, SORT_REVIEW.OLDEST, SORT_REVIEW.HIGHEST, SORT_REVIEW.LOWEST],
  selectedSortings: [SORT_REVIEW.NEWEST],
  ratings: [5, 4, 3, 2, 1],
  selectedRatings: [],
  query: '',
};

const useList = (): UseList => {
  const [listReviews, setListReviews] = useState<ListReviewProps[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [selectedReview, setSelectedReview] = useState<ListReviewProps>();
  const [openModal, setOpenModal] = useState<ModalState>(defaultModal);
  const [filter, setFilter] = useState<FilterStates>(defaultFilter);
  const [imageReview, setImageReview] = useState<{ images: string[], defaultIndex?: number }>({ images: [], defaultIndex: 0 });

  const states = {
    listReviews,
    setListReviews,
    isLoadingList,
    setIsLoadingList,
    selectedReview,
    setSelectedReview,
    openModal,
    setOpenModal,
    filter,
    setFilter,
    imageReview,
    setImageReview,
  };

  const handleDelete = (row: ListReviewProps) => {
    setSelectedReview(row);
    setOpenModal(prev => ({ ...prev, delete: true }));
  };

  const onDelete = () => {
    _removeReview();
    setOpenModal(prev => ({ ...prev, delete: false }));
  };

  const handleCloseFilterSortings = (item?: SORT_REVIEW[]) => {
    if (item) {
      setFilter(prev => ({ ...prev, selectedSortings: item }));
    }

    setOpenModal(prev => ({ ...prev, filterSortings: false }));
  };

  const handleCloseFilterRatings = (item?: number[]) => {
    if (item) {
      setFilter(prev => ({ ...prev, selectedRatings: item }));
    }

    setOpenModal(prev => ({ ...prev, filterRatings: false }));
  };

  const handleViewImage = (row: ListReviewProps) => {
    setImageReview({ images: row.images, defaultIndex: 0 });
    setOpenModal(prev => ({ ...prev, imagesReview: true }));
  };

  const _removeReview = async () => {
    try {
      setIsLoadingList(true);
      if (selectedReview?.userId) {
        const { data, message } = await removeReview({ reviewId: selectedReview?.reviewId }, getToken());
        if (data) {
          toast.success('Successfully deleted review from listing');
          setSelectedReview(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListReviews();
    }
  };

  const _getListReviews = useCallback(async () => {
    try {
      setIsLoadingList(true);
      const { data, message } = await getListReview({
        sortBy: filter.selectedSortings[0],
        rating: filter.selectedRatings,
        query: filter.query,
      });
      if (data) {
        setListReviews(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoadingList(false);
    }
  }, [filter.query, filter.selectedRatings, filter.selectedSortings]);

  useEffect(() => {
    _getListReviews();
  }, [_getListReviews]);

  return {
    ...states,
    handleDelete,
    onDelete,
    handleCloseFilterSortings,
    handleCloseFilterRatings,
    handleViewImage,
  };
};

export default useList;