import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';

export default function AdminBilling({ patients = [] }) {
  const API = 'http://localhost:8080';

  // Form state
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [billNo, setBillNo] = useState('B-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
  const [billItems, setBillItems] = useState([{ itemName: '', quantity: 1, unitPrice: 0 }]);

  // Appointments state
  const [appointments, setAppointments] = useState([]);

  // Bills list and filter
  const [bills, setBills] = useState([]);
  const [filterPatientId, setFilterPatientId] = useState('');
  const [loadingBills, setLoadingBills] = useState(false);
  const [saving, setSaving] = useState(false);

  // Calculate total
  const totalAmount = billItems.reduce(
    (sum, it) => sum + Number(it.quantity || 0) * Number(it.unitPrice || 0),
    0
  );

  // Load appointments
  useEffect(() => {
    fetch(`${API}/appointments`, { headers: { ...getAuthHeaders() } })
      .then(res => res.json())
      .then(data => setAppointments(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // Load bills
  const fetchBills = async (patientId = '') => {
    setLoadingBills(true);
    try {
      const url = patientId ? `${API}/bills/patient/${patientId}` : `${API}/bills`;
      const res = await fetch(url, { headers: { ...getAuthHeaders() } });
      console.log('FETCH BILLS STATUS:', res.status);
     if (res.ok) {

  const text = await res.text();

  console.log("RAW BILL RESPONSE:");
  console.log(text);

  const data = JSON.parse(text);

  setBills(Array.isArray(data) ? data : []);
} else {
        const text = await res.text();
        console.error('Failed to load bills:', res.status, text);
      }
    } catch (e) {
      console.error('Failed to load bills', e);
    } finally {
      setLoadingBills(false);
    }
  };

  useEffect(() => { fetchBills(); }, []);

  // Item handlers
  const handleAddItem = () => setBillItems([...billItems, { itemName: '', quantity: 1, unitPrice: 0 }]);
  const handleRemoveItem = idx => setBillItems(billItems.filter((_, i) => i !== idx));
  const handleItemChange = (idx, field, value) => {
    const upd = [...billItems];
    upd[idx][field] = value;
    setBillItems(upd);
  };

  // Save bill
  const handleSave = async () => {
    if (!selectedPatientId) { alert('Please select a patient'); return; }
    if (!selectedAppointmentId) { alert('Please select an appointment'); return; }
    if (billItems.some(it => !it.itemName)) { alert('Please fill in all item names'); return; }

    const payload = {
      patientId: Number(selectedPatientId),
      appointmentId: Number(selectedAppointmentId),
      items: billItems.map(item => ({
        itemName: item.itemName,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      }))
    };

    setSaving(true);
    try {
      const res = await fetch(`${API}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      console.log('BILL CREATE STATUS:', res.status, 'RESPONSE:', text);
      if (res.ok) {
        alert('Invoice created successfully!');
        // Refetch the bills list to show the new entry
        await fetchBills(filterPatientId);
        setSelectedPatientId('');
        setSelectedAppointmentId('');
        setBillItems([{ itemName: '', quantity: 1, unitPrice: 0 }]);
        setBillNo('B-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
        setDate(new Date().toISOString().split('T')[0]);
      } else {
        alert('Failed to create invoice: ' + text);
      }
    } catch (e) {
      console.error(e);
      alert('Network error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // Update payment status
  const handlePaymentUpdate = async (billId, status) => {
    try {
      const res = await fetch(`${API}/bills/${billId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ paymentStatus: status })
      });
      if (res.ok) fetchBills(filterPatientId);
    } catch (e) { console.error(e); }
  };

  // Download PDF
  const handleDownload = async (billId) => {
    try {
      const res = await fetch(`${API}/bills/${billId}/pdf`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) throw new Error('Download Failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${billId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to download invoice');
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'PAID') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'UNPAID') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="p-6 md:p-8 font-sans text-gray-800 bg-gray-50/30 min-h-screen space-y-8">

      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">Billing</h1>
          <p className="text-gray-400 text-xs mt-1 font-semibold">Generate invoices and track payments</p>
        </div>
      </div>

      {/* ─── Create Invoice Card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[#0B2C56] to-[#154175] px-6 py-4">
          <h2 className="text-white font-bold text-base">🧾 Create Invoice</h2>
          <p className="text-blue-200 text-xs mt-0.5">Fill in patient, appointment, and items</p>
        </div>

        <div className="p-6 space-y-6">

          {/* Row 1: Patient + Appointment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Patient *</label>
              <select
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] bg-white"
              >
                <option value="">— Select Patient —</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} (ID: {p.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Appointment *</label>
              <select
                value={selectedAppointmentId}
                onChange={e => setSelectedAppointmentId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] bg-white"
              >
                <option value="">— Select Appointment —</option>
                {appointments.map(a => (
                  <option key={a.id} value={a.id}>#{a.id} — {a.patient?.fullName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Date + Bill No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bill No (Auto)</label>
              <input
                type="text"
                value={billNo}
                onChange={e => setBillNo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none"
                readOnly
              />
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice Items</label>
              <button
                onClick={handleAddItem}
                className="text-xs font-bold text-[#0B2C56] hover:text-[#154175] border border-[#0B2C56]/30 hover:border-[#0B2C56] px-3 py-1 rounded-lg transition flex items-center gap-1"
              >
                + Add Item
              </button>
            </div>

            {/* Items Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 rounded-lg text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
              <div className="col-span-6">Item Name</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-3 text-center">Unit Price (₹)</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-2">
              {billItems.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="e.g. ENT Consultation"
                    value={it.itemName}
                    onChange={e => handleItemChange(idx, 'itemName', e.target.value)}
                    className="col-span-6 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56]"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={it.quantity}
                    onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                    className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-[#0B2C56]"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={it.unitPrice}
                    onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)}
                    className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-[#0B2C56]"
                  />
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="col-span-1 text-rose-400 hover:text-rose-600 font-bold text-lg flex justify-center transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total + Save */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 font-semibold">
              {billItems.length} item(s)
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Amount</p>
                <p className="text-2xl font-extrabold text-[#0B2C56]">₹ {totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-[#0B2C56] hover:bg-[#154175] disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow transition flex items-center gap-2"
              >
                {saving ? '⏳ Saving...' : '💾 Save Invoice'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bills Table ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-base font-extrabold text-[#0B2C56]">📋 Bills History</h2>
            <p className="text-gray-400 text-xs mt-0.5">View and manage all invoices</p>
          </div>
          <select
            value={filterPatientId}
            onChange={e => { setFilterPatientId(e.target.value); fetchBills(e.target.value); }}
            className="border border-gray-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#0B2C56]"
          >
            <option value="">All Patients</option>
            {patients.map(p => (<option key={p.id} value={p.id}>{p.fullName}</option>))}
          </select>
        </div>

        {loadingBills ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            <span className="text-2xl">⏳</span>
            <p className="mt-2">Loading bills...</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            <span className="text-2xl">🧾</span>
            <p className="mt-2">No bills found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bills.map(bill => (
                  <tr key={bill.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-700">#{bill.id}</td>
                    <td className="p-4 font-extrabold text-[#0B2C56]">{bill.patient?.fullName || '—'}</td>
                    <td className="p-4 text-gray-500">{bill.billDate || '—'}</td>
                    <td className="p-4 font-bold text-gray-800">
                      {bill.totalAmount ? `₹ ${Number(bill.totalAmount).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border inline-block ${getStatusStyle(bill.paymentStatus)}`}>
                        {bill.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {bill.paymentStatus !== 'PAID' && (
                          <button
                            onClick={() => handlePaymentUpdate(bill.id, 'PAID')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded transition shadow-xs"
                          >
                            ✓ Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(bill.id)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold rounded transition shadow-xs"
                        >
                          ⬇ Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
