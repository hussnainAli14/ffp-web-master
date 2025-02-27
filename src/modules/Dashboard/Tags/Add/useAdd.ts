'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {  useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {  TagProps } from '@ffp-web/app/index.types';
import { addTag } from '@ffp-web/lib/tag/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { TagForm, UseAdd } from './Add.types';


const useAdd = (): UseAdd => {
  const router = useRouter();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const states = {
    isLoadingSubmit,
    setIsLoadingSubmit,
  };

  const methods = useForm<TagForm>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (data: TagForm) => {
    const payload: TagProps = {
      tagName: data.name,
      description: data.description,
    };

    _addTag(payload);
  };

  const _addTag = async (payload: TagProps) => {
    try {
      setIsLoadingSubmit(true);
      const { data, message } = await addTag(payload, getToken());
      if (data) {
        toast.success(data);
        router.push('/dashboard/tags');
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