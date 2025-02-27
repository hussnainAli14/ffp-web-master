'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { PlaceCityProps, PlaceCountryProps, PlaceRegionProps } from '@ffp-web/app/index.types';
import { addCity, getCountries, getRegions } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { CityForm, LoadingStates, UseAdd } from './Add.types';


const useAdd = (): UseAdd => {
  const router = useRouter();
  const [loading, setLoading] = useState<LoadingStates>({ submit: false, region: false, country: false });
  const [listRegion, setListRegion] = useState<PlaceRegionProps[]>([]);
  const [listCountry, setListCountry] = useState<PlaceCountryProps[]>([]);
  const states = {
    loading,
    setLoading,
    listRegion,
    setListRegion,
    listCountry,
    setListCountry,
  };

  const methods = useForm<CityForm>({
    defaultValues: {
      region: '',
      country: '',
      cityName: '',
      image: [],
      isShowOnHome: false,
    },
  });
  const { watch } = methods;
  const watchedStates = watch();

  const onSubmit = (data: CityForm) => {
    const payload: Omit<PlaceCityProps, 'cityId'> = {
      regionId: data.region ? Number(data.region.value) : NaN,
      regionName: data.region ? data.region.label : '',
      countryId: data.country ? Number(data.country.value) : NaN,
      countryName: data.country ? data.country.label : '',
      cityName: data.cityName,
      image: data.image[0],
      isShowOnHome: false,
    };

    _addCity(payload);
  };

  const _addCity = async (payload: Omit<PlaceCityProps, 'cityId'>) => {
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const { data, message } = await addCity(payload, getToken());
      if (data) {
        toast.success(data);
        router.push('/dashboard/places/cities');
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const _getListRegion = async () => {
    try {
      setLoading(prev => ({ ...prev, region: true }));
      const { data, message } = await getRegions();
      if (data) {
        setListRegion(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, region: false }));
    }
  };

  const _getListCountry = async (regionId: string) => {
    try {
      setLoading(prev => ({ ...prev, country: true }));
      const { data, message } = await getCountries({ regionId: Number(regionId) });
      if (data) {
        setListCountry(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, country: false }));
    }
  };

  useEffect(() => {
    _getListRegion();
  }, []);

  useEffect(() => {
    if (watchedStates.region && watchedStates.region.value) _getListCountry(watchedStates.region.value);
  }, [watchedStates.region]);

  return {
    ...methods,
    ...states,
    onSubmit,
  };
};

export default useAdd;