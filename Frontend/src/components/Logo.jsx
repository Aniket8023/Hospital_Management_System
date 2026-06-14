import React from 'react';

export default function Logo({ className = '', showText = true }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Icon */}
      <svg
        className="w-12 h-12 flex-shrink-0"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ring/Teal Arc */}
        <path
          d="M32 15C18 25 12 43 17 60C22 77 39 88 57 85C66 83 74 78 80 71"
          stroke="#2B9CB5"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Silhouette Inner Navy Face */}
        <path
          d="M61 45C61 32 50 25 38 25C26 25 22 35 22 45C22 55 25 56 27 58C28.5 59.5 28 62 27.5 64C26.8 66.8 28.5 70 31.5 70C34.5 70 36 67.5 36.5 65.5C37 63.5 38.5 63 40.5 63C42.5 63 43 65 44 68C45 71 47.5 75 52 75C56.5 75 58 70 58 64C58 59 61 58 61 45Z"
          fill="#0B2C56"
        />
        {/* Secondary Profile Outline in Teal/Teal-Blue */}
        <path
          d="M67 48C67 37 57 32 47 32C42 32 37 34 35 37"
          stroke="#2B9CB5"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Cross Symbol (+ symbol in teal/light blue) */}
        <rect x="74" y="44" width="8" height="20" rx="3" fill="#2B9CB5" />
        <rect x="68" y="50" width="20" height="8" rx="3" fill="#2B9CB5" />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold tracking-wide text-2xl text-[#0B2C56] font-sans">
              SHINDE
            </span>
          </div>
          <span className="font-bold tracking-[0.25em] text-sm text-[#0B2C56] leading-none mt-0.5">
            HOSPITAL
          </span>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 font-medium whitespace-nowrap">
            <span className="h-[1px] w-6 bg-gray-300"></span>
            <span className="text-[#0B2C56] text-[9px] font-semibold tracking-wider font-serif">
              Care With Compassion
            </span>
            <span className="h-[1px] w-6 bg-gray-300"></span>
          </div>
        </div>
      )}
    </div>
  );
}
