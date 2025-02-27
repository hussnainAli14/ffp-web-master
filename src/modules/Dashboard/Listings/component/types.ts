import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import { AddForm } from '../Pending/Add/add.types';

export type ContentSectionProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<AddForm, any>,
  errors: FieldErrors<AddForm>,
  register: UseFormRegister<AddForm>,
  setValue: UseFormSetValue<AddForm>,
  className?: string,
};

export type ContentSectionDetailProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<AddForm, any>,
  errors: FieldErrors<AddForm>,
  register: UseFormRegister<AddForm>,
  setValue: UseFormSetValue<AddForm>,
  index: number,
};

export type OperationalHoursProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<AddForm, any>,
  errors: FieldErrors<AddForm>,
  register: UseFormRegister<AddForm>,
  className?: string,
};

export type QuickDetailProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<AddForm, any>,
  errors: FieldErrors<AddForm>,
  register: UseFormRegister<AddForm>,
  className?: string,
};