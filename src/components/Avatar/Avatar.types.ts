import { ChangeEvent, RefObject } from 'react';

import { VoidFunction } from '@ffp-web/app/index.types';

export type Props = {
  profilePicture?: string,
  isEdit?: boolean,
  onChanges?: (imageUri: string) => void,
};

export type UseAvatar = {
  inputRef: RefObject<HTMLInputElement>,
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>,
  handleDelete: VoidFunction,
};