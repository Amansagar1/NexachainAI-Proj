import React from 'react';

export const NexachainLogo = ({ size = 'md', isDark = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0 drop-shadow-md`}
      >
        <defs>
          <linearGradient id="nexa-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>
          <linearGradient id="nexa-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#003DB8" />
          </linearGradient>
          <linearGradient id="nexa-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0047BA" />
            <stop offset="100%" stopColor="#00267A" />
          </linearGradient>
        </defs>

        <path
          d="M18 15 C18 12.5 20.5 10.5 23.5 12 L44 23.5 C46 24.5 47 26.5 47 29 L47 85 C47 87.5 44.5 89.5 41.5 88 L21 76.5 C19 75.5 18 73.5 18 71 Z"
          fill="url(#nexa-cyan)"
        />

        <path
          d="M47 29 L79 47.5 C81.5 49 83 51.5 83 54.5 L83 85 C83 87.5 80.5 89.5 77.5 88 L47 70.5 Z"
          fill="url(#nexa-dark)"
        />

        <path
          d="M54 15 C54 12.5 56.5 10.5 59.5 12 L80 23.5 C82 24.5 83 26.5 83 29 L83 60 C83 62.5 80.5 64.5 77.5 63 L57 51.5 C55 50.5 54 48.5 54 46 Z"
          fill="url(#nexa-blue)"
        />
      </svg>

      <div className="flex items-center tracking-tight">
        <span
          className={`font-black ${textSizes[size]} ${
            isDark ? 'text-white' : 'text-[#0B1736]'
          } tracking-tight`}
        >
          Nexachain
        </span>
        <span className={`font-black ${textSizes[size]} text-[#0066FF] ml-1.5`}>AI</span>
      </div>
    </div>
  );
};
