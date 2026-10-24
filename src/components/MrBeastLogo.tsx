import React from 'react';

interface MrBeastLogoProps {
  className?: string;
  size?: number;
}

export const MrBeastLogo: React.FC<MrBeastLogoProps> = ({
  className = '',
  size = 64,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <img
        src="/assets/mrbeast_logo_clean.png"
        alt="MrBeast Verified Logo"
        style={{ width: size, height: 'auto', maxHeight: size * 1.15 }}
        className="object-contain select-none pointer-events-none"
        loading="eager"
      />
    </div>
  );
};
