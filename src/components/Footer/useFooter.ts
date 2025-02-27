import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CategoryRes, USER_TYPE } from '@ffp-web/app/index.types';
import { getCategories } from '@ffp-web/lib/category/data';
import { addSubscriber } from '@ffp-web/lib/subscribe/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { hasAccess } from '@ffp-web/utils/storage.utils';

import { UseFooter } from './Footer.types';

const useFooter = (): UseFooter => {
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [email, setEmail] = useState<string>('');
  const [loadingSubscribe, setLoadingSubscribe] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  const states = {
    categories,
    setCategories,
    email,
    setEmail,
    loadingSubscribe,
    setLoadingSubscribe,
    isUser,
    setIsUser,
  };

  const onSubscribe = () => {
    if (email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      _addSubscriber();
    }
  };

  // fetch list category
  const _fetchCategories = useCallback(async () => {
    try {
      const { data, message } = await getCategories();
      if (data) {
        setCategories(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, []);

  const _addSubscriber = async () => {
    try {
      setLoadingSubscribe(true);
      const { data, message } = await addSubscriber({ email });
      if (data) {
        setEmail('');
        toast.success(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoadingSubscribe(false);
    }
  };

  // fetch on mount
  useEffect(() => {
    _fetchCategories();
  }, [_fetchCategories]);

  useEffect(() => {
    setIsUser(hasAccess(USER_TYPE.USER));
  }, []);

  return {
    ...states,
    onSubscribe,
  };
};

export default useFooter;