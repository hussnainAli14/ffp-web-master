import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { AddUserProps, CategoryRes, Country, PlaceCityProps, PlaceCountryProps, USER_TYPE } from '@ffp-web/app/index.types';
import { getCategories } from '@ffp-web/lib/category/data';
import { getCountries as getGlobalCountries } from '@ffp-web/lib/geoApi/data';
import { getCities, getCountries } from '@ffp-web/lib/place/data';
import { addUser } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { AddForm, UseAdd } from './Add.types';

const useAdd = (): UseAdd => {
  const router = useRouter();
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

  const methods = useForm<AddForm>({
    defaultValues: {
      fullName: '',
      businessName: '',
      email: '',
      phoneCountry: 'US',
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
  const watchStates = methods.watch();

  const onSubmit = (data: AddForm) => {
    const payload: AddUserProps = {
      userData: {
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

    _addProvider(payload);
  };

  const _addProvider = async (payload: AddUserProps) => {
    try {
      setIsLoadingSubmit(true);
      const { data, message } = await addUser(payload);
      if (data) {
        toast.success('Successfully create provider');
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

  return {
    ...states,
    ...methods,
    onSubmit,
  };
};

export default useAdd;