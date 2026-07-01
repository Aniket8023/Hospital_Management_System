import React from 'react';
import logoImg from '../assets/logo.png';

export default function Logo({
  className = '',
  imgClassName = 'h-10 max-w-[170px]',
  showText = true
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {showText ? (
        <img
          src={logoImg}
          alt="Shinde ENT Hospital Logo"
          className={`${imgClassName} w-auto object-contain`}
        />
      ) : (
        <div className="h-10 w-10 overflow-hidden rounded-xl bg-white border border-gray-100 flex items-center justify-center">
          <img
            src={logoImg}
            alt="Shinde ENT Hospital Icon"
            className="h-10 w-10 object-contain"
          />
        </div>
      )}
    </div>
  );
}