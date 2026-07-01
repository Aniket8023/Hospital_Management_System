import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { showLocalStorageErrors } from '../utils/errors';

export default function AdminSettings() {
  const [hospitalName, setHospitalName] = useState('Shinde ENT Hospital');

  useEffect(() => {
    showLocalStorageErrors();
  }, []);
  const [address, setAddress] = useState('Near Balajicool, Shivajinagar, Mehkar, Dist. Buldhana');
  const [contact, setContact] = useState('8888551743');
  const [email, setEmail] = useState('admin@shindehospital.com');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings Saved Successfully!');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-extrabold text-[#0B2C56] tracking-tight">Settings</h1>
        <p className="text-gray-400 text-xs mt-1">Configure hospital contact info and public portal parameters</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Hospital Name</label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Clinic Location Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Contact Phone</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Hospital Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#0B2C56] hover:bg-blue-800 text-white font-bold text-sm rounded-lg shadow transition cursor-pointer"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
