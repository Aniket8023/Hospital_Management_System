import React, { useState, useEffect } from 'react';

import { getAuthHeaders } from '../utils/auth';
function AdminPurchases() {
  const API = 'http://localhost:8080';
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    supplierId: '',
    medicineId: '',
    quantityPurchased: '',
    purchasePrice: ''
  });

  // Load purchases
  const fetchPurchases = async () => {
    try {
      const res = await fetch(`${API}/purchases`, { headers: { ...getAuthHeaders() } });
      if (res.ok) setPurchases(await res.json());
    } catch (e) {
      console.error('Failed to load purchases', e);
    }
  };

  // Load suppliers & medicines for dropdowns
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API}/suppliers`, { headers: { ...getAuthHeaders() } });
      if (res.ok) setSuppliers(await res.json());
    } catch (e) {
      console.error('Failed to load suppliers', e);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await fetch(`${API}/inventory`, { headers: { ...getAuthHeaders() } });
      if (res.ok) setMedicines(await res.json());
    } catch (e) {
      console.error('Failed to load medicines', e);
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchMedicines();
  }, []);

  const openAddModal = () => {
    setFormData({ supplierId: '', medicineId: '', quantityPurchased: '', purchasePrice: '' });
    setFormError('');
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitPurchase = async (e) => {
    e.preventDefault();
    const { supplierId, medicineId, quantityPurchased, purchasePrice } = formData;
    if (!supplierId || !medicineId || !quantityPurchased || !purchasePrice) {
      setFormError('All fields are required');
      return;
    }
    try {
      const res = await fetch(`${API}/purchases`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  body: JSON.stringify({
    supplierId: Number(supplierId),
    medicineId: Number(medicineId),
    quantityPurchased: Number(quantityPurchased),
    purchasePrice: Number(purchasePrice),
  }),
});
      if (res.ok) {
        await fetchPurchases();
        // Optional verify stock update by refetching the specific medicine
        // (not displayed here but can be logged)
        setModalOpen(false);
      } else {
        setFormError('Failed to create purchase');
      }
    } catch (e) {
      console.error('Purchase error', e);
      setFormError('Network error');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">Purchases</h1>
          <p className="text-gray-500 text-xs mt-1 font-semibold">Record medicine purchases from suppliers</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
        >
          <span>➕ New Purchase</span>
        </button>
      </div>

      {/* Purchase Table */}
      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Medicine</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {purchases.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-700">{p.id}</td>
                  <td className="p-4 text-[#0B2C56] font-extrabold">{p.supplierName || p.supplierId}</td>
                  <td className="p-4 text-gray-600">{p.medicineName || p.medicineId}</td>
                  <td className="p-4 text-gray-600">{p.quantityPurchased}</td>
                  <td className="p-4 text-gray-600">{p.purchasePrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#0B2C56]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-[#0B2C56] text-lg">New Purchase</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
            </div>
            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-2">
                ⚠️ {formError}
              </div>
            )}
            <form onSubmit={submitPurchase} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Supplier *</label>
                  <select name="supplierId" value={formData.supplierId} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">-- Choose Supplier --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.supplierName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Medicine *</label>
                  <select name="medicineId" value={formData.medicineId} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">-- Choose Medicine --</option>
                    {medicines.map(m => (
                      <option key={m.id} value={m.id}>{m.medicineName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Quantity *</label>
                  <input type="number" name="quantityPurchased" value={formData.quantityPurchased} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Price *</label>
                  <input type="number" step="0.01" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border text-gray-600 rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white rounded">Save Purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminPurchases;
