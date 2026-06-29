import React from 'react';

export default function AdminServices() {
  const services = [
    { name: 'Ear Treatment', desc: 'Comprehensive ear diagnosis & treatment' },
    { name: 'Nose Treatment', desc: 'Allergy, sinusitis & nasal care' },
    { name: 'Throat Treatment', desc: 'Throat infection & voice disorders' },
    { name: 'Endoscopy', desc: 'Advanced endoscopic diagnosis' },
    { name: 'Hearing Test', desc: 'Hearing evaluation & solutions' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-extrabold text-[#0B2C56] tracking-tight">Services</h1>
        <p className="text-gray-400 text-xs mt-1">Manage public hospital clinical services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-2">
            <div className="text-2xl">🩺</div>
            <h3 className="font-extrabold text-gray-800 text-base">{s.name}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
