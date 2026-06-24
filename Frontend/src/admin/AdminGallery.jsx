import React from 'react';

export default function AdminGallery() {
  const images = [
    { title: 'Reception Counter', desc: 'Hospital Main Entrance', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=300&h=200' },
    { title: 'Diagnostic Lab', desc: 'Modern Audiology & Hearing Setup', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300&h=200' },
    { title: 'Operation Theatre', desc: 'State of the art Endoscopy Setup', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=300&h=200' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56] tracking-tight">Gallery</h1>
          <p className="text-gray-400 text-xs mt-1">Manage public hospital interior and facility photos</p>
        </div>
        <button className="px-4 py-2 bg-[#0B2C56] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer">
          + Add Image
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <img src={img.url} alt={img.title} className="w-full h-40 object-cover" />
            <div className="p-4 space-y-1">
              <h3 className="font-extrabold text-gray-800 text-sm">{img.title}</h3>
              <p className="text-gray-500 text-[11px] font-medium leading-relaxed">{img.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
