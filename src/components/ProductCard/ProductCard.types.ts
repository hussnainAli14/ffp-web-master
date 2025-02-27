import { ProductListCardProps, PromiseVoidFunction, Setter } from '@ffp-web/app/index.types';

export type Props = {
  product: ProductListCardProps,
};

export type BookmarkState = {
  isLogin: boolean,
  isBookmarked: boolean,
};

export type LoadingState = {
  bookmark: boolean,
};

export type UseProductCard = {
  bookmarkInfo: BookmarkState,
  setBookmarkInfo: Setter<BookmarkState>,
  isLoading: LoadingState,
  setIsLoading: Setter<LoadingState>,
  handleCardClick: (e: React.MouseEvent<HTMLAnchorElement>) => void,
  handleBookmark: PromiseVoidFunction,
};