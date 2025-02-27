import { ListReviewProps } from '@ffp-web/app/index.types';

export type Props = {
  review: ListReviewProps,
  handleViewImage?: (images: string[], defaultIndex?: number) => void,
};