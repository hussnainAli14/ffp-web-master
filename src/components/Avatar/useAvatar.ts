import { ChangeEvent, useRef } from 'react';
import { toast } from 'react-toastify';

import { getUploadUrl, uploadImage } from '@ffp-web/lib/s3/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { Props, UseAvatar } from './Avatar.types';

const useAvatar = ({ onChanges }: Props): UseAvatar => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const fileType = file.type;

        const { data: uploadUrl, message: messageUrl } = await getUploadUrl(fileType);

        if (uploadUrl) {
          const { data, message } = await uploadImage(uploadUrl, file, fileType);

          if (data) {
            toast.success(data);
            const fileUrl = uploadUrl.split('?')[0];
            onChanges?.(fileUrl);
          } else {
            toast.error(message);
          }
        } else {
          toast.error(messageUrl);
        }
      } catch (err) {
        toast.error(unpackError(err));
      }
    }
  };

  const handleDelete = () => {
    onChanges?.('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return {
    inputRef,
    handleInputChange,
    handleDelete,
  };
};

export default useAvatar;