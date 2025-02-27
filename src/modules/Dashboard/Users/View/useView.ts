import { useRouter, useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { UserDetailProps } from '@ffp-web/app/index.types';
import { getUserDetail, removeUser } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { UseView } from './View.types';

const useView = (): UseView => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const [userDetail, setUserDetail] = useState<UserDetailProps>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const states = {
    userDetail,
    setUserDetail,
    openModalDelete,
    setOpenModalDelete,
  };

  const handleDelete = () => {
    setOpenModalDelete(true);
  };

  const onDelete = () => {
    _removeUser();
    setOpenModalDelete(false);
  };

  const _removeUser = async () => {
    try {
      if (userId) {
        const { data, message } = await removeUser({ userId: userId }, getToken());
        if (data) {
          toast.success(`"${userDetail?.fullName}" succesfully deleted`);
          router.push('/dashboard/users');
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getUserDetail = useCallback(async () => {
    try {
      if (userId) {
        const { data, message } = await getUserDetail({ userId: userId });
        if (data) {
          setUserDetail(data);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, [userId]);

  useEffect(() => {
    if (userId) _getUserDetail();
  }, [_getUserDetail, userId]);

  return {
    ...states,
    handleDelete,
    onDelete,
  };
};

export default useView;