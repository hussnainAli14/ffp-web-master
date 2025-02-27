'use client';

import { Props } from './Button.types';

const Button = (props: Props) => {
  const {
    title,
    onClick,
    size = 'medium',
    color = 'primary',
    leftIcon,
    rightIcon,
    width = 0,
  } = props;

  let padding = 'py-2 px-4';
  let colors = 'bg-primary-btn text-primary-white';

  if (size === 'large') padding = 'py-3 px-5';
  if (color === 'secondary') colors = 'bg-primary-white text-primary-black';
  if (color === 'tertiary') colors = 'bg-secondary-btn text-primary-black';

  return (
    <button
      className={`${padding} ${colors} ${width ? width : 'w-auto'} rounded-full text-base text-nowrap font-semibold flex justify-center items-center gap-2 hover:bg-opacity-90`}
      onClick={() => { onClick?.(); }}
    >
      {leftIcon}
      {title}
      {rightIcon}
    </button>
  );
};

export default Button;