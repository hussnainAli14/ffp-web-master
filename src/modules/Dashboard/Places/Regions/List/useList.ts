'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { PlaceRegionProps } from '@ffp-web/app/index.types';
import { getRegions, removeRegion } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { LoadingStates, ModalStates, UseList } from './List.types';

const useList = (): UseList => {
  const [openModal, setOpenModal] = useState<ModalStates>({ delete: false });
  const [loading, setLoading] = useState<LoadingStates>({ list: true });
  const [listRegion, setListRegion] = useState<PlaceRegionProps[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<PlaceRegionProps>();
  const states = {
    openModal,
    setOpenModal,
    loading,
    setLoading,
    listRegion,
    setListRegion,
    selectedRegion,
    setSelectedRegion,
  };

  const handleDelete = (row: PlaceRegionProps) => {
    setSelectedRegion(row);
    setOpenModal(prev => ({ ...prev, delete: true }));
  };

  const onDelete = () => {
    _removeRegion();
    setOpenModal(prev => ({ ...prev, delete: false }));
  };

  const _removeRegion = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      if (selectedRegion?.regionId) {
        const { data, message } = await removeRegion({ regionId: selectedRegion?.regionId }, getToken());
        if (data) {
          toast.success(`"${selectedRegion?.regionName}" succesfully deleted`);
          setSelectedRegion(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListRegion();
    }
  };

  const _getListRegion = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const { data, message } = await getRegions();
      if (data) {
        setListRegion(data);
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
    _getListRegion();
  }, []);

  return {
    ...states,
    handleDelete,
    onDelete,
  };
};

export default useList;