'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { CategoryDetailProps } from '@ffp-web/app/index.types';
import { addCategory } from '@ffp-web/lib/category/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { AddForm, UseAdd } from './Add.types';


const useAdd = (): UseAdd => {
  const router = useRouter();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const states = {
    isLoadingSubmit,
    setIsLoadingSubmit,
  };

  const methods = useForm<AddForm>({
    defaultValues: {
      categoryName: '',
      image: [],
      subCategories: [],
    },
  });

  const subCategories = useFieldArray({
    control: methods.control,
    name: 'subCategories',
  });

  const onSubmit = (data: AddForm) => {
    const payload: CategoryDetailProps = {
      categoryName: data.categoryName,
      image: data.image[0],
      subCategories: data.subCategories.map(item => ({
        subCategoryName: item.subCategoryName,
        image: item.image[0],
      })),
    };

    _addCategory(payload);
  };

  const handleAddSubCategory = () => {
    subCategories.append({ subCategoryName: '', image: [] });
  };

  const handleRemoveSubCategory = (index: number) => () => {
    subCategories.remove(index);
  };

  const _addCategory = async (payload: CategoryDetailProps) => {
    try {
      setIsLoadingSubmit(true);
      const { data, message } = await addCategory(payload, getToken());
      if (data) {
        toast.success(data);
        router.push('/dashboard/categories');
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
    subCategories,
    onSubmit,
    handleAddSubCategory,
    handleRemoveSubCategory,
  };
};

export default useAdd;