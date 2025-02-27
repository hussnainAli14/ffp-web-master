'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { PlaceCityProps, PlaceHomeCityProps } from '@ffp-web/app/index.types';
import { addHomeCity, getCities, getHomeCities, moveDownHomeCity, moveUpHomeCity, removeCity, removeHomeCity } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { LoadingStates, ModalStates, UseList } from './List.types';

const useList = (): UseList => {
  const [selectedTab, setSelectedTab] = useState<string>('1');
  const [openModal, setOpenModal] = useState<ModalStates>({ delete: false });
  const [loading, setLoading] = useState<LoadingStates>({ list: true });
  const [listCity, setListCity] = useState<PlaceCityProps[]>([]);
  const [selectedCity, setSelectedCity] = useState<PlaceCityProps>();
  const [listHomeCity, setListHomeCity] = useState<PlaceHomeCityProps[]>([]);
  const states = {
    selectedTab,
    setSelectedTab,
    openModal,
    setOpenModal,
    loading,
    setLoading,
    listCity,
    setListCity,
    selectedCity,
    setSelectedCity,
    listHomeCity,
    setListHomeCity,
  };

  const handleDelete = (row: PlaceCityProps) => {
    setSelectedCity(row);
    setOpenModal(prev => ({ ...prev, delete: true }));
  };

  const handleAddToHome = (row: PlaceCityProps) => {
    _addHomeCity(row);
  };

  const handleRemoveFromHome = (row: PlaceHomeCityProps) => {
    _removeHomeCity(row);
  };

  const handleMoveUp = (currentOrder: number) => {
    _moveUpHomeCity(currentOrder);
  };

  const handleMoveDown = (currentOrder: number) => {
    _moveDownHomeCity(currentOrder);
  };

  const onDelete = () => {
    _removeCity();
    setOpenModal(prev => ({ ...prev, delete: false }));
  };

  const _removeCity = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      if (selectedCity?.cityId) {
        const { data, message } = await removeCity({ cityId: selectedCity?.cityId }, getToken());
        if (data) {
          toast.success(`"${selectedCity?.cityName}" succesfully deleted`);
          setSelectedCity(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListCity();
      _getListHomeCity();
    }
  };

  const _addHomeCity = async (row: PlaceCityProps) => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const { data, message } = await addHomeCity({
        regionId: row.regionId,
        countryId: row.countryId,
        cityId: row.cityId,
      }, getToken());
      if (data) {
        toast.success(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListCity();
      _getListHomeCity();
    }
  };

  const _removeHomeCity = async (row: PlaceHomeCityProps) => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const { data, message } = await removeHomeCity({
        homeCityId: row.homeCityId,
        cityId: row.cityId,
      }, getToken());
      if (data) {
        toast.success(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListCity();
      _getListHomeCity();
    }
  };

  const _moveUpHomeCity = async (currentOrder: number) => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const { data, message } = await moveUpHomeCity({ currentOrder }, getToken());
      if (data) {
        toast.success(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListHomeCity();
    }
  };

  const _moveDownHomeCity = async (currentOrder: number) => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const { data, message } = await moveDownHomeCity({ currentOrder }, getToken());
      if (data) {
        toast.success(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListHomeCity();
    }
  };

  const _getListCity = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const { data, message } = await getCities();
      if (data) {
        setListCity(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  };

  const _getListHomeCity = async () => {
    try {
      setLoading(prev => ({ ...prev, list: true }));
      const { data, message } = await getHomeCities();
      if (data) {
        setListHomeCity(data);
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
    _getListCity();
    _getListHomeCity();
  }, []);

  return {
    ...states,
    handleDelete,
    handleAddToHome,
    handleRemoveFromHome,
    handleMoveUp,
    handleMoveDown,
    onDelete,
  };
};

export default useList;