'use client';

import { isEmpty } from 'lodash';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Accept, DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone';
import { FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { getUploadUrl, uploadImage } from '@ffp-web/lib/s3/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { LoadingSpinner } from '../LoadingSpinner';

import { FILE_TYPE, Props } from './ReactDropzone.types';

const getAcceptedType = (types: FILE_TYPE[]): Accept => {
  const imageAccepted: Accept = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpeg', '.jpg', '.gif', '.svg'],
    'image/gif': ['.gif'],
    'image/svg+xml': ['.svg'],
  };
  const pdfAccepted: Accept = {
    'application/pdf': ['.pdf'],
  };
  const docAccepted: Accept = {
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  };

  if (types.length) {
    let accepted: Accept = {};

    types.forEach(type => {
      switch (type) {
        case FILE_TYPE.IMAGE:
          accepted = { ...accepted, ...imageAccepted };
          return;
        case FILE_TYPE.PDF:
          accepted = { ...accepted, ...pdfAccepted };
          return;
        case FILE_TYPE.DOC:
          accepted = { ...accepted, ...docAccepted };
          return;
        default:
          return;
      }
    });

    return accepted;
  }

  return imageAccepted;
};

const ReactDropzone = (props: Props) => {
  const { value, onChange, maxFiles, types } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpload = useCallback(async (files: File[]) => {
    const uploadedUrlsTemp = [];

    if (maxFiles !== undefined && (maxFiles - value.length) < files.length) {
      toast.error(`Maximal file is ${maxFiles}`);
      return;
    }

    setIsLoading(true);

    for (const file of files) {
      try {
        const fileType = file.type;

        const { data: uploadUrl, message: messageUrl } = await getUploadUrl(fileType);

        if (uploadUrl) {
          const { data, message } = await uploadImage(uploadUrl, file, fileType);

          if (data) {
            const fileUrl = uploadUrl.split('?')[0];
            uploadedUrlsTemp.push(fileUrl);

            toast.success(`Uploaded ${file.name} successfully`);
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

    setIsLoading(false);
    if (maxFiles === 1) {
      onChange(uploadedUrlsTemp);
    } else {
      onChange([...value, ...uploadedUrlsTemp].slice(0, maxFiles));
    }

  }, [maxFiles, onChange, value]);

  const handleRemove = (index: number) => {
    onChange(value.filter((_, idx) => idx !== index));
  };

  const onDrop = useCallback((files: File[]) => {
    if (!isEmpty(files)) {
      handleUpload(files);
    }
  }, [handleUpload]);

  const onDropRejected = (reject: FileRejection[]) => {
    reject.forEach(item => {
      item.errors.forEach(error => {
        toast.error(error.message);
      });
    });
  };

  const onError = (error: Error) => {
    toast.error(error.message);
  };

  const dropZoneOptions: DropzoneOptions = {
    onDrop,
    onDropRejected,
    onError,
    maxFiles,
    accept: getAcceptedType(types ?? []),
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropZoneOptions);

  const renderDropZone = () => (
    <div {...getRootProps({
      className: 'p-4 border border-gray-200 rounded-md bg-primary-white gap-2 flex flex-col justify-center items-center hover:cursor-pointer',
    })}>
      <input {...getInputProps({ disabled: isLoading })} />
      <div className='p-2 border border-gray-200 rounded-md'>
        {isLoading ? <LoadingSpinner size='small' /> : <FiUploadCloud />}
      </div>
      {isDragActive ?
        <div className='text-sm text-tertiary-gray font-normal'>
          <span className='text-primary-btn font-semibold'>Drop</span> the files here ...
        </div> :
        <div className='text-sm text-tertiary-gray font-normal'>
          <span className='text-primary-btn font-semibold'>Click to upload</span> or drag and drop
        </div>
      }
      <div className='text-xs text-tertiary-gray font-normal'>
        SVG, PNG, JPG or GIF (max. 800x400px)
      </div>
    </div>
  );

  return (
    <div className='flex flex-col gap-1'>
      {renderDropZone()}

      {value?.map((item, idx) => item && (
        <div
          key={'key-' + idx}
          className='p-4 border border-gray-200 rounded-md bg-primary-white flex gap-4 justify-between items-start'
        >
          <Image
            src={item}
            alt={`Uploaded image ${idx}`}
            height={100}
            width={100}
            className='object-cover border border-gray-200 rounded-md'
            priority
          />
          <button
            type='button'
            className='text-primary-gray'
            onClick={() => handleRemove(idx)}
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReactDropzone;