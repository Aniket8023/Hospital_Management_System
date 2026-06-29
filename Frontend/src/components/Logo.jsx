import React from 'react';
import logoImg from '../assets/logo.png';

export default function Logo({ className = '', imgClassName = 'h-12', showText = true }) {
  return (
    <div className={`flex items-center ${className}`}>
      {showText ? (
        <img
          src={logoImg}
          alt="Shinde ENT Hospital Logo"
          className={`${imgClassName} w-auto object-contain mix-blend-multiply`}
        />
      ) : (
        <div className="h-10 w-10 overflow-hidden rounded-xl bg-white border border-gray-100 flex items-center justify-start shadow-xs">
          <img
            src={logoImg}
            alt="Shinde ENT Hospital Icon"
            className="h-10 w-auto max-w-none object-cover object-left scale-125 origin-left"
          />
        </div>
      )}
    </div>
  );
}
