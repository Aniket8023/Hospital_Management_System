import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAppt, setCurrentAppt] = useState({
    id: '',
    patientName: '',
    preferredDate: '',
    preferredTime: '',
    status: 'Pending',
    mobileNumber: '',
    aadharNumber: '',
    age: '',
    gender: '',
    address: '',
    problemDescription: ''
  });

  const API = 'http://localhost:8080';




  // Load appointments from backend
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API}/appointments`, { headers: { ...getAuthHeaders() } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAppointments(data);
    } catch (e) {
      console.error('Failed to fetch appointments', e);
    }
  };

  // Load patients for the selector dropdown
  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API}/patients`, { headers: { ...getAuthHeaders() } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPatients(data);
    } catch (e) {
      console.error('Failed to fetch patients', e);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentAppt({
      id: '',
      patientName: '',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '10:00',
      status: 'Pending',
      mobileNumber: '',
      aadharNumber: '',
      age: '',
      gender: '',
      address: '',
      problemDescription: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (appt) => {
    setEditMode(true);
    setCurrentAppt({
      ...appt,
      patientName: appt.patient?.fullName || '',
      preferredDate: appt.appointmentDate || '',
      preferredTime: appt.appointmentTime || '',
      status: appt.status || 'Pending',
      mobileNumber: appt.mobileNumber || '',
      aadharNumber: appt.aadharNumber || '',
      age: appt.age || '',
      gender: appt.gender || '',
      address: appt.address || '',
      problemDescription: appt.problemDescription || ''
    });
    setModalOpen(true);
  };

  const addAppointment = async (appt) => {
    const payload = {
      fullName: appt.patientName,
      mobileNumber: appt.mobileNumber,
      aadharNumber: appt.aadharNumber,
      age: Number(appt.age) || 0,
      gender: appt.gender || 'Male',
      address: appt.address,
      appointmentDate: appt.preferredDate,
      appointmentTime: appt.preferredTime,
      problemDescription: appt.problemDescription || ''
    };
    try {
      const res = await fetch(`${API}/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(payload)
        });
      if (res.ok) fetchAppointments();
    } catch (e) {
      console.error('Add appointment failed', e);
    }
  };

  const editAppointment = async (id, appt) => {
    const payload = {
      fullName: appt.patientName,
      mobileNumber: appt.mobileNumber,
      aadharNumber: appt.aadharNumber,
      age: Number(appt.age) || 0,
      gender: appt.gender || 'Male',
      address: appt.address,
      appointmentDate: appt.preferredDate,
      appointmentTime: appt.preferredTime,
      problemDescription: appt.problemDescription || ''
    };
    try {
      const res = await fetch(`${API}/appointments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(payload)
        });
      if (res.ok) fetchAppointments();
    } catch (e) {
      console.error('Edit appointment failed', e);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/appointments/${id}/status?status=${status}`, {
          method: 'PUT',
          headers: { ...getAuthHeaders() }
        });
      if (res.ok) fetchAppointments();
    } catch (e) {
      console.error('Status update failed', e);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(`${API}/appointments/${id}`, { method: 'DELETE', headers: { ...getAuthHeaders() } });
      if (res.ok) fetchAppointments();
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentAppt.patientName || !currentAppt.preferredDate || !currentAppt.preferredTime) return;
    if (editMode) {
      editAppointment(currentAppt.id, currentAppt);
    } else {
      addAppointment(currentAppt);
    }
    setModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56] tracking-tight">Appointments</h1>
          <p className="text-gray-400 text-xs mt-1">Manage and track hospital doctor booking appointments</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#0B2C56] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
        >
          <span>+ New Appointment</span>
        </button>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-700">{appt.id}</td>
                  <td className="p-4 font-extrabold text-[#0B2C56]">{appt.patient?.fullName}</td>
                  <td className="p-4 text-gray-600 font-bold">{appt.appointmentDate}</td>
                  <td className="p-4 text-gray-500 font-semibold">{appt.appointmentTime}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border inline-block ${getStatusBadge(appt.status)}`}> {appt.status} </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-3">
                      {appt.status === 'Pending' && (
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'Confirmed')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded transition shadow-xs cursor-pointer"
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(appt)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer font-bold flex items-center justify-center p-1 rounded hover:bg-blue-50 transition"
                        title="Edit Appointment"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteAppointment(appt.id)}
                        className="text-rose-600 hover:text-rose-800 cursor-pointer font-bold flex items-center justify-center p-1 rounded hover:bg-rose-50 transition"
                        title="Delete Appointment"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
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
        {appointments.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-xs">
            <span>📅</span>
            <p className="mt-1">No appointments scheduled.</p>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-[#0B2C56] border-b border-gray-100 pb-2">
              {editMode ? 'Edit Appointment Details' : 'Book New Appointment'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Patil"
                    value={currentAppt.patientName}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, patientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={currentAppt.mobileNumber}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Aadhar Number</label>
                  <input
                    type="text"
                    value={currentAppt.aadharNumber}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, aadharNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Age</label>
                  <input
                    type="number"
                    min="0"
                    value={currentAppt.age}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Gender</label>
                  <select
                    value={currentAppt.gender}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={currentAppt.preferredDate}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Preferred Time Slot</label>
                  <input
                    type="time"
                    required
                    value={currentAppt.preferredTime}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Status</label>
                  <select
                    value={currentAppt.status}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Address</label>
                  <input
                    type="text"
                    value={currentAppt.address}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Problem Description</label>
                  <textarea
                    rows="2"
                    value={currentAppt.problemDescription}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, problemDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2 bg-[#0B2C56] hover:bg-blue-800 text-white font-bold text-sm rounded-lg shadow transition cursor-pointer"
              >
                {editMode ? 'Save Changes' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
