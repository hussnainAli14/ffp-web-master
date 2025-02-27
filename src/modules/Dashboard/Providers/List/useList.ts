'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ListUserProps, USER_TYPE } from '@ffp-web/app/index.types';
import { mailApproveUser } from '@ffp-web/lib/mailer/data';
import { getCities, getCountries } from '@ffp-web/lib/place/data';
import { getListUserByType, removeUser } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { FilterStates, LoadingStates, ModalStates, UseList } from './List.types';

const useList = (): UseList => {
  const [listProvider, setListProvider] = useState<ListUserProps[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ListUserProps>();
  const [loading, setLoading] = useState<LoadingStates>({ loadingList: true });
  const [openModal, setOpenModal] = useState<ModalStates>({
    delete: false,
    approve: false,
    filterCountry: false,
    filterCity: false,
  });
  const [filter, setFilter] = useState<FilterStates>({
    countries: [],
    cities: [],
    selectedCountry: [],
    selectedCity: [],
  });

  const states = {
    listProvider,
    setListProvider,
    selectedProvider,
    setSelectedProvider,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    filter,
    setFilter,
  };

  const handleCloseFilterCountry = (item?: number[]) => {
    if (item) {
      setFilter(prev => ({ ...prev, selectedCountry: item, selectedCity: [] }));
    }

    setOpenModal(prev => ({ ...prev, filterCountry: false }));
  };

  const handleCloseFilterCity = (item?: number[]) => {
    if (item) {
      setFilter(prev => ({ ...prev, selectedCity: item }));
    }

    setOpenModal(prev => ({ ...prev, filterCity: false }));
  };

  const handleDelete = (row: ListUserProps) => {
    setSelectedProvider(row);
    setOpenModal(prev => ({ ...prev, delete: true }));
  };

  const handleApprove = (row: ListUserProps) => {
    setSelectedProvider(row);
    setOpenModal(prev => ({ ...prev, approve: true }));
  };

  const onDelete = () => {
    _removeProvider();
    setOpenModal(prev => ({ ...prev, delete: false }));
  };

  const onApprove = () => {
    if (selectedProvider?.email) _approveProvider(selectedProvider?.email);
    setOpenModal(prev => ({ ...prev, approve: false }));
  };

  const _removeProvider = async () => {
    try {
      setLoading(prev => ({ ...prev, loadingList: true }));
      if (selectedProvider?.userId) {
        const { data, message } = await removeUser({ userId: selectedProvider?.userId }, getToken());
        if (data) {
          toast.success(`"${selectedProvider?.fullName}" succesfully deleted`);
          setSelectedProvider(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListProvider();
    }
  };

  const _approveProvider = async (email: string) => {
    try {
      setLoading(prev => ({ ...prev, loadingList: true }));
      const { data: mailData, message: mailMessage } = await mailApproveUser(email);
      if (mailData) {
        toast.success(`"${selectedProvider?.fullName}" successfully approved as provider`);
        setSelectedProvider(undefined);
      } else {
        toast.error(mailMessage);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListProvider();
    }
  };

  const _getListProvider = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, loadingList: true }));
      const { data, message } = await getListUserByType({
        types: [USER_TYPE.PROVIDER],
        countries: filter.selectedCountry,
        cities: filter.selectedCity,
      });
      if (data) {
        setListProvider(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, loadingList: false }));
    }
  }, [filter.selectedCity, filter.selectedCountry]);

  const _getCountries = async () => {
    try {
      const { data, message } = await getCountries();
      if (data) {
        setFilter(prev => ({ ...prev, countries: data }));
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getCitiesByCountry = useCallback(async (countryId: number) => {
    try {
      const { data, message } = await getCities({ countryId });
      if (data) {
        setFilter(prev => ({ ...prev, cities: data }));
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, []);

  useEffect(() => {
    _getCountries();
  }, []);

  useEffect(() => {
    if (filter.selectedCountry[0]) _getCitiesByCountry(filter.selectedCountry[0]);
  }, [_getCitiesByCountry, filter.selectedCountry]);

  useEffect(() => {
    _getListProvider();
  }, [_getListProvider]);

  return {
    ...states,
    handleDelete,
    handleApprove,
    onDelete,
    onApprove,
    handleCloseFilterCountry,
    handleCloseFilterCity,
  };
};

export default useList;