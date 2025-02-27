'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { PlaceCountryProps, PlaceRegionProps } from '@ffp-web/app/index.types';
import { addCountry, getRegions } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { CountryForm, LoadingStates, UseAdd } from './Add.types';


const useAdd = (): UseAdd => {
  const router = useRouter();
  const [loading, setLoading] = useState<LoadingStates>({ submit: false, region: false });
  const [listRegion, setListRegion] = useState<PlaceRegionProps[]>([]);
  const states = {
    loading,
    setLoading,
    listRegion,
    setListRegion,
  };

  const methods = useForm<CountryForm>({
    defaultValues: {
      region: '',
      countryName: '',
    },
  });

  const onSubmit = (data: CountryForm) => {
    const payload: Omit<PlaceCountryProps, 'countryId'> = {
      regionId: data.region ? Number(data.region.value) : NaN,
      regionName: data.region ? data.region.label : '',
      countryName: data.countryName,
    };

    _addCountry(payload);
  };

  const _addCountry = async (payload: Omit<PlaceCountryProps, 'countryId'>) => {
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const { data, message } = await addCountry(payload, getToken());
      if (data) {
        toast.success(data);
        router.push('/dashboard/places/countries');
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

  useEffect(() => {
    _getListRegion();
  }, []);

  return {
    ...methods,
    ...states,
    onSubmit,
  };
};

export default useAdd;