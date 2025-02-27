'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { mailResetPassword } from '@ffp-web/lib/mailer/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { ForgotForm, UseForgot } from './Forgot.types';

const useForgot = (): UseForgot => {
  const pathname = usePathname();
  const isUser = pathname?.startsWith('/user');
  const methods = useForm<ForgotForm>({
    defaultValues: {
      email: '',
      isSent: false,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const states = {
    isLoading, setIsLoading,
  };

  const onSubmit = (data: ForgotForm) => {
    sendResetEmail(data);
  };

  const sendResetEmail = async (data: ForgotForm) => {
    try {
      setIsLoading(true);
      const { data: mailData, message: mailMessage } = await mailResetPassword({ ...data, isUser });
      if (mailData) {
        methods.setValue('isSent', true);
        toast.success(mailData);
      } else {
        toast.error(mailMessage);
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

export default useForgot;