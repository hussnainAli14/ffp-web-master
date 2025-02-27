export type Props = {
  id: string,
  name?: string,
  checked: boolean,
  onChange: (checked: boolean) => void
};