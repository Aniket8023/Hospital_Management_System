import React, { useState } from 'react';

export default function PortalSelector({ currentRole, setCurrentRole }) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: 'patient',
      name: 'Patient Portal',
      desc: 'Book appointments & explore services',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🏥'
    },
    {
      id: 'doctor',
      name: 'Doctor Portal',
      desc: 'Check schedule & write prescriptions',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: '🩺'
    },
    {
      id: 'admin',
      name: 'Admin Portal',
      desc: 'Manage doctors, departments & appointments',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: '🔑'
    }
  ];

  const activeRole = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#0B2C56] text-white px-4 py-3 rounded-full shadow-2xl hover:bg-[#154175] transition-all duration-300 border border-white/20 hover:scale-105 cursor-pointer"
      >
        <span className="animate-pulse flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
          <span>{activeRole.icon}</span>
          <span>Switch Portal ({activeRole.name.split(' ')[0]})</span>
        </span>
      </button>

      {/* Switcher Card */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-transparent z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute bottom-16 right-0 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-fadeIn transform transition-all duration-300">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm tracking-wide">
                Select Portal View
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2.5">
              {roles.map((role) => {
                const isSelected = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setCurrentRole(role.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 items-start ${
                      isSelected
                        ? 'border-[#0B2C56] bg-blue-50/50 shadow-xs'
                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{role.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 text-sm">
                          {role.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-[#0B2C56] text-white px-1.5 py-0.5 rounded-full font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 leading-tight">
                        {role.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-3 pt-2 text-[10px] text-gray-400 text-center border-t border-gray-100">
              State is stored and synchronized in localStorage.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
