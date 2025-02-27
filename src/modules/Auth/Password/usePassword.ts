import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { STORAGE_KEY } from '@ffp-web/app/index.types';
import { verifyAndResetPassword } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { removeStorage } from '@ffp-web/utils/storage.utils';

import { PasswordForm, TogglePassword, UsePassword } from './Password.types';

const usePassword = (): UsePassword => {
  const pathname = usePathname();
  const isUser = pathname?.startsWith('/user');
  const searchParams = useSearchParams();
  const isNew = searchParams?.get('action') === 'new';
  const token = searchParams?.get('token');
  const methods = useForm<PasswordForm>({
    defaultValues: {
      password: '',
      confirmPassword: '',
      isSent: false,
    },
  });
  const watchStates = methods.watch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [togglePassword, setTogglePassword] = useState<TogglePassword>({ password: false, confirmPassword: false });
  const states = {
    isLoading,
    setIsLoading,
    togglePassword,
    setTogglePassword,
  };

  const onSubmit = (data: PasswordForm) => {
    hendleVerifyNewPassword(data);
  };

  const hendleVerifyNewPassword = async (data: PasswordForm) => {
    try {
      setIsLoading(true);
      if (token) {
        const { data: success, message } = await verifyAndResetPassword(token, data.password);
        if (success) {
          methods.setValue('isSent', true);
          removeStorage(STORAGE_KEY.USER);
          toast.success(success);
        } else {
          toast.error(message);
        }
      } else {
        throw new Error('Link is invalid');
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (watchStates.isSent && isNew) return 'Password created';
    if (watchStates.isSent) return 'Password reset';
    return 'Set new password';
  };

  const getSubtitle = () => {
    if (watchStates.isSent && isNew) return 'Your password has been successfully created. Click below to log in.';
    if (watchStates.isSent) return 'Your password has been successfully reset. Click below to log in.';
    if (isNew) return 'Use combination of characters, number, or symbol to create a strong password.';
    return 'Your new password must be different to previously used passwords.';
  };

  const getButtonText = () => {
    if (isNew) return 'Create password';
    return 'Reset password';
  };

  return {
    ...methods,
    ...states,
    onSubmit,
    getTitle,
    getSubtitle,
    getButtonText,
    isNew,
    isUser,
  };
};

export default usePassword;