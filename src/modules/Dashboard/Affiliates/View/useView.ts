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
  const affiliateId = params?.id;

  const [affiliateDetail, setAffiliateDetail] = useState<UserDetailProps>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const states = {
    affiliateDetail,
    setAffiliateDetail,
    openModalDelete,
    setOpenModalDelete,
  };

  const handleDelete = () => {
    setOpenModalDelete(true);
  };

  const onDelete = () => {
    _removeAffiliate();
    setOpenModalDelete(false);
  };

  const _removeAffiliate = async () => {
    try {
      if (affiliateId) {
        const { data, message } = await removeUser({ userId: affiliateId }, getToken());
        if (data) {
          toast.success(`"${affiliateDetail?.fullName}" succesfully deleted`);
          router.push('/dashboard/affiliates');
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getAffiliateDetail = useCallback(async () => {
    try {
      if (affiliateId) {
        const { data, message } = await getUserDetail({ userId: affiliateId });
        if (data) {
          setAffiliateDetail(data);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, [affiliateId]);

  useEffect(() => {
    if (affiliateId) _getAffiliateDetail();
  }, [_getAffiliateDetail, affiliateId]);

  return {
    ...states,
    handleDelete,
    onDelete,
  };
};

export default useView;