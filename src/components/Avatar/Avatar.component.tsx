
'use client';

import { isEmpty } from 'lodash';
import Image from 'next/image';

import { avatar } from '@public/images';

import { Props } from './Avatar.types';
import useAvatar from './useAvatar';

const Avatar = (props: Props) => {
  const { isEdit, profilePicture } = props;
  const {
    inputRef,
    handleInputChange,
    handleDelete,
  } = useAvatar(props);

  return (
    <div className='p-6 flex justify-between items-center gap-6'>
      <Image
        src={profilePicture || avatar}
        height={64}
        width={64}
        alt='Avatar'
        className='rounded-full'
      />
      {isEdit &&
        <div className='flex items-center gap-6 text-sm font-semibold'>
          {!isEmpty(profilePicture) &&
            <button type='button' onClick={handleDelete} className='text-gray-500'>
              Delete Photo
            </button>
          }
          <div className='cursor-pointer'>
            <input
              id='avatar'
              type='file'
              accept='image/*'
              max={1}
              className='hidden'
              ref={inputRef}
              onChange={handleInputChange}
            />
            <button type='button' onClick={() => inputRef.current?.click()} className='text-primary-btn'>
              Upload Photo
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default Avatar;