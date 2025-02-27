import { RefObject } from 'react';

import { CategoryRes, VoidFunction } from '@ffp-web/app/index.types';

export type Props = {
  categories: CategoryRes[],
  isLoadingCategories: boolean,
};

export type UseCategoriesSlider = {
  sliderRef: RefObject<HTMLDivElement>,
  scrollLeft: VoidFunction,
  scrollRight: VoidFunction,
};