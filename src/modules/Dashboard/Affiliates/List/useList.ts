'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ListUserProps, USER_TYPE } from '@ffp-web/app/index.types';
import { getListUserByType, removeUser } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { UseList } from './List.types';

const useList = (): UseList => {
  const [listAffiliate, setListAffiliate] = useState<ListUserProps[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [selectedAffiliate, setSelectedAffiliate] = useState<ListUserProps>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const states = {
    listAffiliate,
    setListAffiliate,
    isLoadingList,
    setIsLoadingList,
    selectedAffiliate,
    setSelectedAffiliate,
    openModalDelete,
    setOpenModalDelete,
  };

  const handleDelete = (row: ListUserProps) => {
    setSelectedAffiliate(row);
    setOpenModalDelete(true);
  };

  const onDelete = () => {
    _removeAffiliate();
    setOpenModalDelete(false);
  };

  const _removeAffiliate = async () => {
    try {
      setIsLoadingList(true);
      if (selectedAffiliate?.userId) {
        const { data, message } = await removeUser({ userId: selectedAffiliate?.userId }, getToken());
        if (data) {
          toast.success(`"${selectedAffiliate?.fullName}" succesfully deleted`);
          setSelectedAffiliate(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListAffiliate();
    }
  };

  const _getListAffiliate = async () => {
    try {
      setIsLoadingList(true);
      const { data, message } = await getListUserByType({ types: [USER_TYPE.AFFILIATE] });
      if (data) {
        setListAffiliate(data);
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
    _getListAffiliate();
  }, []);

  return {
    ...states,
    handleDelete,
    onDelete,
  };
};

export default useList;