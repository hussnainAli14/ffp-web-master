'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { TagProps } from '@ffp-web/app/index.types';
import { editTag, getTagDetail } from '@ffp-web/lib/tag/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { TagForm, UseEdit } from './Edit.types';


const useEdit = (): UseEdit => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const tagId = params?.id;

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
  const { reset } = methods;

  const onSubmit = (data: TagForm) => {
    const payload: TagProps = {
      tagId: data.id,
      tagName: data.name,
      description: data.description,
    };

    _editTag(payload);
  };

  const _editTag = async (payload: TagProps) => {
    try {
      setIsLoadingSubmit(true);
      const { data, message } = await editTag(payload, getToken());
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

  const _getTagDetail = useCallback(async (tagId: string) => {
    try {
      const { data, message } = await getTagDetail({ tagId }, getToken());
      if (data) {
        reset({
          id: data.tagId,
          name: data.tagName,
          description: data.description,
        });
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, [reset]);

  useEffect(() => {
    if (tagId) _getTagDetail(tagId);
  }, [_getTagDetail, tagId]);

  return {
    ...methods,
    ...states,
    onSubmit,
  };
};

export default useEdit;