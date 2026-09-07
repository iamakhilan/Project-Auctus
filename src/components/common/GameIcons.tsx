import React from 'react';

interface GameIconProps {
  className?: string;
  size?: number;
}

export const CoinIcon: React.FC<GameIconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)] ${className}`}
  >
    <circle cx="12" cy="12" r="10" fill="url(#coin_gold_grad)" stroke="#b45309" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="7.5" stroke="#fef08a" strokeWidth="1" strokeDasharray="2 1" opacity="0.8" />
    <path
      d="M12 7V17M14.5 9.5C14.5 8.39543 13.3807 7.5 12 7.5C10.6193 7.5 9.5 8.39543 9.5 9.5C9.5 10.6046 10.6193 11.5 12 11.5C13.3807 11.5 14.5 12.3954 14.5 13.5C14.5 14.6046 13.3807 15.5 12 15.5C10.6193 15.5 9.5 14.6046 9.5 13.5"
      stroke="#78350f"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="coin_gold_grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.3" stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

export const GemIcon: React.FC<GameIconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)] ${className}`}
  >
    <path
      d="M6 3L18 3L22 9L12 21L2 9L6 3Z"
      fill="url(#gem_cyan_grad)"
      stroke="#1d4ed8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M2 9H22M6 3L12 21L18 3M9 9L12 3L15 9L12 21L9 9Z"
      stroke="#93c5fd"
      strokeWidth="1"
      strokeLinejoin="round"
      opacity="0.85"
    />
    <defs>
      <linearGradient id="gem_cyan_grad" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e0f2fe" />
        <stop offset="0.25" stopColor="#38bdf8" />
        <stop offset="0.75" stopColor="#2563eb" />
        <stop offset="1" stopColor="#1e40af" />
      </linearGradient>
    </defs>
  </svg>
);

export const EnergyIcon: React.FC<GameIconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 drop-shadow-[0_2px_4px_rgba(234,179,8,0.6)] ${className}`}
  >
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill="url(#energy_grad)"
      stroke="#ca8a04"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 4.5L5.5 13H11.5L11 18.5L18 11H12.5L12.5 4.5Z"
      fill="#fef9c3"
      opacity="0.6"
    />
    <defs>
      <linearGradient id="energy_grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.4" stopColor="#eab308" />
        <stop offset="1" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
  </svg>
);

export const FireStreakIcon: React.FC<GameIconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 drop-shadow-[0_2px_4px_rgba(239,68,68,0.6)] ${className}`}
  >
    <path
      d="M12 2C9 7 5 9 5 14C5 17.866 8.13401 21 12 21C15.866 21 19 17.866 19 14C19 8 15 6 12 2Z"
      fill="url(#fire_grad)"
      stroke="#b91c1c"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 11C10.5 13.5 9 14.5 9 16.5C9 18.1569 10.3431 19.5 12 19.5C13.6569 19.5 15 18.1569 15 16.5C15 14 13.5 13 12 11Z"
      fill="#fef08a"
    />
    <defs>
      <linearGradient id="fire_grad" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.3" stopColor="#f97316" />
        <stop offset="0.8" stopColor="#ef4444" />
        <stop offset="1" stopColor="#991b1b" />
      </linearGradient>
    </defs>
  </svg>
);

export const TrophyIcon: React.FC<GameIconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)] ${className}`}
  >
    <path
      d="M6 3H18V9C18 12.3137 15.3137 15 12 15C8.68629 15 6 12.3137 6 9V3Z"
      fill="url(#trophy_grad)"
      stroke="#b45309"
      strokeWidth="1.5"
    />
    <path
      d="M6 5H3C2.44772 5 2 5.44772 2 6C2 8.5 4 10 6 10M18 5H21C21.5523 5 22 5.44772 22 6C22 8.5 20 10 18 10"
      stroke="#d97706"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 15V18H14V15M8 21H16"
      stroke="#d97706"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="trophy_grad" x1="12" y1="3" x2="12" y2="15" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.5" stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

export const SwordsIcon: React.FC<GameIconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
  >
    <path
      d="M14.5 17.5L3 6V3H6L17.5 14.5M14.5 17.5L19 22L22 19L17.5 14.5M14.5 17.5L17.5 14.5M13 19L19 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 17.5L21 6V3H18L6.5 14.5M9.5 17.5L5 22L2 19L6.5 14.5M9.5 17.5L6.5 14.5M11 19L5 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShieldIcon: React.FC<GameIconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
  >
    <path
      d="M12 2L4 5V11.5C4 16.5 7.5 20.8 12 22C16.5 20.8 20 16.5 20 11.5V5L12 2Z"
      fill="url(#shield_grad)"
      stroke="#1e3a8a"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 4.5V19.5C15 18.5 17.5 15 17.5 11.5V7L12 4.5Z"
      fill="#60a5fa"
      opacity="0.5"
    />
    <defs>
      <linearGradient id="shield_grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93c5fd" />
        <stop offset="0.3" stopColor="#3b82f6" />
        <stop offset="1" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
  </svg>
);

export const StarIcon: React.FC<GameIconProps & { filled?: boolean }> = ({ className = '', size = 16, filled = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block flex-shrink-0 ${className}`}
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={filled ? 'url(#star_gold_grad)' : '#1e293b'}
      stroke={filled ? '#b45309' : '#475569'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {filled && (
      <defs>
        <linearGradient id="star_gold_grad" x1="12" y1="2" x2="12" y2="21.02" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
    )}
  </svg>
);
