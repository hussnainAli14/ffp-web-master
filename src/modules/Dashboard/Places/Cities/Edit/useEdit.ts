'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { PlaceCityProps, PlaceCountryProps, PlaceRegionProps } from '@ffp-web/app/index.types';
import { editCity, getCityDetail, getCountries, getRegions } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { CityForm, LoadingStates, UseEdit } from './Edit.types';

const useEdit = (): UseEdit => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const cityId = params?.id;

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
  const { reset, watch } = methods;
  const watchedStates = watch();

  const onSubmit = (data: CityForm) => {
    const payload: PlaceCityProps = {
      regionId: data.region ? Number(data.region.value) : NaN,
      regionName: data.region ? data.region.label : '',
      countryId: data.country ? Number(data.country.value) : NaN,
      countryName: data.country ? data.country.label : '',
      cityId: data.cityId,
      cityName: data.cityName,
      image: data.image[0],
      isShowOnHome: data.isShowOnHome,
    };

    _editCity(payload);
  };

  const _editCity = async (payload: PlaceCityProps) => {
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const { data, message } = await editCity(payload, getToken());
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

  const _getCityDetail = useCallback(async (cityId: string) => {
    try {
      const { data, message } = await getCityDetail({ cityId: Number(cityId) }, getToken());
      if (data) {
        reset({
          region: { value: data.regionId?.toString(), label: data.regionName },
          country: { value: data.countryId?.toString(), label: data.countryName },
          cityId: data.cityId,
          cityName: data.cityName,
          image: data.image ? [data.image] : [],
          isShowOnHome: data.isShowOnHome,
        });
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, [reset]);

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
    if (cityId) _getCityDetail(cityId);
  }, [_getCityDetail, cityId]);

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

export default useEdit;