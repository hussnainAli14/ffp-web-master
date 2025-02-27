export type Props = {
  isOpen: boolean,
  onClose: VoidFunction,
  type: 'delete' | 'approve' | 'unlist' | 'activate' | 'remove-from' | 'block' | 'unblock' | 'verify',
  objectName: string,
  objectFromName?: string,
  actions: {
    label: string,
    onClick: VoidFunction,
    variant: 'primary' | 'secondary' | 'danger',
  }[],
};