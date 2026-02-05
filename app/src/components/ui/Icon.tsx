interface IconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'text-[14px]',
  md: 'text-[20px]',
  lg: 'text-[24px]',
};

export function Icon({ name, className = '', size = 'md' }: IconProps) {
  return (
    <span className={`material-symbols-outlined ${sizes[size]} ${className}`}>
      {name}
    </span>
  );
}
