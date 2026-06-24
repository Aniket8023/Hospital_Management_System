import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';

export default function AdminSuppliers({}) {
  const API = 'http://localhost:8080';
  const [suppliers, setSuppliers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    supplierName: '',
    contactPerson: '',
    mobileNumber: '',
    email: '',
    address: ''
  });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API}/suppliers`, { headers: { ...getAuthHeaders() } });
      if (res.ok) setSuppliers(await res.json());
    } catch (e) {
      console.error('Failed to load suppliers', e);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const openAddModal = () => {
    setFormData({ supplierName: '', contactPerson: '', mobileNumber: '', email: '', address: '' });
    setEditMode(false);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (sup) => {
    setSelectedId(sup.id);
    setFormData({
      supplierName: sup.supplierName || '',
      contactPerson: sup.contactPerson || '',
      mobileNumber: sup.mobileNumber || '',
      email: sup.email || '',
      address: sup.address || ''
    });
    setEditMode(true);
    setFormError('');
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitSupplier = async (e) => {
    e.preventDefault();
    const { supplierName, contactPerson, mobileNumber, email, address } = formData;
    if (!supplierName || !contactPerson || !mobileNumber || !email) {
      setFormError('Name, Contact, Mobile and Email are required');
      return;
    }
    const url = editMode ? `${API}/suppliers/${selectedId}` : `${API}/suppliers`;
    const method = editMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await fetchSuppliers();
        setModalOpen(false);
      } else {
        setFormError('Failed to save supplier');
      }
    } catch (e) {
      console.error('Supplier error', e);
      setFormError('Network error');
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      const res = await fetch(`${API}/suppliers/${id}`, { method: 'DELETE', headers: { ...getAuthHeaders() } });
      if (res.ok) await fetchSuppliers();
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">Suppliers</h1>
          <p className="text-gray-500 text-xs mt-1 font-semibold">Manage supplier contacts</p>
        </div>
        <button onClick={openAddModal} className="px-4 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-lg shadow-xs transition">
          ➕ New Supplier
        </button>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-700">{s.id}</td>
                  <td className="p-4 text-[#0B2C56] font-extrabold">{s.supplierName}</td>
                  <td className="p-4 text-gray-600">{s.contactPerson}</td>
                  <td className="p-4 text-gray-600">{s.mobileNumber}</td>
                  <td className="p-4 text-gray-600">{s.email}</td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button onClick={() => openEditModal(s)} className="text-blue-600 hover:text-blue-800 font-bold text-xs">✏️</button>
                    <button onClick={() => deleteSupplier(s.id)} className="text-rose-600 hover:text-rose-800 font-bold text-xs">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[#0B2C56]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-[#0B2C56] text-lg">{editMode ? 'Edit' : 'New'} Supplier</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
            </div>
            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-2">
                ⚠️ {formError}
              </div>
            )}
            <form onSubmit={submitSupplier} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Supplier Name *</label>
                  <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Contact Person *</label>
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Mobile *</label>
                  <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full p-2 border rounded" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border text-gray-600 rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
