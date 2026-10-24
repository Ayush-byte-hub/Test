import React, { useState, useEffect } from 'react';
import { MrBeastLogo } from './MrBeastLogo';

interface HeaderProps {
  brandTitle?: string;
  subTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  brandTitle = 'MR BEAST',
  subTitle = 'GIFT CARD GIVEAWAY',
}) => {
  const [onlineUsers, setOnlineUsers] = useState<number>(239);

  // Dynamic realistic fluctuation of online users
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = prev + delta;
        return next < 210 ? 215 : next > 290 ? 285 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = 'Oct 19 2026';

  return (
    <header className="w-full flex flex-col items-center pt-4 pb-3 px-4 text-center select-none relative z-10">
      {/* Official MrBeast Panther & Verified Badge Logo */}
      <div className="mb-1 transition-transform hover:scale-105 duration-200">
        <MrBeastLogo size={180} />
      </div>

      {/* If custom brand title is set and not default MR BEAST, show it */}
      {brandTitle && brandTitle !== 'MR BEAST' && (
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase font-['Montserrat',sans-serif] leading-none mb-1">
          {brandTitle}
        </h1>
      )}

      {/* Subtitle: GIFT CARD GIVEAWAY */}
      <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase font-['Montserrat',sans-serif] leading-tight mb-2">
        {subTitle}
      </h2>

      {/* Live Online Users & Last Update Stat Bar (matching video exact styling) */}
      <div className="text-xs sm:text-sm font-extrabold text-black flex items-center justify-center gap-1.5 flex-wrap">
        <span>User Online:</span>
        <span className="text-[#FF2244] font-black tracking-wide tabular-nums">
          {onlineUsers}
        </span>
        <span className="text-slate-400 font-normal">|</span>
        <span>Last update:</span>
        <span className="text-[#FF2244] font-black tracking-wide">
          {formattedDate}
        </span>
      </div>
    </header>
  );
};
