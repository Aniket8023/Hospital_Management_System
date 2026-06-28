import React, { useState, useEffect, useRef } from 'react';
import { getAuthHeaders } from '../utils/auth';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ChevronRight, 
  Search, 
  RotateCcw, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  CalendarDays, 
  Activity, 
  ShieldAlert, 
  BookOpen,
  MapPin,
  ClipboardList
} from 'lucide-react';

export default function AdminAppointments() {
  const API = 'http://localhost:8080';

  // Core data states
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // UI state variables
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'calendar'
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // View details drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerApptId, setDrawerApptId] = useState(null);
  const [drawerData, setDrawerData] = useState(null);
  const [loadingDrawer, setLoadingDrawer] = useState(false);

  // Filter States
  const [searchName, setSearchName] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State
  const [currentAppt, setCurrentAppt] = useState({
    id: '',
    patientId: '',
    patientName: '',
    doctorId: '',
    preferredDate: '',
    preferredTime: '',
    status: 'PENDING',
    mobileNumber: '',
    aadharNumber: '',
    age: '',
    gender: '',
    address: '',
    problemDescription: ''
  });

  // Load appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/appointments`, { headers: getAuthHeaders() });
      if (res.ok) {
        setAppointments(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch appointments', e);
    } finally {
      setLoading(false);
    }
  };

  // Load patients
  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API}/patients`, { headers: getAuthHeaders() });
      if (res.ok) setPatients(await res.json());
    } catch (e) {
      console.error('Failed to load patients', e);
    }
  };

  // Load doctors
  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API}/doctor`, { headers: getAuthHeaders() });
      if (res.ok) setDoctors(await res.json());
    } catch (e) {
      console.error('Failed to load doctors', e);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  // Filter handlers using backend endpoints
  const handleTodayFilter = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/appointments/today`, { headers: getAuthHeaders() });
      if (res.ok) {
        setAppointments(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch today\'s appointments', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePendingFilter = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/appointments/status?status=PENDING`, { headers: getAuthHeaders() });
      if (res.ok) {
        setAppointments(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch pending appointments', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFilter = async () => {
    setLoading(true);
    try {
      let data = [];
      if (filterDoctor) {
        const res = await fetch(`${API}/doctor/${filterDoctor}/appointments`, { headers: getAuthHeaders() });
        if (res.ok) data = await res.json();
      } else if (filterStatus) {
        const res = await fetch(`${API}/appointments/status?status=${filterStatus.toUpperCase()}`, { headers: getAuthHeaders() });
        if (res.ok) data = await res.json();
      } else if (filterDate) {
        const res = await fetch(`${API}/appointments/date?date=${filterDate}`, { headers: getAuthHeaders() });
        if (res.ok) data = await res.json();
      } else {
        const res = await fetch(`${API}/appointments`, { headers: getAuthHeaders() });
        if (res.ok) data = await res.json();
      }

      // Filter locally by patient name if provided
      if (searchName) {
        data = data.filter(appt => 
          (appt.patient?.fullName || appt.fullName || '').toLowerCase().includes(searchName.toLowerCase())
        );
      }
      setAppointments(data);
    } catch (e) {
      console.error('Filtering failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchName('');
    setFilterDoctor('');
    setFilterStatus('');
    setFilterDate('');
    fetchAppointments();
  };

  // Status updates in backend
  const updateAppointmentStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/appointments/${id}/status?status=${status.toUpperCase()}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchAppointments();
        if (drawerOpen && drawerApptId === id) {
          loadDrawerDetails(id);
        }
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  // Fetch individual appointment by id for side drawer
  const loadDrawerDetails = async (id) => {
    setLoadingDrawer(true);
    try {
      const res = await fetch(`${API}/appointments/${id}`, { headers: getAuthHeaders() });
      if (res.ok) {
        setDrawerData(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch appointment detail', e);
    } finally {
      setLoadingDrawer(false);
    }
  };

  const handleOpenDrawer = (id) => {
    setDrawerApptId(id);
    setDrawerOpen(true);
    loadDrawerDetails(id);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await fetch(`${API}/appointments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchAppointments();
        if (drawerOpen && drawerApptId === id) setDrawerOpen(false);
      }
    } catch (e) {
      console.error('Failed to delete appointment', e);
    }
  };

  // Modal open helpers
  const openAddModal = () => {
    setEditMode(false);
    setFormError('');
    setCurrentAppt({
      id: '',
      patientId: '',
      patientName: '',
      doctorId: '',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '10:00',
      status: 'PENDING',
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
    setFormError('');
    setCurrentAppt({
      id: appt.id,
      patientId: appt.patient?.id || '',
      patientName: appt.patient?.fullName || appt.fullName || '',
      doctorId: appt.doctor?.id || '',
      preferredDate: appt.appointmentDate || '',
      preferredTime: appt.appointmentTime || '',
      status: appt.status || 'PENDING',
      mobileNumber: appt.patient?.mobile || appt.mobileNumber || '',
      aadharNumber: appt.patient?.aadhar || appt.aadharNumber || '',
      age: appt.patient?.age || appt.age || '',
      gender: appt.patient?.gender || appt.gender || 'Male',
      address: appt.patient?.address || appt.address || '',
      problemDescription: appt.problemDescription || ''
    });
    setModalOpen(true);
  };

  // Save changes/book new appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAppt.patientName || !currentAppt.preferredDate || !currentAppt.preferredTime || !currentAppt.doctorId) {
      setFormError('Patient Name, Doctor, Date, and Time are required.');
      return;
    }

    const payload = {
      doctorId: Number(currentAppt.doctorId),
      fullName: currentAppt.patientName,
      mobileNumber: currentAppt.mobileNumber,
      aadharNumber: currentAppt.aadharNumber,
      age: Number(currentAppt.age) || 0,
      gender: currentAppt.gender || 'Male',
      address: currentAppt.address,
      appointmentDate: currentAppt.preferredDate,
      appointmentTime: currentAppt.preferredTime,
      problemDescription: currentAppt.problemDescription || ''
    };

    try {
      const url = editMode ? `${API}/appointments/${currentAppt.id}` : `${API}/appointments`;
      const method = editMode ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchAppointments();
        setModalOpen(false);
      } else {
        const errText = await res.text();
        setFormError(errText || 'An error occurred while saving.');
      }
    } catch (e) {
      console.error(e);
      setFormError('Network error');
    }
  };

  // Calculate statistics
  const totalCount = appointments.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter(a => a.appointmentDate === todayStr).length;
  const pendingCount = appointments.filter(a => String(a.status).toUpperCase() === 'PENDING').length;
  const confirmedCount = appointments.filter(a => {
    const s = String(a.status).toUpperCase();
    return s === 'CONFIRMED' || s === 'APPROVED';
  }).length;

  const getStatusBadge = (status) => {
    const s = String(status).toUpperCase();
    if (s === 'CONFIRMED' || s === 'APPROVED') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'PENDING') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s === 'COMPLETED') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s === 'CANCELLED') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Calendar View filters appointments for selected calendar date
  const calendarAppointments = appointments.filter(a => a.appointmentDate === calendarDate);

  // Ref for closing the dropdown
  const dropdownRef = useRef(null);

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-150 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56] tracking-tight">Appointments Dashboard</h1>
          <p className="text-gray-400 text-xs mt-1 font-semibold">Manage doctor appointments and bookings.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-50 text-[#0B2C56] px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-1.5">
            📅 {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <button
            onClick={fetchAppointments}
            className="p-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-lg shadow-xs transition cursor-pointer"
            title="Refresh List"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Statistics Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#0B2C56] rounded-xl"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Appointments</p>
            <h3 className="text-2xl font-extrabold text-[#0B2C56] mt-0.5">{totalCount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CalendarDays className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Today's</p>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-0.5">{todayCount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><ShieldAlert className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-extrabold text-amber-700 mt-0.5">{pendingCount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Confirmed</p>
            <h3 className="text-2xl font-extrabold text-indigo-700 mt-0.5">{confirmedCount}</h3>
          </div>
        </div>
      </div>

      {/* ─── Quick Actions Panel ─── */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-150 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
          <button
            onClick={handleTodayFilter}
            className="px-3.5 py-2 border border-orange-200 bg-orange-50/50 hover:bg-orange-100 hover:text-orange-800 text-orange-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            🔥 Today's Appointments
          </button>
          <button
            onClick={handlePendingFilter}
            className="px-3.5 py-2 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            ⚠️ Pending
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'list' ? 'bg-white text-[#0B2C56] shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            📋 List View
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'calendar' ? 'bg-white text-[#0B2C56] shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            📅 Calendar View
          </button>
        </div>
      </div>

      {/* ─── Tabs Content Area ─── */}
      {activeTab === 'list' ? (
        <div className="space-y-6">
          {/* Filters Grid */}
          <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-xs space-y-4">
            <h4 className="text-xs font-extrabold text-[#0B2C56] uppercase tracking-wider border-b pb-2">🔍 Advanced Filters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Search Patient</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul"
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#0B2C56] font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Doctor</label>
                <select
                  value={filterDoctor}
                  onChange={e => setFilterDoctor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#0B2C56] bg-white font-semibold"
                >
                  <option value="">All Doctors</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.user?.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#0B2C56] bg-white font-semibold"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#0B2C56] font-semibold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                onClick={handleSearchFilter}
                className="px-5 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white rounded-lg text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" /> Search
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                    <th className="p-4">Patient</th>
                    <th className="p-4">Doctor</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Time</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-xs text-gray-400 font-semibold">
                        <span className="animate-spin inline-block mr-2">⏳</span> Loading appointments...
                      </td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-xs text-gray-400 font-semibold">
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-extrabold text-[#0B2C56]">
                          {appt.patient?.fullName || appt.fullName || '—'}
                          <span className="block text-[10px] font-semibold text-gray-400 mt-0.5">ID: #{appt.id}</span>
                        </td>
                        <td className="p-4 font-bold text-gray-700 flex items-center gap-1.5 mt-1.5">
                          <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                            {(appt.doctor?.user?.name || 'Dr').substring(0, 2).toUpperCase()}
                          </span>
                          <span>Dr. {appt.doctor?.user?.name || 'N/A'}</span>
                        </td>
                        <td className="p-4 text-gray-500 font-mono font-medium">{appt.patient?.mobile || appt.mobileNumber || '—'}</td>
                        <td className="p-4 text-gray-600 font-bold">
                          {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
                        </td>
                        <td className="p-4 text-gray-500 font-semibold">{appt.appointmentTime || '—'}</td>
                        <td className="p-4 text-center">
                          <select
                            value={appt.status?.toUpperCase() || 'PENDING'}
                            onChange={(e) => updateAppointmentStatus(appt.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border focus:outline-none cursor-pointer ${getStatusBadge(appt.status)}`}
                          >
                            <option value="PENDING" className="bg-white text-gray-800">Pending</option>
                            <option value="CONFIRMED" className="bg-white text-gray-800">Confirmed</option>
                            <option value="COMPLETED" className="bg-white text-gray-800">Completed</option>
                            <option value="CANCELLED" className="bg-white text-gray-800">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => handleOpenDrawer(appt.id)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(appt)}
                              className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition"
                              title="Edit Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(appt.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              title="Delete Appointment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Calendar / Schedule Timeline View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-extrabold text-[#0B2C56] text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" /> Select Schedule Date
            </h3>
            <input
              type="date"
              value={calendarDate}
              onChange={e => setCalendarDate(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#0B2C56] bg-gray-50"
            />
            <div className="pt-2 border-t text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
              {calendarAppointments.length} appointment(s) scheduled
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {calendarAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-150 p-16 text-center text-gray-400 shadow-xs">
                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-2.5" />
                <p className="text-sm font-bold text-gray-500">No appointments scheduled for {new Date(calendarDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <button
                  onClick={openAddModal}
                  className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition"
                >
                  Book One Now
                </button>
              </div>
            ) : (
              <div className="relative border-l border-gray-200 pl-6 ml-4 space-y-4">
                {calendarAppointments.sort((a,b) => String(a.appointmentTime).localeCompare(String(b.appointmentTime))).map(appt => (
                  <div key={appt.id} className="relative bg-white p-5 rounded-2xl border border-gray-150 shadow-sm hover:shadow transition duration-200">
                    <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-blue-500 border-4 border-white shadow-xs"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {appt.appointmentTime || 'N/A'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border inline-block ${getStatusBadge(appt.status)}`}>
                            {appt.status}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-[#0B2C56] text-base">{appt.patient?.fullName || appt.fullName}</h4>
                        <p className="text-xs text-gray-500 font-semibold mt-0.5">Doctor: Dr. {appt.doctor?.user?.name || 'N/A'}</p>
                      </div>
                      <button
                        onClick={() => handleOpenDrawer(appt.id)}
                        className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── View Details Side Drawer ─── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-[#0B2C56]/40 backdrop-blur-xs transition-opacity"
          ></div>
          
          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
            
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-[#0B2C56] to-[#154175] text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold">Appointment Details</h3>
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">ID: #{drawerApptId}</p>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
              {loadingDrawer || !drawerData ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  <span className="text-2xl animate-spin inline-block">⏳</span>
                  <p className="mt-2 font-semibold">Loading details...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Status Indicator */}
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-150">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Status</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border inline-block ${getStatusBadge(drawerData.status)}`}>
                      {drawerData.status}
                    </span>
                  </div>

                  {/* Patient Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-[#0B2C56] uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600" /> Patient Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400 font-bold">Full Name</span>
                        <span className="font-extrabold text-[#0B2C56]">{drawerData.patient?.fullName || drawerData.fullName || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400 font-bold">Age / Gender</span>
                        <span className="font-semibold text-gray-700">
                          {drawerData.patient?.age || drawerData.age || '—'} Yrs / {drawerData.patient?.gender || drawerData.gender || '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400 font-bold">Mobile</span>
                        <span className="font-semibold text-gray-700 font-mono">{drawerData.patient?.mobile || drawerData.mobileNumber || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400 font-bold">Aadhar</span>
                        <span className="font-semibold text-gray-700 font-mono">{drawerData.patient?.aadhar || drawerData.aadharNumber || '—'}</span>
                      </div>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-xs text-gray-400 font-bold">Address</span>
                        <p className="text-xs font-semibold text-gray-650 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          {drawerData.patient?.address || drawerData.address || '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-[#0B2C56] uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" /> Assigned Doctor & Slot
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400 font-bold">Doctor</span>
                        <span className="font-bold text-gray-800">Dr. {drawerData.doctor?.user?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400 font-bold">Specialization</span>
                        <span className="font-semibold text-gray-700">{drawerData.doctor?.specialization || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400 font-bold">Date</span>
                        <span className="font-bold text-blue-600">
                          {drawerData.appointmentDate ? new Date(drawerData.appointmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400 font-bold">Time Slot</span>
                        <span className="font-bold text-gray-700 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" /> {drawerData.appointmentTime || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-[#0B2C56] uppercase tracking-wider border-b pb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Problem Description
                    </h4>
                    <p className="text-xs font-semibold text-gray-650 bg-gray-50 border p-3.5 rounded-xl leading-relaxed">
                      {drawerData.problemDescription || 'No problem description provided.'}
                    </p>
                  </div>

                  {/* Quick Access Sidebar Buttons */}
                  <div className="pt-4 border-t space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Reports & Profile Links</h4>
                    <button 
                      onClick={() => { setDrawerOpen(false); window.location.hash = '/admin/prescriptions'; }}
                      className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex justify-between items-center transition"
                    >
                      <span>💊 Prescriptions</span>
                      <span className="text-[#0B2C56] text-[10px] font-extrabold">View →</span>
                    </button>
                    <button 
                      onClick={() => { setDrawerOpen(false); window.location.hash = '/admin/reports'; }}
                      className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex justify-between items-center transition"
                    >
                      <span>📋 Medical Reports</span>
                      <span className="text-[#0B2C56] text-[10px] font-extrabold">View →</span>
                    </button>
                    <button 
                      onClick={() => { setDrawerOpen(false); window.location.hash = '/admin/patients'; }}
                      className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex justify-between items-center transition"
                    >
                      <span>📜 Patient History & Profile</span>
                      <span className="text-[#0B2C56] text-[10px] font-extrabold">View →</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2.5">
              <button 
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── Create/Edit Appointment Modal ─── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#0B2C56]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl relative text-left max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-[#0B2C56] text-lg">
                {editMode ? 'Edit Appointment Details' : 'Book New Appointment'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 mb-2">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Patil"
                    value={currentAppt.patientName}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, patientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Assign Doctor *</label>
                  <select
                    value={currentAppt.doctorId}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, doctorId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium bg-white"
                    required
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>Dr. {d.user?.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={currentAppt.mobileNumber}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Aadhar Number</label>
                  <input
                    type="text"
                    placeholder="12-digit number"
                    value={currentAppt.aadharNumber}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, aadharNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Age</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Yrs"
                    value={currentAppt.age}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Gender</label>
                  <select
                    value={currentAppt.gender}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={currentAppt.preferredDate}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Preferred Time Slot *</label>
                  <input
                    type="time"
                    required
                    value={currentAppt.preferredTime}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Address</label>
                  <input
                    type="text"
                    placeholder="Full Address"
                    value={currentAppt.address}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Problem Description</label>
                  <textarea
                    rows="2"
                    placeholder="Short description of patient symptoms..."
                    value={currentAppt.problemDescription}
                    onChange={(e) => setCurrentAppt({ ...currentAppt, problemDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-250 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  {editMode ? 'Save Changes' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
