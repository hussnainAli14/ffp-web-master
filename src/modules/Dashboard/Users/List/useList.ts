'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ListUserProps, USER_AGE_GROUP, USER_GENDER, USER_TYPE } from '@ffp-web/app/index.types';
import { getCountries } from '@ffp-web/lib/place/data';
import { blockUser, getListUserByType, manualVerifyRegistration, removeUser } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';
import { capitalizeFirstLetter } from '@ffp-web/utils/text.utils';

import { FilterStates, ModalState, UseList } from './List.types';

const defaultModal: ModalState = {
  delete: false,
  block: false,
  verify: false,
  filterCountry: false,
  filterGender: false,
  filterAgeGroup: false,
};

const defaultFilter: FilterStates = {
  countries: [],
  selectedCountry: [],
  gender: [
    { value: USER_GENDER.MALE, label: capitalizeFirstLetter(USER_GENDER.MALE) },
    { value: USER_GENDER.FEMALE, label: capitalizeFirstLetter(USER_GENDER.FEMALE) },
  ],
  selectedGender: [],
  ageGroup: [
    { value: USER_AGE_GROUP.UNDER_18, label: 'Below 18' },
    { value: USER_AGE_GROUP.BETWEEN_18_24, label: '18-24' },
    { value: USER_AGE_GROUP.BETWEEN_25_34, label: '25-34' },
    { value: USER_AGE_GROUP.BETWEEN_35_44, label: '35-44' },
    { value: USER_AGE_GROUP.BETWEEN_45_54, label: '45-54' },
    { value: USER_AGE_GROUP.OVER_55, label: '55+' },
  ],
  selectedAgeGroup: [],
  query: '',
};

const useList = (): UseList => {
  const [listUsers, setListUsers] = useState<ListUserProps[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<ListUserProps>();
  const [openModal, setOpenModal] = useState<ModalState>(defaultModal);
  const [filter, setFilter] = useState<FilterStates>(defaultFilter);

  const states = {
    listUsers,
    setListUsers,
    isLoadingList,
    setIsLoadingList,
    selectedUser,
    setSelectedUser,
    openModal,
    setOpenModal,
    filter,
    setFilter,
  };

  const handleDelete = (row: ListUserProps) => {
    setSelectedUser(row);
    setOpenModal(prev => ({ ...prev, delete: true }));
  };

  const onDelete = () => {
    _removeUser();
    setOpenModal(prev => ({ ...prev, delete: false }));
  };

  const handleBlock = (row: ListUserProps) => {
    setSelectedUser(row);
    setOpenModal(prev => ({ ...prev, block: true }));
  };

  const onBlock = () => {
    _blockUser();
    setOpenModal(prev => ({ ...prev, block: false }));
  };

  const handleVerify = (row: ListUserProps) => {
    setSelectedUser(row);
    setOpenModal(prev => ({ ...prev, verify: true }));
  };

  const onVerify = () => {
    _verifyUser();
    setOpenModal(prev => ({ ...prev, verify: false }));
  };

  const handleCloseFilterCountry = (item?: number[]) => {
    if (item) {
      setFilter(prev => ({ ...prev, selectedCountry: item }));
    }

    setOpenModal(prev => ({ ...prev, filterCountry: false }));
  };

  const handleCloseFilterGender = (item?: USER_GENDER[]) => {
    if (item) {
      setFilter(prev => ({ ...prev, selectedGender: item }));
    }

    setOpenModal(prev => ({ ...prev, filterGender: false }));
  };

  const handleCloseFilterAgeGroup = (item?: USER_AGE_GROUP[]) => {
    if (item) {
      setFilter(prev => ({ ...prev, selectedAgeGroup: item }));
    }

    setOpenModal(prev => ({ ...prev, filterAgeGroup: false }));
  };

  const _removeUser = async () => {
    try {
      setIsLoadingList(true);
      if (selectedUser?.userId) {
        const { data, message } = await removeUser({ userId: selectedUser?.userId }, getToken());
        if (data) {
          toast.success(`"${selectedUser?.fullName}" succesfully deleted`);
          setSelectedUser(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListUsers();
    }
  };

  const _blockUser = async () => {
    try {
      setIsLoadingList(true);
      if (selectedUser?.userId) {
        const { data, message } = await blockUser({ userId: selectedUser?.userId, currentState: selectedUser.isBlocked }, getToken());
        if (data) {
          toast.success(`"${selectedUser?.fullName}" succesfully ${selectedUser.isBlocked ? 'Unblocked' : 'Blocked'}`);
          setSelectedUser(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListUsers();
    }
  };

  const _verifyUser = async () => {
    try {
      setIsLoadingList(true);
      if (selectedUser?.userId) {
        const { data, message } = await manualVerifyRegistration({ userId: selectedUser?.userId }, getToken());
        if (data) {
          toast.success(`"${selectedUser?.fullName}" succesfully verified`);
          setSelectedUser(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListUsers();
    }
  };

  const _getListUsers = useCallback(async () => {
    try {
      setIsLoadingList(true);
      const { data, message } = await getListUserByType({
        types: [USER_TYPE.USER],
        countries: filter.selectedCountry,
        gender: filter.selectedGender[0],
        ageGroup: filter.selectedAgeGroup[0],
        query: filter.query,
      });
      if (data) {
        setListUsers(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoadingList(false);
    }
  }, [filter.query, filter.selectedAgeGroup, filter.selectedCountry, filter.selectedGender]);

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

  useEffect(() => {
    _getListUsers();
  }, [_getListUsers]);

  useEffect(() => {
    _getCountries();
  }, []);

  return {
    ...states,
    handleDelete,
    onDelete,
    handleBlock,
    onBlock,
    handleVerify,
    onVerify,
    handleCloseFilterCountry,
    handleCloseFilterGender,
    handleCloseFilterAgeGroup,
  };
};

export default useList;