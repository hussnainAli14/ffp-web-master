'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { AddUserProps, Country, PlaceCountryProps, USER_TYPE } from '@ffp-web/app/index.types';
import { getCountries as getGlobalCountries } from '@ffp-web/lib/geoApi/data';
import { getCountries } from '@ffp-web/lib/place/data';
import { addUserOnly } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { RegisterForm, TogglePassword, UseRegister } from './Register.types';

const useRegister = (): UseRegister => {
  const methods = useForm<RegisterForm>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneCountry: 'US',
      phoneNumber: '',
      country: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [togglePassword, setTogglePassword] = useState<TogglePassword>({ password: false });
  const [countries, setCountries] = useState<PlaceCountryProps[]>([]);
  const [globalCountries, setGlobalCountries] = useState<Country[]>([]);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const states = {
    isLoading,
    setIsLoading,
    togglePassword,
    setTogglePassword,
    countries,
    setCountries,
    globalCountries,
    setGlobalCountries,
    isRegistered,
    setIsRegistered,
  };

  const onSubmit = (data: RegisterForm) => {
    const payload: AddUserProps = {
      userData: {
        fullName: data.fullName,
        email: data.email,
        phoneCountry: data.phoneCountry,
        phoneCode: globalCountries.find(e => e.iso2 === data.phoneCountry)?.phonecode ?? '',
        phoneNumber: data.phoneNumber,
        countryId: typeof data.country !== 'string' ? Number(data.country?.value) : NaN,
        countryName: typeof data.country !== 'string' ? (data.country?.label ?? '') : '',
        cityId: -99,
        cityName: '',
        businessName: '',
        type: USER_TYPE.USER,
        password: data.password,
      },
    };

    _handleRegister(payload);
  };

  const _handleRegister = async (payload: AddUserProps) => {
    try {
      setIsLoading(true);
      const { data, message } = await addUserOnly(payload);
      if (data) {
        toast.success('Successfully register your account');
        setIsRegistered(true);
        methods.reset();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const _getCountries = async () => {
    try {
      const { data, message } = await getCountries();
      if (data) {
        setCountries(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getGlobalCountries = async () => {
    try {
      const { data, message } = await getGlobalCountries();
      if (data) {
        setGlobalCountries(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  useEffect(() => {
    _getCountries();
    _getGlobalCountries();
  }, []);

  return {
    ...methods,
    ...states,
    onSubmit,
  };
};

export default useRegister;