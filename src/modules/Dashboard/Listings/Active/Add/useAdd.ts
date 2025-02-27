'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { CategoryRes, CONTENT_TYPE, CTA_TYPE, ListUserProps, PlaceCityProps, PlaceCountryProps, PlaceRegionProps, PRODUCT_STATUS, ProductDetailProps, STORAGE_KEY, SubCategoryRes, TagProps, UserData, USER_TYPE, Country } from '@ffp-web/app/index.types';
import { getCategories, getSubCategories } from '@ffp-web/lib/category/data';
import { getCountries as getGlobalCountries } from '@ffp-web/lib/geoApi/data';
import { getCities, getCountries, getRegions } from '@ffp-web/lib/place/data';
import { addProduct } from '@ffp-web/lib/product/data';
import { getTags } from '@ffp-web/lib/tag/data';
import { getListUserByType } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getStorage, getToken } from '@ffp-web/utils/storage.utils';

import { AddForm, UseAdd } from './add.types';

const useAdd = (): UseAdd => {
  const router = useRouter();
  const methods = useForm<AddForm>({
    defaultValues: {
      provider: '',
      category: '',
      subCategory: '',
      name: '',
      images: [],
      summary: '',
      region: '',
      country: '',
      city: '',
      tags: [],
      video: '',
      hasPrice: false,
      price: '',
      currency: 'US-USD-$',
      hasOperationalHours: false,
      operationalHours: [
        { day: 0, isOpen: false, startHour: '', endHour: '' },
        { day: 1, isOpen: false, startHour: '', endHour: '' },
        { day: 2, isOpen: false, startHour: '', endHour: '' },
        { day: 3, isOpen: false, startHour: '', endHour: '' },
        { day: 4, isOpen: false, startHour: '', endHour: '' },
        { day: 5, isOpen: false, startHour: '', endHour: '' },
        { day: 6, isOpen: false, startHour: '', endHour: '' },
      ],
      quickDetails: [],
      contents: [],
      ctaText: '',
      ctaLink: '',
    },
  });
  const { watch, setValue } = methods;
  const watchedStates = watch();

  const [user, setUser] = useState<UserData>();
  const [listProvider, setListProvider] = useState<ListUserProps[]>([]);
  const [listCategory, setListCategory] = useState<CategoryRes[]>([]);
  const [listSubCategory, setListSubCategory] = useState<SubCategoryRes[]>([]);
  const [regions, setRegions] = useState<PlaceRegionProps[]>([]);
  const [countries, setCountries] = useState<PlaceCountryProps[]>([]);
  const [cities, setCities] = useState<PlaceCityProps[]>([]);
  const [listTag, setListTag] = useState<TagProps[]>([]);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [globalCountries, setGlobalCountries] = useState<Country[]>([]);
  const states = {
    user,
    setUser,
    listProvider,
    setListProvider,
    listCategory,
    setListCategory,
    listSubCategory,
    setListSubCategory,
    regions,
    setRegions,
    countries,
    setCountries,
    cities,
    setCities,
    listTag,
    setListTag,
    isLoadingSubmit,
    setIsLoadingSubmit,
    globalCountries,
    setGlobalCountries,
  };

  const onSubmit = (data: AddForm) => {
    const payload: ProductDetailProps = {
      providerId: typeof data.provider !== 'string' ? (data.provider?.value ?? '') : '',
      category: {
        categoryId: typeof data.category !== 'string' ? (data.category?.value ?? '') : '',
        categoryName: typeof data.category !== 'string' ? (data.category?.label ?? '') : '',
      },
      subCategory: {
        subCategoryId: typeof data.subCategory !== 'string' ? (data.subCategory?.value ?? '') : '',
        subCategoryName: typeof data.subCategory !== 'string' ? (data.subCategory?.label ?? '') : '',
      },
      name: data.name,
      summary: data.summary,
      region: {
        regionId: typeof data.region !== 'string' ? Number(data.region?.value) : NaN,
        regionName: typeof data.region !== 'string' ? (data.region?.label ?? '') : '',
      },
      country: {
        countryId: typeof data.country !== 'string' ? Number(data.country?.value) : NaN,
        countryName: typeof data.country !== 'string' ? (data.country?.label ?? '') : '',
      },
      city: {
        cityId: typeof data.city !== 'string' ? Number(data.city?.value) : NaN,
        cityName: typeof data.city !== 'string' ? (data.city?.label ?? '') : '',
      },
      tags: data.tags.map(e => ({ tagId: e.value, tagName: e.label })),
      videoUrl: data.video,
      startingPrice: Number(data.price),
      currency: data.currency,
      operationalHours: data.operationalHours,
      quickDetails: data.quickDetails.map(e => ({
        detailType: typeof e.detailType !== 'string' ? (e.detailType?.value ?? '') : '',
        detailValue: e.value,
      })),
      contents: data.contents.map(e => ({
        contentType: typeof e.contentType !== 'string' ? e.contentType?.value as CONTENT_TYPE : CONTENT_TYPE.TEXT,
        title: e.title,
        details: e.text ? [e.text] : e.list,
      })),
      callToAction: {
        ctaType: typeof data.ctaText !== 'string' ? (data.ctaText?.value as CTA_TYPE) : CTA_TYPE.BOOK,
        ctaUrl: data.ctaLink,
      },
      images: data.images,
      status: PRODUCT_STATUS.ACTIVE,
    };

    _addActiveProduct(payload);
  };

  const _addActiveProduct = async (payload: ProductDetailProps) => {
    try {
      setIsLoadingSubmit(true);
      const { data, message } = await addProduct(payload, getToken());
      if (data) {
        toast.success(`"${payload.name}" successfully added to active listings`);
        router.push('/dashboard/listings/active');
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const _getListProvider = async () => {
    try {
      const { data, message } = await getListUserByType({ types: [USER_TYPE.PROVIDER, USER_TYPE.ADMIN] });
      if (data) {
        setListProvider(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getListCategory = async () => {
    try {
      const { data, message } = await getCategories();
      if (data) {
        setListCategory(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getListSubCategory = async (categoryId: string) => {
    try {
      const { data, message } = await getSubCategories({ categoryId });
      if (data) {
        setListSubCategory(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getRegions = async () => {
    try {
      const { data, message } = await getRegions();
      if (data) {
        setRegions(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getCountriesByRegion = async (regionId: string) => {
    try {
      const { data, message } = await getCountries({ regionId: Number(regionId) });
      if (data) {
        setCountries(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getCitiesByCountry = async (countryId: string) => {
    try {
      const { data, message } = await getCities({ countryId: Number(countryId) });
      if (data) {
        setCities(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getTags = async () => {
    try {
      const { data, message } = await getTags();
      if (data) {
        setListTag(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getGlobalCountries = async () => {
    try {
      const { data, message } = await getGlobalCountries();
      if (data) {
        setGlobalCountries(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  useEffect(() => {
    _getListProvider();
    _getListCategory();
    _getRegions();
    _getTags();
    _getGlobalCountries();
  }, []);

  useEffect(() => {
    if (watchedStates.category && watchedStates.category?.value) _getListSubCategory(watchedStates.category.value);
  }, [watchedStates.category]);

  useEffect(() => {
    if (watchedStates.region && watchedStates.region?.value) _getCountriesByRegion(watchedStates.region.value);
  }, [watchedStates.region]);

  useEffect(() => {
    if (watchedStates.country && watchedStates.country?.value) _getCitiesByCountry(watchedStates.country.value);
  }, [watchedStates.country]);

  useEffect(() => {
    const userData = getStorage(STORAGE_KEY.USER) as UserData;
    if (userData) setUser(userData);
  }, []);

  useEffect(() => {
    if (user) setValue('provider', { value: user.id, label: user.businessName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    ...methods,
    ...states,
    onSubmit,
  };
};

export default useAdd;