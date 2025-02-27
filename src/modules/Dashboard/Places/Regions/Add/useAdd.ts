'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {  useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {  PlaceRegionProps } from '@ffp-web/app/index.types';
import { addRegion } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { RegionForm, UseAdd } from './Add.types';


const useAdd = (): UseAdd => {
  const router = useRouter();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const states = {
    isLoadingSubmit,
    setIsLoadingSubmit,
  };

  const methods = useForm<RegionForm>({
    defaultValues: {
      regionName: '',
    },
  });

  const onSubmit = (data: RegionForm) => {
    const payload: Pick<PlaceRegionProps, 'regionName'> = {
      regionName: data.regionName,
    };

    _addRegion(payload);
  };

  const _addRegion = async (payload: Pick<PlaceRegionProps, 'regionName'>) => {
    try {
      setIsLoadingSubmit(true);
      const { data, message } = await addRegion(payload, getToken());
      if (data) {
        toast.success(data);
        router.push('/dashboard/places/regions');
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return {
    ...methods,
    ...states,
    onSubmit,
  };
};

export default useAdd;