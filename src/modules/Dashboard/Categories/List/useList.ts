'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ListCategoryProps } from '@ffp-web/app/index.types';
import { getListCategory, removeCategory } from '@ffp-web/lib/category/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { UseList } from './List.types';

const useList = (): UseList => {
  const [lisCategory, setLisCategory] = useState<ListCategoryProps[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<ListCategoryProps>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const states = {
    lisCategory,
    setLisCategory,
    isLoadingList,
    setIsLoadingList,
    openModalDelete,
    setOpenModalDelete,
  };

  const handleDelete = (row: ListCategoryProps) => {
    setSelectedCategory(row);
    setOpenModalDelete(true);
  };

  const onDelete = () => {
    _removeCategory();
    setOpenModalDelete(false);
  };

  const _removeCategory = async () => {
    try {
      setIsLoadingList(true);
      if (selectedCategory?.categoryId) {
        const { data, message } = await removeCategory(
          { categoryId: selectedCategory?.categoryId },
          getToken()
        );
        if (data) {
          toast.success(`"${selectedCategory?.categoryName}" succesfully deleted`);
          setSelectedCategory(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListCategory();
    }
  };

  const _getListCategory = async () => {
    try {
      setIsLoadingList(true);
      const { data, message } = await getListCategory();
      if (data) {
        setLisCategory(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    _getListCategory();
  }, []);

  return {
    ...states,
    handleDelete,
    onDelete,
  };
};

export default useList;