import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';

export default function AdminPatients({ patients, addPatient, editPatient, deletePatient }) {
  const [modalOpen, setModalOpen] = useState(false);
  // Search state
  const [searchName, setSearchName] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [searchAadhar, setSearchAadhar] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  // Sync filtered list when patients prop changes
  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);
  const [editMode, setEditMode] = useState(false);
  const [currentPatient, setCurrentPatient] = useState({ id: '', fullName: '', age: '', gender: 'Male', mobileNumber: '', aadharNumber: '', address: '' });

  const openAddModal = () => {
    setEditMode(false);
    setCurrentPatient({
      fullName: '',
      age: '',
      gender: 'Male',
      mobileNumber: '',
      aadharNumber: '',
      address: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditMode(true);
    setCurrentPatient(p);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPatient.fullName || !currentPatient.age || !currentPatient.mobileNumber) return;
    
    if (editMode) {
      editPatient(currentPatient.id, currentPatient);
    } else {
      addPatient(currentPatient);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56] tracking-tight">Patients</h1>
          <p className="text-gray-400 text-xs mt-1">Manage and view hospital patient records</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#0B2C56] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4">
        <input type="text" placeholder="Search by name" value={searchName} onChange={e => setSearchName(e.target.value)} className="px-3 py-2 border rounded" />
        <input type="text" placeholder="Search by mobile" value={searchMobile} onChange={e => setSearchMobile(e.target.value)} className="px-3 py-2 border rounded" />
        <input type="text" placeholder="Search by aadhar" value={searchAadhar} onChange={e => setSearchAadhar(e.target.value)} className="px-3 py-2 border rounded" />
        <button onClick={() => {
          if (searchName) {
            fetch(`http://localhost:8080/patients/search/name?name=${encodeURIComponent(searchName)}`, { headers: { ...getAuthHeaders() } })
              .then(res => res.json())
              .then(data => setFilteredPatients(data))
              .catch(() => console.error('Search failed'));
          } else if (searchMobile) {
            fetch(`http://localhost:8080/patients/search/mobile?mobile=${encodeURIComponent(searchMobile)}`, { headers: { ...getAuthHeaders() } })
              .then(res => res.json())
              .then(data => setFilteredPatients([data]))
              .catch(() => console.error('Search failed'));
          } else if (searchAadhar) {
            fetch(`http://localhost:8080/patients/search/aadhar?aadhar=${encodeURIComponent(searchAadhar)}`, { headers: { ...getAuthHeaders() } })
              .then(res => res.json())
              .then(data => setFilteredPatients([data]))
              .catch(() => console.error('Search failed'));
          } else {
            setFilteredPatients(patients);
          }
        }} className="px-4 py-1 bg-[#0B2C56] text-white rounded">Search</button>
        <button onClick={() => { setSearchName(''); setSearchMobile(''); setSearchAadhar(''); setFilteredPatients(patients); }} className="px-4 py-1 bg-gray-300 rounded">Clear</button>
      </div>

      {/* Patients Table Card */}
      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Age</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Aadhar</th>
                <th className="p-4">Address</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-700">{p.id}</td>
                  <td className="p-4 font-extrabold text-[#0B2C56]">{p.fullName}</td>
                  <td className="p-4 text-gray-600 font-medium">{p.age}</td>
                  <td className="p-4 text-gray-600 font-medium">{p.gender}</td>
                  <td className="p-4 text-gray-600 font-mono font-medium">{p.mobileNumber}</td>
                  <td className="p-4 text-gray-600 font-medium">{p.aadharNumber}</td>
                  <td className="p-4 text-gray-600 font-medium">{p.address}</td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => openEditModal(p)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer font-bold flex items-center justify-center p-1 rounded hover:bg-blue-50 transition"
                        title="Edit Patient"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deletePatient(p.id)}
                        className="text-rose-600 hover:text-rose-800 cursor-pointer font-bold flex items-center justify-center p-1 rounded hover:bg-rose-50 transition"
                        title="Delete Patient"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {patients.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-xs">
            <span>👤</span>
            <p className="mt-1">No patients found.</p>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-[#0B2C56] border-b border-gray-100 pb-2">
              {editMode ? 'Edit Patient Record' : 'Add New Patient'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Patil"
                    value={currentPatient.fullName}
                    onChange={(e) => setCurrentPatient({ ...currentPatient, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 28"
                    value={currentPatient.age}
                    onChange={(e) => setCurrentPatient({ ...currentPatient, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Gender</label>
                  <select
                    value={currentPatient.gender}
                    onChange={(e) => setCurrentPatient({ ...currentPatient, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9922334455"
                    value={currentPatient.mobileNumber}
                    onChange={(e) => setCurrentPatient({ ...currentPatient, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Aadhar Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123456789012"
                    value={currentPatient.aadharNumber}
                    onChange={(e) => setCurrentPatient({ ...currentPatient, aadharNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="e.g. Pune"
                  value={currentPatient.address}
                  onChange={(e) => setCurrentPatient({ ...currentPatient, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#0B2C56] hover:bg-blue-800 text-white font-bold text-sm rounded-lg shadow transition cursor-pointer"
              >
                {editMode ? 'Save Changes' : 'Add Patient'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
