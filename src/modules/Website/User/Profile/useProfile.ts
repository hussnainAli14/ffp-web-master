import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { STORAGE_KEY, USER_GENDER, UserData, UserOnlyDataProps } from '@ffp-web/app/index.types';
import { editUserOnly, getUserOnlyDetail } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken, setStorage } from '@ffp-web/utils/storage.utils';

import { ProfileForm, Props, UseProfile } from '../User.types';


const useProfile = ({ filterData, setIsLoading, userData, router, setUserData }: Partial<Props>): UseProfile => {
  const profileFormHooks = useForm<ProfileForm>({
    defaultValues: {
      userId: '',
      profilePicture: '',
      fullName: '',
      gender: '',
      dob: '',
      email: '',
      phoneCountry: 'US',
      phoneNumber: '',
      country: '',
      nationality: '',
      interests: [],
    },
  });
  const { reset } = profileFormHooks;

  const onSubmitProfile = (data: ProfileForm) => {
    const payload: UserOnlyDataProps = {
      userId: data.userId,
      profilePicture: data.profilePicture,
      fullName: data.fullName,
      gender: typeof data.gender !== 'string' ? data.gender?.value as USER_GENDER : undefined,
      dob: data.dob,
      email: data.email,
      phoneCountry: data.phoneCountry,
      phoneCode: filterData?.globalCountries.find(e => e.iso2 === data.phoneCountry)?.phonecode ?? '',
      phoneNumber: data.phoneNumber,
      countryId: typeof data.country !== 'string' ? Number(data.country?.value) : NaN,
      countryName: typeof data.country !== 'string' ? (data.country?.label ?? '') : '',
      nationality: typeof data.nationality !== 'string' ? data.nationality?.value : undefined,
      interests: data.interests?.map(item => ({ subCategoryId: item.value, subCategoryName: item.label })),
    };

    _editProfile(payload);
  };

  const _editProfile = async (payload: UserOnlyDataProps) => {
    try {
      setIsLoading?.(prev => ({ ...prev, updateProfile: true }));
      const { data, message } = await editUserOnly(payload, getToken());
      if (data) {
        toast.success('Successfully edit profile');
        const newUserData = {
          ...userData,
          fullName: payload.fullName,
          email: payload.email,
          profilePicture: payload.profilePicture ?? '',
        } as UserData;
        setStorage(STORAGE_KEY.USER, newUserData);
        setUserData?.(newUserData);
        router?.refresh();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading?.(prev => ({ ...prev, updateProfile: false }));
    }
  };

  const _getUserDetail = useCallback(async () => {
    try {
      const { data, message } = await getUserOnlyDetail(getToken());
      if (data) {
        reset({
          userId: data.userId,
          profilePicture: data.profilePicture,
          fullName: data.fullName,
          gender: filterData?.genders.find(e => e.value === data.gender) ?? '',
          dob: data.dob,
          email: data.email,
          phoneCountry: data.phoneCountry ?? 'US',
          phoneNumber: data.phoneNumber,
          country: data.countryId > 0 ? { value: data.countryId.toString(), label: data.countryName } : '',
          nationality: data.nationality ? { value: data.nationality, label: data.nationality.split('-')[1] } : '',
          interests: data.interests?.map(item => ({ value: item.subCategoryId, label: item.subCategoryName })),
        });
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, [filterData?.genders, reset]);

  useEffect(() => {
    _getUserDetail();
  }, [_getUserDetail]);

  return {
    profileFormHooks,
    onSubmitProfile,
  };
};

export default useProfile;