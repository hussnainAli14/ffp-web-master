import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { STORAGE_KEY } from '@ffp-web/app/index.types';
import { changePassword } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken, removeStorage } from '@ffp-web/utils/storage.utils';

import { PasswordForm, Props, TogglePassword, UsePassword } from '../User.types';


const usePassword = ({ setIsLoading, router }: Partial<Props>): UsePassword => {
  const passwordFormHooks = useForm<PasswordForm>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const { reset } = passwordFormHooks;

  const [togglePassword, setTogglePassword] = useState<TogglePassword>({
    password: false, newPassword: false, confirmPassword: false,
  });

  const states = {
    togglePassword,
    setTogglePassword,
  };

  const onSubmitPassword = (data: PasswordForm) => {
    hendleChangePassword(data);
  };

  const hendleChangePassword = async (data: PasswordForm) => {
    try {
      setIsLoading?.(prev => ({ ...prev, updatePassword: true }));
      const { data: success, message } = await changePassword(
        { password: data.password, newPassword: data.newPassword },
        getToken()
      );
      if (success) {
        reset();
        removeStorage(STORAGE_KEY.USER);
        toast.success(success);
        router?.push('/user/login');
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading?.(prev => ({ ...prev, updatePassword: false }));
    }
  };

  return {
    ...states,
    passwordFormHooks,
    onSubmitPassword,
  };
};

export default usePassword;