'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { STORAGE_KEY, USER_TYPE } from '@ffp-web/app/index.types';
import { login } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { setStorage } from '@ffp-web/utils/storage.utils';

import { LoginForm, TogglePassword, UseLogin } from './Login.types';

const useLogin = (): UseLogin => {
  const pathname = usePathname();
  const isUser = pathname?.startsWith('/user');
  const router = useRouter();
  const methods = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [togglePassword, setTogglePassword] = useState<TogglePassword>({ password: false });
  const states = {
    isLoading,
    setIsLoading,
    togglePassword,
    setTogglePassword,
  };

  const onSubmit = (data: LoginForm) => {
    handleLogin(data);
  };

  const handleLogin = async (formData: LoginForm) => {
    try {
      setIsLoading(true);
      const { data, message } = await login({ ...formData, isUser });
      if (data) {
        setStorage(STORAGE_KEY.USER, data);
        toast.success('Successfully login');
        if (data.type === USER_TYPE.USER) {
          router.push('/home');
        } else if (data.type === USER_TYPE.PROVIDER) {
          router.push('/dashboard/listings/pending');
        } else {
          router.push('/dashboard/home');
        }
      } else if (message === 'BLOCKED') {
        router.push('/suspended');
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...methods,
    ...states,
    isUser,
    onSubmit,
  };
};

export default useLogin;