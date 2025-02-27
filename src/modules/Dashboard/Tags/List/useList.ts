'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { TagProps } from '@ffp-web/app/index.types';
import { getTags, removeTag } from '@ffp-web/lib/tag/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { LoadingStates, ModalStates, UseList } from './List.types';

const useList = (): UseList => {
  const [openModal, setOpenModal] = useState<ModalStates>({ delete: false });
  const [loading, setLoading] = useState<LoadingStates>({ list: true });
  const [listTag, setListTag] = useState<TagProps[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagProps>();
  const states = {
    openModal,
    setOpenModal,
    loading,
    setLoading,
    listTag,
    setListTag,
    selectedTag,
    setSelectedTag,
  };

  const handleDelete = (row: TagProps) => {
    setSelectedTag(row);
    setOpenModal(prev => ({ ...prev, delete: true }));
  };

  const onDelete = () => {
    _removeTag();
    setOpenModal(prev => ({ ...prev, delete: false }));
  };

  const _removeTag = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      if (selectedTag?.tagId) {
        const { data, message } = await removeTag({ tagId: selectedTag?.tagId }, getToken());
        if (data) {
          toast.success(`"${selectedTag?.tagName}" succesfully deleted`);
          setSelectedTag(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListTag();
    }
  };

  const _getListTag = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const { data, message } = await getTags();
      if (data) {
        setListTag(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  };

  useEffect(() => {
    _getListTag();
  }, []);

  return {
    ...states,
    handleDelete,
    onDelete,
  };
};

export default useList;