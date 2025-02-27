import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { STORAGE_KEY } from '@ffp-web/app/index.types';
import { changePassword } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken, removeStorage } from '@ffp-web/utils/storage.utils';

import { PasswordForm, TogglePassword, UsePassword } from './Password.types';

const usePassword = (): UsePassword => {
  const router = useRouter();

  const methods = useForm<PasswordForm>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const { reset } = methods;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [togglePassword, setTogglePassword] = useState<TogglePassword>({
    password: false, newPassword: false, confirmPassword: false,
  });

  const states = {
    isLoading,
    setIsLoading,
    togglePassword,
    setTogglePassword,
  };

  const onSubmit = (data: PasswordForm) => {
    hendleChangePassword(data);
  };

  const hendleChangePassword = async (data: PasswordForm) => {
    try {
      setIsLoading(true);
      const { data: success, message } = await changePassword(
        { password: data.password, newPassword: data.newPassword },
        getToken()
      );
      if (success) {
        reset();
        removeStorage(STORAGE_KEY.USER);
        toast.success(success);
        router.push('/dashboard/login');
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
    onSubmit,
  };
};

export default usePassword;