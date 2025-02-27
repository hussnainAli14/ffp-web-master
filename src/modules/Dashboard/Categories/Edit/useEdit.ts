'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { CategoryDetailProps } from '@ffp-web/app/index.types';
import { getCategoryDetail, removeCategory, updateCategory } from '@ffp-web/lib/category/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { EditForm, UseEdit } from './Edit.types';

const useEdit = (): UseEdit => {
  const router = useRouter();

  const [categoryDetail, setCategoryDetail] = useState<CategoryDetailProps>();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const states = {
    categoryDetail, setCategoryDetail,
    isLoadingSubmit, setIsLoadingSubmit,
    openModalDelete, setOpenModalDelete,
    isLoadingDelete, setIsLoadingDelete,
  };

  const params = useParams<{ id: string }>();
  const categoryId = params?.id;
  const methods = useForm<EditForm>({
    defaultValues: {
      categoryId: '',
      categoryName: '',
      image: [],
      subCategories: [],
    },
  });

  const subCategories = useFieldArray({
    control: methods.control,
    name: 'subCategories',
  });

  const handleAddSubCategory = () => {
    subCategories.append({ subCategoryName: '', image: [] });
  };

  const handleRemoveSubCategory = (index: number) => () => {
    subCategories.remove(index);
  };

  const onSubmit = (data: EditForm) => {
    const payload: CategoryDetailProps = {
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      image: data.image[0],
      subCategories: data.subCategories.map(item => ({
        subCategoryId: item.subCategoryId,
        subCategoryName: item.subCategoryName,
        image: item.image[0],
      })),
    };

    _updateCategory(payload);
  };

  const _updateCategory = async (payload: CategoryDetailProps) => {
    try {
      setIsLoadingSubmit(true);
      const { data, message } = await updateCategory(payload, getToken());
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

  const onDelete = () => {
    _removeCategory();
    setOpenModalDelete(false);
  };

  const _removeCategory = async () => {
    try {
      setIsLoadingDelete(true);
      if (categoryDetail?.categoryId) {
        const { data, message } = await removeCategory(
          { categoryId: categoryDetail?.categoryId },
          getToken()
        );
        if (data) {
          toast.success(`"${categoryDetail?.categoryName}" succesfully deleted`);
          router.push('/dashboard/categories');
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const _getCategoryDetail = useCallback(async () => {
    try {
      if (categoryId) {
        const { data, message } = await getCategoryDetail({ categoryId }, getToken());
        if (data) {
          setCategoryDetail(data);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, [categoryId]);

  useEffect(() => {
    _getCategoryDetail();
  }, [_getCategoryDetail]);

  useEffect(() => {
    if (categoryDetail) {
      methods.reset({
        ...categoryDetail,
        image: [categoryDetail.image],
        subCategories: categoryDetail.subCategories.map(item => ({
          ...item,
          image: [item.image],
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryDetail]);

  return {
    ...methods,
    ...states,
    subCategories,
    onSubmit,
    handleAddSubCategory,
    handleRemoveSubCategory,
    onDelete,
  };
};

export default useEdit;