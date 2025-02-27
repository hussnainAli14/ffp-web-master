import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { UseFormReturn } from 'react-hook-form';
import { MultiValue, SingleValue } from 'react-select';

import { CategoryRes, Country, ListReviewProps, PlaceCityProps, PlaceCountryProps, ProductListCardProps, SelectOption, Setter, SubCategoryRes, UserData } from '@ffp-web/app/index.types';

export type LoadingState = {
  bookmark: boolean,
  removeBookmark: boolean,
  review: boolean,
  getProfile: boolean,
  updateProfile: boolean,
  updatePassword: boolean,
};

export type ModalState = {
  removeBookmark: boolean,
  filterCountry: boolean,
  filterCity: boolean,
  filterCategory: boolean,
  filterSubCategory: boolean,
  deleteReview: boolean,
  editReview: boolean,
  dropdownMenu: boolean,
};

export type FilterData = {
  countries: PlaceCountryProps[],
  cities: PlaceCityProps[],
  categories: CategoryRes[],
  subCategories: SubCategoryRes[],
  globalCountries: Country[],
  genders: SelectOption[],
};

export type FilterBookmark = {
  selectedCountry: number[],
  selectedCity: number[],
  selectedCategory: string[],
  selectedSubCategory: string[],
  query: string,
};

export type UseBookmark = {
  products: ProductListCardProps[],
  setProducts: Setter<ProductListCardProps[]>,
  selectedBookmarkProduct: { productId: string, productName: string },
  setSelectedBookmarkProduct: Setter<{ productId: string, productName: string }>,
  filterBookmark: FilterBookmark,
  setFilterBookmark: Setter<FilterBookmark>,
  handleRemoveBookmark: (productId: string, productName: string) => void,
  onRemoveBookmark: VoidFunction,
  handleCloseFilterCountry: (item?: number[]) => void,
  handleCloseFilterCity: (item?: number[]) => void,
  handleCloseFilterCategory: (item?: string[]) => void,
  handleCloseFilterSubCategory: (item?: string[]) => void,
};

export type UseReview = {
  reviews: ListReviewProps[],
  setReviews: Setter<ListReviewProps[]>,
  selectedReview?: ListReviewProps,
  setSelectedReview: Setter<ListReviewProps | undefined>,
  handleDeleteReview: (data: ListReviewProps) => void,
  onDeleteReview: VoidFunction,
  handleEditReview: (data: ListReviewProps) => void,
  handleRefecthReview: VoidFunction,
};

export type ProfileForm = {
  userId: string,
  profilePicture?: string,
  fullName: string,
  gender?: SingleValue<SelectOption> | '',
  dob?: string,
  email: string,
  phoneCountry: string,
  phoneNumber: string,
  country: SingleValue<SelectOption> | '',
  nationality?: SingleValue<SelectOption> | '',
  interests?: MultiValue<SelectOption>,
};

export type UseProfile = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileFormHooks: UseFormReturn<ProfileForm, any, undefined>
  onSubmitProfile: (data: ProfileForm) => void,
};

export type TogglePassword = {
  password: boolean,
  newPassword: boolean,
  confirmPassword: boolean,
};

export type PasswordForm = {
  password: string,
  newPassword: string,
  confirmPassword: string,
};

export type UsePassword = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passwordFormHooks: UseFormReturn<PasswordForm, any, undefined>,
  onSubmitPassword: (data: PasswordForm) => void,
  togglePassword: TogglePassword,
  setTogglePassword: Setter<TogglePassword>,
};

export interface Props extends UseBookmark, UseReview, UseProfile, UsePassword {
  selectedMenu: string,
  setSelectedMenu: Setter<string>,
  handleSelectMenu: (key: string) => void,
  isLoading: LoadingState,
  setIsLoading: Setter<LoadingState>,
  openModal: ModalState,
  setOpenModal: Setter<ModalState>,
  userData: UserData | null,
  setUserData: Setter<UserData | null>,
  filterData: FilterData,
  setFilterData: Setter<FilterData>,
  isDekstop: boolean,
  setIsDekstop: Setter<boolean>,
  router: AppRouterInstance,
  handleLogout: VoidFunction,
}

