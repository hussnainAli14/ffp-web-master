import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { UserDetailProps } from '@ffp-web/app/index.types';
import { mailApproveUser } from '@ffp-web/lib/mailer/data';
import { getUserDetail, removeUser } from '@ffp-web/lib/user/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

import { UseView } from './View.types';

const useView = (): UseView => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const providerId = params?.id;

  const [providerDetail, setProviderDetail] = useState<UserDetailProps>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [openModalApprove, setOpenModalApprove] = useState<boolean>(false);

  const states = {
    providerDetail,
    setProviderDetail,
    openModalDelete,
    setOpenModalDelete,
    openModalApprove,
    setOpenModalApprove,
  };

  const handleDelete = () => {
    setOpenModalDelete(true);
  };

  const handleApprove = () => {
    setOpenModalApprove(true);
  };

  const onDelete = () => {
    _removeProvider();
    setOpenModalDelete(false);
  };

  const onApprove = () => {
    if (providerDetail?.email) _approveProvider(providerDetail.email);
    setOpenModalApprove(false);
  };

  const _removeProvider = async () => {
    try {
      if (providerDetail?.userId) {
        const { data, message } = await removeUser({ userId: providerDetail?.userId }, getToken());
        if (data) {
          toast.success(`"${providerDetail?.fullName}" succesfully deleted`);
          router.push('/dashboard/providers');
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _approveProvider = async (email: string) => {
    try {
      const { data: mailData, message: mailMessage } = await mailApproveUser(email);
      if (mailData) {
        toast.success(`"${providerDetail?.fullName}" successfully approved as provider`);
        router.push('/dashboard/providers');
      } else {
        toast.error(mailMessage);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getProviderDetail = useCallback(async () => {
    try {
      if (providerId) {
        const { data, message } = await getUserDetail({ userId: providerId });
        if (data) {
          setProviderDetail(data);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, [providerId]);

  useEffect(() => {
    if (providerId) _getProviderDetail();
  }, [_getProviderDetail, providerId]);

  return {
    ...states,
    handleDelete,
    handleApprove,
    onDelete,
    onApprove,
  };
};

export default useView;