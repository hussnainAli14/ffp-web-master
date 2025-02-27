export type Props = {
  value: string[];
  onChange: (value: string[]) => void,
  maxFiles?: number,
  types?: FILE_TYPE[],
};

export enum FILE_TYPE {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  DOC = 'DOC',
}