import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';

export default function AdminPrescriptions({ patients = [], appointments = [] }) {
  const API = 'http://localhost:8080';
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    diagnosis: '',
    advice: '',
    medicines: [{ medicineName: '', dosage: '', duration: '' }]
  });
  const [formError, setFormError] = useState('');

  // Fetch doctors for dropdown
  useEffect(() => {
    fetch(`${API}/doctor`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(setDoctors)
      .catch(e => console.error('Failed to load doctors', e));
  }, []);

  // Load all prescriptions
  const fetchPrescriptions = async () => {
    try {
      const res = await fetch(`${API}/prescriptions`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setPrescriptions(await res.json());
    } catch (e) {
      console.error('Failed to load prescriptions', e);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const openAddModal = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentId: '',
      diagnosis: '',
      advice: '',
      medicines: [{ medicineName: '', dosage: '', duration: '' }]
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, medicines: updated }));
  };

  const addMedicineRow = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { medicineName: '', dosage: '', duration: '' }]
    }));
  };

  const removeMedicineRow = (idx) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== idx)
    }));
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.patientId || !formData.doctorId || !formData.diagnosis) {
      setFormError('Patient, Doctor and Diagnosis are required');
      return;
    }
    const payload = { 
      ...formData,
      patientId: Number(formData.patientId),
      doctorId: Number(formData.doctorId),
      appointmentId: formData.appointmentId ? Number(formData.appointmentId) : null
    };
    try {
      const res = await fetch(`${API}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      console.log("STATUS =", res.status);
      console.log("RESPONSE =", text);
      if (res.ok) {
        await fetchPrescriptions();
        setModalOpen(false);
      } else {
        setFormError(text);
      }
    } catch (e) {
      console.error('Create prescription error', e);
      setFormError('Network error');
    }
  };

  const openViewModal = async (presc) => {
    // Fetch full details (in case the list is summary only)
    try {
      const res = await fetch(`${API}/prescriptions/${presc.id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedPrescription(data);
        setViewModalOpen(true);
      }
    } catch (e) {
      console.error('Failed to fetch prescription', e);
    }
  };

  const downloadPdf = async (id) => {
    try {
      const res = await fetch(`${API}/prescriptions/${id}/pdf`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (e) {
      console.error('PDF download error', e);
    }
  };

  const getPatientName = (prescription) => {
    if (prescription.patient?.fullName) return prescription.patient.fullName;
    const p = patients.find(p => p.id === prescription.patientId);
    return p?.fullName || p?.name || "N/A";
  };
  const getDoctorName = (prescription) => {
    if (prescription.doctor?.user?.name) return prescription.doctor.user.name;
    const d = doctors.find(d => d.id === prescription.doctorId);
    return d?.user?.name || "N/A";
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">Prescriptions</h1>
          <p className="text-gray-500 text-xs mt-1 font-semibold">Create and manage patient prescriptions</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
        >
          <span>➕ New Prescription</span>
        </button>
      </div>

      {/* Prescription Table */}
      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {prescriptions.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-700">{p.id}</td>
                  <td className="p-4 text-[#0B2C56] font-extrabold">{getPatientName(p)}</td>
                  <td className="p-4 text-gray-600">{getDoctorName(p)}</td>
                  <td className="p-4 text-gray-600">{p.createdDate || p.prescriptionDate || ''}</td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => openViewModal(p)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => downloadPdf(p.id)}
                      className="text-emerald-600 hover:text-emerald-800 font-bold text-xs"
                      title="Download PDF"
                    >
                      📄
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Prescription Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#0B2C56]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-[#0B2C56] text-lg">New Prescription</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
            </div>
            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-2">
                ⚠️ {formError}
              </div>
            )}
            <form onSubmit={submitPrescription} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Patient *</label>
                  <select name="patientId" value={formData.patientId} onChange={handleInputChange} className="w-full p-2 border rounded" required>
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Doctor *</label>
                  <select name="doctorId" value={formData.doctorId} onChange={handleInputChange} className="w-full p-2 border rounded" required>
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.user?.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Appointment (optional)</label>
                  <select name="appointmentId" value={formData.appointmentId} onChange={handleInputChange} className="w-full p-2 border rounded">
                    <option value="">-- None --</option>
                    {appointments.map(a => (
                      <option key={a.id} value={a.id}>{a.id} – {a.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Diagnosis *</label>
                  <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1">Advice</label>
                  <textarea name="advice" value={formData.advice} onChange={handleInputChange} rows={2} className="w-full p-2 border rounded"></textarea>
                </div>
              </div>

              {/* Medicines */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Medicines</span>
                  <button type="button" onClick={addMedicineRow} className="text-blue-600 hover:text-blue-800 text-xs font-bold">+ Add</button>
                </div>
                {formData.medicines.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 border rounded bg-gray-50">
                    <input type="text" placeholder="Medicine name" value={med.medicineName} onChange={e => handleMedicineChange(idx, 'medicineName', e.target.value)} className="p-1 border rounded" />
                    <input type="text" placeholder="Dosage" value={med.dosage} onChange={e => handleMedicineChange(idx, 'dosage', e.target.value)} className="p-1 border rounded" />
                    <input type="text" placeholder="Duration" value={med.duration} onChange={e => handleMedicineChange(idx, 'duration', e.target.value)} className="p-1 border rounded" />
                    <button type="button" onClick={() => removeMedicineRow(idx)} className="col-span-3 text-rose-600 hover:text-rose-800 text-xs font-bold mt-1">Remove</button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border text-gray-600 rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white rounded">Save Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      {viewModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-[#0B2C56]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-[#0B2C56] text-lg">Prescription #{selectedPrescription.id}</h3>
              <button onClick={() => setViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Patient:</strong> {selectedPrescription.patient?.fullName}</p>
              <p><strong>Doctor:</strong> {selectedPrescription.doctor?.user?.name}</p>
              <p><strong>Diagnosis:</strong> {selectedPrescription.diagnosis}</p>
              <p><strong>Advice:</strong> {selectedPrescription.advice}</p>
              <p><strong>Medicines:</strong></p>
              <ul className="list-disc list-inside">
                {selectedPrescription.medicines && selectedPrescription.medicines.map((m, i) => (
                  <li key={i}>{m.medicineName} – {m.dosage} – {m.duration}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => downloadPdf(selectedPrescription.id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs">Download PDF</button>
              <button onClick={() => setViewModalOpen(false)} className="px-4 py-2 border rounded text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
