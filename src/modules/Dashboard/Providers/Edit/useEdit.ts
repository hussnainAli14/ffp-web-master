import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { AddUserProps, CategoryRes, Country, PlaceCityProps, PlaceCountryProps, USER_TYPE } from '@ffp-web/app/index.types';
import { getCategories } from '@ffp-web/lib/category/data';
import { getCountries as getGlobalCountries } from '@ffp-web/lib/geoApi/data';
import { getCities, getCountries } from '@ffp-web/lib/place/data';
import { editUser, getUserDetail } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { EditForm, UseEdit } from './Edit.types';

const useEdit = (): UseEdit => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const providerId = params?.id;

  const [countries, setCountries] = useState<PlaceCountryProps[]>([]);
  const [cities, setCities] = useState<PlaceCityProps[]>([]);
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [globalCountries, setGlobalCountries] = useState<Country[]>([]);

  const states = {
    countries,
    setCountries,
    cities,
    setCities,
    categories,
    setCategories,
    isLoadingSubmit,
    setIsLoadingSubmit,
    globalCountries,
    setGlobalCountries,
  };

  const methods = useForm<EditForm>({
    defaultValues: {
      fullName: '',
      businessName: '',
      email: '',
      phoneCountry: '',
      phoneNumber: '',
      country: '',
      city: '',
      website: '',
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: '',
      snapchat: '',
      category: [],
      description: '',
      targetAudience: '',
      location: '',
      yearInOperation: '',
      certification: [],
      businessRegNumber: '',
    },
  });
  const { watch, reset } = methods;
  const watchStates = watch();

  const onSubmit = (data: EditForm) => {
    const payload: AddUserProps = {
      userData: {
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        phoneCountry: data.phoneCountry,
        phoneCode: globalCountries.find(e => e.iso2 === data.phoneCountry)?.phonecode ?? '',
        phoneNumber: data.phoneNumber,
        countryId: typeof data.country !== 'string' ? Number(data.country?.value) : NaN,
        countryName: typeof data.country !== 'string' ? (data.country?.label ?? '') : '',
        cityId: typeof data.city !== 'string' ? Number(data.city?.value) : NaN,
        cityName: typeof data.city !== 'string' ? (data.city?.label ?? '') : '',
        businessName: data.businessName,
        type: USER_TYPE.PROVIDER,
        userService: {
          description: data.description,
          targetAudience: data.targetAudience,
          serviceLocation: data.location,
          categories: data.category.map(item => ({
            categoryId: item.value,
            name: item.label,
            image: categories.find(e => e.categoryId === item.value)?.image,
            sequence: categories.find(e => e.categoryId === item.value)?.sequence,
          })),
        },
        userBusiness: {
          operationYear: data.yearInOperation,
          website: data.website,
          instagram: data.instagram,
          facebook: data.facebook,
          tiktok: data.tiktok,
          youtube: data.youtube,
          snapchat: data.snapchat,
          registrationNumber: data.businessRegNumber,
          certificationOrLicenses: data.certification[0],
        },
      },
    };

    _editProvider(payload);
  };

  const _editProvider = async (payload: AddUserProps) => {
    try {
      setIsLoadingSubmit(true);
      const { data, message } = await editUser(payload);
      if (data) {
        toast.success('Successfully edit provider');
        router.push('/dashboard/providers');
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const _getCountries = async () => {
    try {
      const { data, message } = await getCountries();
      if (data) {
        setCountries(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getCitiesByCountry = useCallback(async (countryId: string) => {
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
  }, []);

  const _getCategories = async () => {
    try {
      const { data, message } = await getCategories({ showHidden: true });
      if (data) {
        setCategories(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getProviderDetail = useCallback(async () => {
    try {
      if (providerId) {
        const { data, message } = await getUserDetail({ userId: providerId });
        if (data) {
          reset({
            userId: data.userId,
            fullName: data.fullName,
            businessName: data.businessName,
            email: data.email,
            phoneCountry: data.phoneCountry,
            phoneNumber: data.phoneNumber,
            country: { value: data.countryId.toString(), label: data.countryName },
            city: { value: data.cityId.toString(), label: data.cityName },
            website: data.userBusiness?.website,
            instagram: data.userBusiness?.instagram,
            facebook: data.userBusiness?.facebook,
            tiktok: data.userBusiness?.tiktok,
            youtube: data.userBusiness?.youtube,
            snapchat: data.userBusiness?.snapchat,
            category: data.userService?.categories.map(e => ({ value: e.categoryId, label: e.name })),
            description: data.userService?.description,
            targetAudience: data.userService?.targetAudience,
            location: data.userService?.serviceLocation,
            yearInOperation: data.userBusiness?.operationYear?.toString(),
            certification: data.userBusiness?.certificationOrLicenses ? [data.userBusiness?.certificationOrLicenses] : [],
            businessRegNumber: data.userBusiness?.registrationNumber,
          });
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, [providerId, reset]);

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
    _getCountries();
    _getCategories();
    _getGlobalCountries();
  }, []);

  useEffect(() => {
    if (watchStates.country && watchStates.country?.value) _getCitiesByCountry(watchStates.country.value);
  }, [_getCitiesByCountry, watchStates.country]);

  useEffect(() => {
    if (providerId) _getProviderDetail();
  }, [_getProviderDetail, providerId]);

  return {
    ...states,
    ...methods,
    onSubmit,
  };
};

export default useEdit;