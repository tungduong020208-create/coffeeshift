import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 36, className = '' }) => {
  return (
    <img
      src="/logo.png"
      alt="CoffeeShift Logo"
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: '50%', objectFit: 'contain' }}
    />
  );
};
