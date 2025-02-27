'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { PlaceRegionProps } from '@ffp-web/app/index.types';
import { editRegion, getRegionDetail } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { RegionForm, UseEdit } from './Edit.types';

const useEdit = (): UseEdit => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const regionId = params?.id;

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
  const { reset } = methods;

  const onSubmit = (data: RegionForm) => {
    const payload: PlaceRegionProps = {
      regionId: data.regionId,
      regionName: data.regionName,
    };

    _editRegion(payload);
  };

  const _editRegion = async (payload: PlaceRegionProps) => {
    try {
      setIsLoadingSubmit(true);
      const { data, message } = await editRegion(payload, getToken());
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

  const _getRegionDetail = useCallback(async (regionId: string) => {
    try {
      const { data, message } = await getRegionDetail({ regionId: Number(regionId) }, getToken());
      if (data) {
        reset({
          regionId: data.regionId,
          regionName: data.regionName,
        });
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, [reset]);

  useEffect(() => {
    if (regionId) _getRegionDetail(regionId);
  }, [_getRegionDetail, regionId]);

  return {
    ...methods,
    ...states,
    onSubmit,
  };
};

export default useEdit;