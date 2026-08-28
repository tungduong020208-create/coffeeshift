import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 36, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Blue circle background */}
      <circle cx="60" cy="60" r="60" fill="#2B6CB0" />
      
      {/* White inner circle border */}
      <circle cx="60" cy="60" r="52" fill="white" />
      
      {/* Blue filled circle inside */}
      <circle cx="60" cy="60" r="46" fill="#2B6CB0" />
      
      {/* Left half - solid blue semicircle (kept as base) */}
      <clipPath id="leftHalf">
        <rect x="14" y="14" width="46" height="92" />
      </clipPath>
      <circle cx="60" cy="60" r="46" fill="#2B6CB0" clipPath="url(#leftHalf)" />
      
      {/* Right side elements - white cutouts */}
      {/* Vertical white line from top center */}
      <rect x="57" y="14" width="6" height="92" fill="white" />
      
      {/* Horizontal white line creating top-right quadrant */}
      <rect x="57" y="52" width="48" height="6" fill="white" />
      
      {/* Bottom-right: white U-shape cutout */}
      <rect x="63" y="60" width="40" height="6" fill="white" />
      <rect x="80" y="60" width="6" height="30" fill="white" />
      <rect x="63" y="84" width="23" height="6" fill="white" />
    </svg>
  );
};
