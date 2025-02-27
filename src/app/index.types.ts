import { Dayjs } from 'dayjs';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Dispatch, ReactNode, SetStateAction } from 'react';

// Global type
export type VoidFunction = () => void;

export type PromiseVoidFunction = () => Promise<void>

export type PromiseFunction<T> = (params: T) => Promise<void>;

export type Setter<T> = Dispatch<SetStateAction<T>>;

export type MUIDate = Dayjs | null;

export type Pagination = {
  limit: number,
  offset: number,
};

export type SelectOption = {
  value: string,
  label: string,
};

export type BreadcrumbsProps = {
  id: string,
  name: string,
  href: string,
}

export enum USER_TYPE {
  PROVIDER = 'PROVIDER',
  AFFILIATE = 'AFFILIATE',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type Router = AppRouterInstance;

// Query object
export type QueryData<T> = {
  data?: T,
  message?: string,
};

// storage key
export enum STORAGE_KEY {
  USER = 'USER',
}

// user login data
export type UserData = {
  id: string,
  fullName: string,
  businessName: string,
  email: string,
  type: USER_TYPE,
  token: string,
  loginExpires: number,
  bookmarks: string[],
  profilePicture: string,
};

// Geo type
export type Region = {
  id: number,
  name: string,
  translations: Record<string, string>,
  wikiDataId: string,
};

export type Country = {
  id: number,
  name: string,
  iso3: string,
  iso2: string,
  numeric_code: string,
  phonecode: string,
  capital: string,
  currency: string,
  currency_name: string,
  currency_symbol: string,
  tld: string,
  native: string,
  region: string,
  region_id: string,
  subregion: string,
  subregion_id: string,
  nationality: string,
  timezones: {
    zoneName: string,
    gmtOffset: number,
    gmtOffsetName: string,
    abbreviation: string,
    tzName: string,
  }[],
  translations: Record<string, string>,
  latitude: string,
  longitude: string,
  emoji: string,
  emojiU: string,
};

export type State = {
  id: number,
  name: string,
  iso2: string
};

export type City = {
  id: number,
  name: string,
  state_id: number,
  state_code: string,
  state_name: string,
  country_id: number,
  country_code: string,
  country_name: string,
  latitude: string,
  longitude: string,
  wikiDataId: string,
};

// Table type
export type Column<T> = {
  header: string,
  headerClassName?: string,
  accessor?: keyof T,
  render?: (value: T[keyof T] | undefined, row: T) => ReactNode,
  cellClassName?: string
};

export type RowOrder<T> = {
  orderKey: keyof T
  moveUp: (order: number) => void,
  moveDown: (order: number) => void,
};

export type CustomTableProps<T> = {
  columns: Column<T>[],
  data: T[],
  emptyCaption?: string,
  isLoading?: boolean,
  orderRow?: RowOrder<T>,
};

export type RowAction<T> = (row: T) => void;

// Response type
export type CategoryRes = {
  categoryId: string;
  categoryName: string;
  image: string;
  sequence?: number;
};

export type SubCategoryRes = {
  categoryId: string;
  subCategoryId: string,
  subCategoryName: string,
  image: string,
};

export type CategoryWithSubcategoryRes = {
  categoryId: string,
  categoryName: string,
  image: string,
  subCategories: SubCategoryRes[],
};

export type GetCategoryProps = {
  showHidden?: boolean,
};

// dashboard - categories
export type ListCategoryProps = {
  categoryId: string,
  categoryName: string,
  subCategoryCount: number,
};

export type CategoryDetailProps = {
  categoryId?: string,
  categoryName: string,
  image: string,
  subCategories: {
    subCategoryId?: string,
    subCategoryName: string,
    image: string,
  }[],
};

// dashboard - providers
export type ListProviderProps = {
  providerId: string,
  fullName: string,
  businessName: string,
  email: string,
  countryName: string,
  cityName: string,
  isApproved: boolean,
};

export type ProviderDetailProps = {
  providerId: string,
  fullName: string,
  businessName: string,
  email: string,
  phoneNumber?: string,
  countryName: string,
  cityName: string,
  isApproved: boolean,
  categoryName: string
  description: string,
  targetAudience: string,
  location: string,
  yearInOperation: string,
  website: string,
  instagram: string,
  facebook: string,
  tiktok: string,
  youtube: string,
  snapchat: string,
  certification?: string,
  businessRegNumber: string,
};

// users
export type ListUserProps = {
  userId: string,
  fullName: string,
  email: string,
  countryName: string,
  cityName: string,
  type: USER_TYPE,
  businessName: string,
  isApproved: boolean,
  isPasswordCreated: boolean,
  gender?: string,
  dob?: string,
  isBlocked: boolean,
};

export type AddUserProps = {
  userData: UserDetailProps,
};

export type UserDetailProps = {
  userId?: string,
  fullName: string,
  email: string,
  phoneCountry: string,
  phoneCode: string,
  phoneNumber: string,
  countryId: number,
  countryName: string,
  cityId: number,
  cityName: string,
  businessName: string,
  type: USER_TYPE,
  affiliateType?: string,
  userService?: UserServiceProps,
  userBusiness?: UserBusinessProps,
  isApproved?: boolean,
  password?: string,
  dob?: string,
  gender?: string,
  nationality?: string,
  interests?: { subCategoryId: string, subCategoryName: string }[],
};

export type UserServiceProps = {
  userServiceId?: string
  userId?: string,
  description: string,
  targetAudience: string,
  serviceLocation: string,
  categories: UserServiceCategoryProps[],
};

export type UserServiceCategoryProps = {
  userServiceId?: string,
  categoryId: string,
  name: string,
  image?: string,
  sequence?: number,
};

export type UserBusinessProps = {
  userBusinessId?: string,
  operationYear?: string,
  website: string,
  instagram: string,
  facebook: string,
  tiktok: string,
  youtube: string,
  snapchat: string,
  preferredNiche?: string,
  registrationNumber?: string,
  certificationOrLicenses?: string,
};

export enum USER_GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export type UserOnlyDataProps = {
  userId: string,
  profilePicture?: string,
  fullName: string,
  gender?: USER_GENDER,
  dob?: string,
  email: string,
  phoneCountry: string,
  phoneCode: string,
  phoneNumber: string,
  countryId: number,
  countryName: string,
  nationality?: string,
  interests?: { subCategoryId: string, subCategoryName: string }[],
};

export enum USER_AGE_GROUP {
  UNDER_18 = 'UNDER_18',
  BETWEEN_18_24 = 'BETWEEN_18_24',
  BETWEEN_25_34 = 'BETWEEN_25_34',
  BETWEEN_35_44 = 'BETWEEN_35_44',
  BETWEEN_45_54 = 'BETWEEN_45_54',
  OVER_55 = 'OVER_55',
}

// products
export type ProductQuickDetail = {
  detailType: string;
  detailValue: string;
};

export type ProductContent = {
  contentType: CONTENT_TYPE;
  title: string;
  details: string[];
};

export type ProductCallToAction = {
  ctaType: CTA_TYPE;
  ctaUrl: string;
};

export type ProductOperationalHour = {
  day: number;
  isOpen: boolean;
  startHour?: string;
  endHour?: string;
};

export type ProductTag = {
  tagId: string;
  tagName: string;
};

export type ProductRegion = {
  regionId: number;
  regionName: string;
};

export type ProductCountry = {
  countryId: number;
  countryName: string;
};

export type ProductCity = {
  cityId: number;
  cityName: string;
};

export type ProductCategory = {
  categoryId: string;
  categoryName: string;
};

export type ProductSubCategory = {
  subCategoryId: string;
  subCategoryName: string;
};

export type ProductDetailProps = {
  productId?: string;
  parentProductId?: string;
  providerId: string;
  providerName?: string;
  businessName?: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  name: string;
  summary: string;
  region: ProductRegion;
  country: ProductCountry;
  city: ProductCity;
  tags: ProductTag[];
  videoUrl?: string;
  startingPrice?: number;
  currency: string;
  operationalHours: ProductOperationalHour[];
  quickDetails: ProductQuickDetail[];
  contents: ProductContent[];
  callToAction: ProductCallToAction;
  images: string[];
  status: PRODUCT_STATUS;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type ProductListProps = {
  productId: string,
  parentProductId?: string,
  productName: string,
  providerName: string,
  businessName: string,
  categoryName: string,
  subCategoryName: string,
  countryName: string,
  cityName: string,
};

export enum CONTENT_TYPE {
  TEXT = 'TEXT',
  LIST = 'LIST'
}

export enum CTA_TYPE {
  BOOK = 'BOOK',
  CONTACT = 'CONTACT',
  MAP = 'MAP',
  REGISTER = 'REGISTER',
  CONTACT_ME = 'CONTACT_ME',
}

export enum PRODUCT_STATUS {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING'
}

// tags
export type TagProps = {
  tagId?: string,
  tagName: string,
  description?: string,
};

// website - product
export type ProductListCardProps = {
  productId: string,
  productName: string,
  startingPrice?: number,
  currency: string,
  categoryId: string,
  categoryName: string,
  subCategoryid: string,
  subCategoryName: string,
  tags: { tagId: string, tagName: string }[],
  ctaType: string,
  ctaUrl: string,
  imageUrl: string,
  reviewScore: number,
  reviewTotal: number,
};

export type PlaceRegionProps = {
  regionId: number,
  regionName: string,
};

export type PlaceCountryProps = {
  regionId: number,
  regionName: string,
  countryId: number,
  countryName: string,
};

export type PlaceCityProps = {
  regionId: number,
  regionName: string,
  countryId: number,
  countryName: string,
  cityId: number,
  cityName: string,
  image: string,
  isShowOnHome: boolean,
};

export interface PlaceHomeCityProps extends Omit<PlaceCityProps, 'isShowOnHome'> {
  homeCityId: number,
  displayOrder: number,
}

export type PlaceRegionsAndCitiesProps = {
  regionId: number,
  regionName: string,
  cities: {
    cityId: number,
    cityName: string,
    image: string | null,
  }[]
};

// dashboard
export type ListingByCategory = {
  listings: { category: string, count: number }[],
  total: number,
}

export type UserByCountry = {
  summary: { category: string, count: number }[],
  countries: { id: number, country: string, count: number }[]
};

export type UserByCity = {
  cities: { city: string, count: number }[]
};

// review
export type ReviewProps = {
  reviewId?: string,
  productId: string,
  overallScore: number,
  staffScore: number,
  facilitesScore: number,
  valueForMoneyScore: number
  review: string,
  images: string[],
};

export enum SORT_REVIEW {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  HIGHEST = 'HIGHEST',
  LOWEST = 'LOWEST',
}

export type ReviewParams = {
  productId?: string,
  sortBy: SORT_REVIEW,
  limit?: number,
  isThisUser?: boolean,
  rating?: number[],
  query?: string,
};

export type ListReviewProps = {
  reviewId: string,
  productId: string,
  productName: string,
  userId?: string,
  userName: string,
  overallScore: number,
  staffScore: number,
  facilitesScore: number,
  valueForMoneyScore: number
  review: string,
  createdAt: string,
  updatedAt: string,
  images: string[],
};

export type ReviewSummary = {
  reviewScore: number,
  reviewTotal: number,
};