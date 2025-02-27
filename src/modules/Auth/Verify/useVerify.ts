import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { STORAGE_KEY } from '@ffp-web/app/index.types';
import { verifyRegistration } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { removeStorage } from '@ffp-web/utils/storage.utils';

import { UseVerify } from './Verify.types';

const useVerify = (): UseVerify => {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const states = {
    isLoading,
    setIsLoading,
    isVerified,
    setIsVerified,
  };

  const _verifyAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      if (token) {
        const { data, message } = await verifyRegistration(token);
        if (data) {
          removeStorage(STORAGE_KEY.USER);
          toast.success('Successfully verify registration');
          setIsVerified(true);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      _verifyAccount();
    } else {
      setIsLoading(false);
    }
  }, [_verifyAccount, token]);

  return {
    ...states,
  };
};

export default useVerify;