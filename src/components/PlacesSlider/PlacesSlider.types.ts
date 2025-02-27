import { RefObject } from 'react';

import { PlaceHomeCityProps } from '@ffp-web/app/index.types';

export type Props = {
  places: PlaceHomeCityProps[],
  isLoadingPlaces: boolean,
};

export type UsePlacesSlider = {
  sliderRef: RefObject<HTMLDivElement>,
  scrollLeft: VoidFunction,
  scrollRight: VoidFunction,
};