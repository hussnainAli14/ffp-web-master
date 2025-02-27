import { ListReviewProps, RowAction, Setter, SORT_REVIEW, VoidFunction } from '@ffp-web/app/index.types';

export type ColumnProps = {
  handleDelete: RowAction<ListReviewProps>,
  handleViewImage: RowAction<ListReviewProps>,
};

export type ModalState = {
  delete: boolean,
  filterSortings: boolean,
  filterRatings: boolean,
  imagesReview: boolean,
};

export type FilterStates = {
  sortings: SORT_REVIEW[],
  selectedSortings: SORT_REVIEW[],
  ratings: number[],
  selectedRatings: number[],
  query: string,
};

export type UseList = {
  listReviews: ListReviewProps[],
  setListReviews: Setter<ListReviewProps[]>,
  isLoadingList: boolean,
  setIsLoadingList: Setter<boolean>,
  selectedReview?: ListReviewProps,
  setSelectedReview: Setter<ListReviewProps | undefined>,
  openModal: ModalState,
  setOpenModal: Setter<ModalState>,
  filter: FilterStates,
  setFilter: Setter<FilterStates>,
  handleDelete: RowAction<ListReviewProps>,
  onDelete: VoidFunction,
  handleCloseFilterSortings: (item?: SORT_REVIEW[]) => void,
  handleCloseFilterRatings: (item?: number[]) => void,
  handleViewImage: RowAction<ListReviewProps>,
  imageReview: { images: string[], defaultIndex?: number },
  setImageReview: Setter<{ images: string[], defaultIndex?: number }>,
};