import classNames from 'classnames';
import { IoClose } from 'react-icons/io5';

import { Props } from './ConfitmationModals.types';

const ConfirmationModal = (props: Props) => {
  const { isOpen, onClose, type, objectName, objectFromName, actions } = props;

  const getTitle = () => {
    switch (type) {
      case 'approve': return `Approve ${objectName}`;
      case 'delete': return `Delete ${objectName}`;
      case 'unlist': return `Unlist ${objectName}`;
      case 'activate': return `Activate ${objectName}`;
      case 'remove-from': return `Remove ${objectName} from ${objectFromName}`;
      case 'block': return `Block ${objectName}`;
      case 'unblock': return `Unblock ${objectName}`;
      case 'verify': return `Verify ${objectName}`;
    }
  };

  const getCaption = () => {
    switch (type) {
      case 'approve': return `Are you sure you want to approve this ${objectName}?`;
      case 'delete': return `Are you sure you want to delete this ${objectName}? This action cannot be undone.`;
      case 'unlist': return `Are you sure you want to unlist this ${objectName}?`;
      case 'activate': return `Are you sure you want to activate this ${objectName}?`;
      case 'remove-from': return `Are you sure you want to remove this ${objectName} from your ${objectFromName}? This action cannot be undone.`;
      case 'block': return `Are you sure you want to block this ${objectName}?`;
      case 'unblock': return `Are you sure you want to unblock this ${objectName}?`;
      case 'verify': return `Are you sure you want to manually verify this ${objectName}?`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
      <div className='relative bg-white rounded-2xl shadow-lg w-[520px] p-6'>
        <div className='text-lg font-semibold text-gray-800'>{getTitle()}</div>
        <div className='mt-1 text-sm text-gray-600'>{getCaption()}</div>

        <div className='mt-8 flex justify-end gap-3'>
          {actions.map((action, index) => (
            <button
              key={'action-' + index}
              onClick={action.onClick}
              className={classNames(
                'px-4 py-2 rounded-full text-base font-semibold',
                {
                  'bg-primary-btn text-white hover:bg-opacity-90': action.variant === 'primary',
                  'bg-primary-white border text-gray-800 hover:bg-gray-50': action.variant === 'secondary',
                  'bg-red-600 text-white hover:bg-opacity-90': action.variant === 'danger',
                }
              )}
            >
              {action.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className='absolute top-6 right-6 text-gray-300 hover:text-gray-500'
          aria-label='Close'
        >
          <IoClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
