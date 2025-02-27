'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { PlaceCountryProps, PlaceRegionProps } from '@ffp-web/app/index.types';
import { editCountry, getCountryDetail, getRegions } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { CountryForm, LoadingStates, UseEdit } from './Edit.types';

const useEdit = (): UseEdit => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const countryId = params?.id;

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
  const { reset } = methods;

  const onSubmit = (data: CountryForm) => {
    const payload: PlaceCountryProps = {
      regionId: data.region ? Number(data.region.value) : NaN,
      regionName: data.region ? data.region.label : '',
      countryId: data.countryId,
      countryName: data.countryName,
    };

    _editCountry(payload);
  };

  const _editCountry = async (payload: PlaceCountryProps) => {
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const { data, message } = await editCountry(payload, getToken());
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

  const _getCountryDetail = useCallback(async (countryId: string) => {
    try {
      const { data, message } = await getCountryDetail({ countryId: Number(countryId) }, getToken());
      if (data) {
        reset({
          region: { value: data.regionId?.toString(), label: data.regionName },
          countryId: data.countryId,
          countryName: data.countryName,
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

  useEffect(() => {
    if (countryId) _getCountryDetail(countryId);
  }, [_getCountryDetail, countryId]);

  useEffect(() => {
    _getListRegion();
  }, []);

  return {
    ...methods,
    ...states,
    onSubmit,
  };
};

export default useEdit;