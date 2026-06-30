import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '../utils/auth';

/**
 * AdminInventory – single-page medicine inventory with 3 tabs:
 *   1. Medicines  – CRUD + search
 *   2. Low Stock  – alert cards (qty < 10)
 *   3. Expiry     – expiring-soon cards
 */
export default function AdminInventory() {
  const API = 'http://localhost:8080';

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState('medicines');

  // ── Medicines state ──
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Form state (add / edit) ──
  const [newMed, setNewMed] = useState({
    medicineName: '', category: '', quantity: 0,
    price: 0, expiryDate: '', manufacturer: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editingMed, setEditingMed] = useState({});
  const [saving, setSaving] = useState(false);

  // ── Alert states ──
  const [lowStock, setLowStock] = useState([]);
  const [expiryAlert, setExpiryAlert] = useState([]);
  const [loadingLow, setLoadingLow] = useState(false);
  const [loadingExpiry, setLoadingExpiry] = useState(false);

  // ── Helpers ──
  const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: { ...getAuthHeaders(), ...options.headers },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  // ── Load medicines ──
  const loadMedicines = async () => {
    setLoading(true);
    try {
      const data = await fetchJSON(`${API}/inventory`);
      setMedicines(data || []);
    } catch (err) { toast.error(String(err)); }
    finally { setLoading(false); }
  };

  // ── Load low-stock ──
  const loadLowStock = async () => {
    setLoadingLow(true);
    try {
      const data = await fetchJSON(`${API}/inventory/low-stock`);
      setLowStock(data || []);
    } catch (err) { toast.error(String(err)); }
    finally { setLoadingLow(false); }
  };

  // ── Load expiry alerts ──
  const loadExpiryAlert = async () => {
    setLoadingExpiry(true);
    try {
      const data = await fetchJSON(`${API}/inventory/expiry-alert`);
      setExpiryAlert(data || []);
    } catch (err) { toast.error(String(err)); }
    finally { setLoadingExpiry(false); }
  };

  // On mount → load everything
  useEffect(() => {
    loadMedicines();
    loadLowStock();
    loadExpiryAlert();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!search.trim()) { loadMedicines(); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchJSON(
          `${API}/inventory/search?keyword=${encodeURIComponent(search)}`
        );
        setMedicines(data || []);
      } catch (err) { toast.error(String(err)); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // ── CRUD ──
  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`${API}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          ...newMed,
          quantity: Number(newMed.quantity),
          price: Number(newMed.price),
        }),
      });
      toast.success('Medicine added successfully!');
      setNewMed({ medicineName: '', category: '', quantity: 0, price: 0, expiryDate: '', manufacturer: '' });
      loadMedicines();
      loadLowStock();
      loadExpiryAlert();
    } catch (err) { toast.error(String(err)); toast.error('Failed to add medicine'); }
    finally { setSaving(false); }
  };

  const startEdit = (med) => {
    setEditingId(med.id);
    setEditingMed({ ...med });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingMed({});
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`${API}/inventory/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          ...editingMed,
          quantity: Number(editingMed.quantity),
          price: Number(editingMed.price),
        }),
      });
      toast.success('Medicine updated!');
      cancelEdit();
      loadMedicines();
      loadLowStock();
      loadExpiryAlert();
    } catch (err) { toast.error(String(err)); toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    try {
      await fetch(`${API}/inventory/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
      setMedicines(prev => prev.filter(m => m.id !== id));
      loadLowStock();
      loadExpiryAlert();
    } catch (err) { toast.error(String(err)); }
  };

  // ── Helpers for expiry ──
  const daysUntilExpiry = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getExpiryColor = (days) => {
    if (days <= 0) return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800', label: 'EXPIRED' };
    if (days <= 7) return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', badge: 'bg-red-100 text-red-700', label: `${days} day${days !== 1 ? 's' : ''} left` };
    if (days <= 30) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800', label: `${days} days left` };
    return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800', label: `${days} days left` };
  };

  // ── Tab config ──
  const tabs = [
    { key: 'medicines', label: '💊 Medicines', count: medicines.length },
    { key: 'lowstock', label: '⚠️ Low Stock', count: lowStock.length },
    { key: 'expiry', label: '⏰ Expiry Alerts', count: expiryAlert.length },
  ];

  // ── Input style ──
  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] bg-white';
  const labelClass = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5';

  return (
    <div className="p-6 md:p-8 font-sans text-gray-800 bg-gray-50/30 min-h-screen space-y-6">

      {/* ═══ Page Header ═══ */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">📦 Inventory Management</h1>
          <p className="text-gray-400 text-xs mt-1 font-semibold">Manage medicines, stock alerts & expiry tracking</p>
        </div>
      </div>

      {/* ═══ Tab Bar ═══ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
              flex items-center justify-center gap-2
              ${activeTab === tab.key
                ? 'bg-gradient-to-r from-[#0B2C56] to-[#154175] text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }
            `}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`
                text-[10px] px-1.5 py-0.5 rounded-full font-extrabold
                ${activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 1 — Medicines                          */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'medicines' && (
        <div className="space-y-6">

          {/* ── Add / Edit Medicine Form ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B2C56] to-[#154175] px-6 py-4">
              <h2 className="text-white font-bold text-base">
                {editingId ? '✏️ Edit Medicine' : '➕ Add New Medicine'}
              </h2>
              <p className="text-blue-200 text-xs mt-0.5">
                {editingId ? 'Update the medicine details below' : 'Fill in all fields to add a medicine'}
              </p>
            </div>

            <form onSubmit={editingId ? handleEdit : handleAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Medicine Name *</label>
                  <input
                    required
                    placeholder="e.g. Paracetamol 500mg"
                    value={editingId ? editingMed.medicineName : newMed.medicineName}
                    onChange={e => editingId
                      ? setEditingMed({ ...editingMed, medicineName: e.target.value })
                      : setNewMed({ ...newMed, medicineName: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Category *</label>
                  <input
                    required
                    placeholder="e.g. Analgesic"
                    value={editingId ? editingMed.category : newMed.category}
                    onChange={e => editingId
                      ? setEditingMed({ ...editingMed, category: e.target.value })
                      : setNewMed({ ...newMed, category: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Quantity *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="0"
                    value={editingId ? editingMed.quantity : newMed.quantity}
                    onChange={e => editingId
                      ? setEditingMed({ ...editingMed, quantity: e.target.value })
                      : setNewMed({ ...newMed, quantity: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={editingId ? editingMed.price : newMed.price}
                    onChange={e => editingId
                      ? setEditingMed({ ...editingMed, price: e.target.value })
                      : setNewMed({ ...newMed, price: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Expiry Date *</label>
                  <input
                    required
                    type="date"
                    value={editingId ? editingMed.expiryDate : newMed.expiryDate}
                    onChange={e => editingId
                      ? setEditingMed({ ...editingMed, expiryDate: e.target.value })
                      : setNewMed({ ...newMed, expiryDate: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Manufacturer *</label>
                  <input
                    required
                    placeholder="e.g. Cipla"
                    value={editingId ? editingMed.manufacturer : newMed.manufacturer}
                    onChange={e => editingId
                      ? setEditingMed({ ...editingMed, manufacturer: e.target.value })
                      : setNewMed({ ...newMed, manufacturer: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    ✕ Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#0B2C56] hover:bg-[#154175] disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow transition flex items-center gap-2"
                >
                  {saving
                    ? '⏳ Saving...'
                    : editingId ? '💾 Update Medicine' : '➕ Add Medicine'
                  }
                </button>
              </div>
            </form>
          </div>

          {/* ── Search Box ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search medicines by name, category, manufacturer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm focus:outline-none bg-transparent placeholder-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ── Medicines Table ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-extrabold text-[#0B2C56]">📋 Medicine List</h2>
              <p className="text-gray-400 text-xs mt-0.5">
                {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} found
                {search && ` for "${search}"`}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                <span className="text-2xl">⏳</span>
                <p className="mt-2">Loading medicines...</p>
              </div>
            ) : medicines.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                <span className="text-2xl">💊</span>
                <p className="mt-2">No medicines found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-center">Qty</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Expiry</th>
                      <th className="p-4">Manufacturer</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {medicines.map(med => {
                      const isLow = med.quantity < 10;
                      return (
                        <tr key={med.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 font-bold text-gray-700">#{med.id}</td>
                          <td className="p-4 font-extrabold text-[#0B2C56]">{med.medicineName}</td>
                          <td className="p-4 text-gray-500">{med.category}</td>
                          <td className="p-4 text-center">
                            <span className={`
                              px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border inline-block
                              ${isLow
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }
                            `}>
                              {med.quantity}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-gray-800">₹ {Number(med.price).toLocaleString('en-IN')}</td>
                          <td className="p-4 text-gray-500">{med.expiryDate}</td>
                          <td className="p-4 text-gray-500">{med.manufacturer}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => startEdit(med)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold rounded transition shadow-xs"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDelete(med.id)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold rounded transition shadow-xs"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 2 — Low Stock Alerts                   */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'lowstock' && (
        <div className="space-y-6">

          {/* Header card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-600 to-orange-500 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-base">⚠️ Low Stock Medicines</h2>
                <p className="text-rose-100 text-xs mt-0.5">Medicines with quantity less than 10 units</p>
              </div>
              <button
                onClick={loadLowStock}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {loadingLow ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              <span className="text-2xl">⏳</span>
              <p className="mt-2">Loading low stock alerts...</p>
            </div>
          ) : lowStock.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <span className="text-4xl">✅</span>
              <p className="text-gray-500 text-sm mt-3 font-semibold">All medicines are well stocked!</p>
              <p className="text-gray-400 text-xs mt-1">No items below the minimum threshold.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStock.map(item => {
                const isCritical = item.quantity <= 5;
                return (
                  <div
                    key={item.id}
                    className={`
                      rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md
                      ${isCritical
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-amber-50 border-amber-200'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-extrabold text-sm ${isCritical ? 'text-rose-800' : 'text-amber-800'}`}>
                          {item.medicineName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.category} • {item.manufacturer}</p>
                      </div>
                      <span className={`
                        text-xl font-extrabold
                        ${isCritical ? 'text-rose-600' : 'text-amber-600'}
                      `}>
                        {isCritical ? '🔴' : '🟡'}
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Remaining Stock</p>
                        <p className={`text-2xl font-extrabold ${isCritical ? 'text-rose-700' : 'text-amber-700'}`}>
                          {item.quantity}
                          <span className="text-xs font-bold ml-1">units</span>
                        </p>
                      </div>
                      <span className={`
                        px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase
                        ${isCritical
                          ? 'bg-rose-200 text-rose-800'
                          : 'bg-amber-200 text-amber-800'
                        }
                      `}>
                        {isCritical ? 'Critical' : 'Low Stock'}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                      <p className="text-xs text-gray-500">
                        💰 ₹{Number(item.price).toLocaleString('en-IN')} per unit
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 3 — Expiry Alerts                      */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'expiry' && (
        <div className="space-y-6">

          {/* Header card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-base">⏰ Expiring Soon</h2>
                <p className="text-amber-100 text-xs mt-0.5">Medicines approaching their expiry date</p>
              </div>
              <button
                onClick={loadExpiryAlert}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {loadingExpiry ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              <span className="text-2xl">⏳</span>
              <p className="mt-2">Loading expiry alerts...</p>
            </div>
          ) : expiryAlert.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <span className="text-4xl">✅</span>
              <p className="text-gray-500 text-sm mt-3 font-semibold">No medicines expiring soon!</p>
              <p className="text-gray-400 text-xs mt-1">All medicines have valid expiry dates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {expiryAlert.map(item => {
                const days = daysUntilExpiry(item.expiryDate);
                const color = getExpiryColor(days);
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${color.bg} ${color.border}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-extrabold text-sm ${color.text}`}>
                          {item.medicineName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.category} • {item.manufacturer}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${color.badge}`}>
                        {color.label}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Expiry Date</p>
                      <p className={`text-lg font-extrabold ${color.text}`}>
                        {item.expiryDate}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200/50 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        📦 {item.quantity} units in stock
                      </p>
                      <p className="text-xs text-gray-500">
                        💰 ₹{Number(item.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
