'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { PlaceCountryProps } from '@ffp-web/app/index.types';
import { getCountries, removeCountry } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { LoadingStates, ModalStates, UseList } from './List.types';

const useList = (): UseList => {
  const [openModal, setOpenModal] = useState<ModalStates>({ delete: false });
  const [loading, setLoading] = useState<LoadingStates>({ list: true });
  const [listCountry, setListCountry] = useState<PlaceCountryProps[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<PlaceCountryProps>();
  const states = {
    openModal,
    setOpenModal,
    loading,
    setLoading,
    listCountry,
    setListCountry,
    selectedCountry,
    setSelectedCountry,
  };

  const handleDelete = (row: PlaceCountryProps) => {
    setSelectedCountry(row);
    setOpenModal(prev => ({ ...prev, delete: true }));
  };

  const onDelete = () => {
    _removeCountry();
    setOpenModal(prev => ({ ...prev, delete: false }));
  };

  const _removeCountry = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      if (selectedCountry?.countryId) {
        const { data, message } = await removeCountry({ countryId: selectedCountry?.countryId }, getToken());
        if (data) {
          toast.success(`"${selectedCountry?.countryName}" succesfully deleted`);
          setSelectedCountry(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListCountry();
    }
  };

  const _getListCountry = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const { data, message } = await getCountries();
      if (data) {
        setListCountry(data);
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
    _getListCountry();
  }, []);

  return {
    ...states,
    handleDelete,
    onDelete,
  };
};

export default useList;