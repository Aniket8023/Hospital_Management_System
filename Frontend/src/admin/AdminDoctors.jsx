import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '../utils/auth';
import {
  Stethoscope, Mail, Phone, Building2, Calendar, Search,
  Plus, Edit, Trash2, UserCheck, ClipboardList, Star,
  ChevronDown, X, Users, CheckCircle, LayoutGrid, Clock,
  AlertCircle, BadgeCheck
} from 'lucide-react';

// ─── Department color palette ──────────────────────────────────────────────
const DEPT_COLORS = {
  'ENT': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'Cardiology': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  'Neurology': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  'Dental': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'Orthopedic': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Pediatrics': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500' },
  'Dermatology': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  'General': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
};
const getDeptColor = (dept) => DEPT_COLORS[dept] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' };

// ─── Avatar Gradient palette ────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
];
const getAvatarGradient = (id) => AVATAR_GRADIENTS[(id || 0) % AVATAR_GRADIENTS.length];

// ─── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800 leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'available') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available Today
    </span>
  );
  if (status === 'leave') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> On Leave
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Busy
    </span>
  );
}

// ─── Doctor Card ─────────────────────────────────────────────────────────────
function DoctorCard({ doc, onEdit, onSchedule, onDelete }) {
  const initials = doc.user?.name
    ? doc.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'DR';
  const gradient = getAvatarGradient(doc.id);
  const deptColor = getDeptColor(doc.qualification || 'General');
  const name = doc.user?.name ? `Dr. ${doc.user.name}` : 'Dr. Unknown';
  const specialization = doc.specialization || 'Specialist';
  const experience = doc.experience;
  const email = doc.user?.email || '—';
  const qualification = doc.qualification || 'General';
  // Use doc.timeSlots if present (legacy), else use empty array
  const timeSlots = doc.timeSlots || [];

  // Derive status pseudo-randomly from id for demo realism
  const statuses = ['available', 'available', 'available', 'leave', 'busy'];
  const status = statuses[(doc.id || 0) % statuses.length];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Top colored strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-6 space-y-5">
        {/* Avatar + Name + Status */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-extrabold text-lg shadow-lg`}>
              {initials}
            </div>
            {/* Verified badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <BadgeCheck className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base leading-tight truncate">{name}</h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{specialization}</p>
              </div>
              <StatusBadge status={status} />
            </div>

            {/* Star rating */}
            <div className="flex items-center gap-0.5 mt-1.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-b border-gray-100 py-4 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="font-semibold">{doc.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <span className="font-semibold truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${deptColor.bg} ${deptColor.text} ${deptColor.border}`}>
              {qualification} Dept.
            </span>
          </div>

        </div>

        {/* Time Slots */}
        {timeSlots.length > 0 && (
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Today's Schedule
            </p>
            <div className="flex flex-wrap gap-1.5">
              {timeSlots.map((slot, idx) => {
                const isMorning = slot.toLowerCase().includes('am') || slot.includes('09') || slot.includes('10') || slot.includes('11');
                return (
                  <span key={idx} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${isMorning ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                    {slot}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onEdit(doc)}
            className="flex-1 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-600 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-200 flex items-center justify-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => onSchedule(doc)}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" /> Schedule
          </button>
          <button
            onClick={() => onDelete(doc.id)}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer border border-rose-200 flex-shrink-0"
            title="Delete Doctor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminDoctors({ doctors, addDoctor, editDoctor, deleteDoctor, departments, setAdminTab }) {
  const API = 'http://localhost:8080';

  // ── Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleTab, setScheduleTab] = useState('create');
  const [editingDocId, setEditingDocId] = useState(null);
  const [formStep, setFormStep] = useState(1); // 1=Basic, 2=Professional, 3=Consultation

  // ── Schedule states
  const [scheduleData, setScheduleData] = useState({ doctorId: null, doctorName: '', scheduleDate: '', startTime: '', endTime: '' });
  const [scheduleList, setScheduleList] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // ── Search / Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // ── Form data
  const [formData, setFormData] = useState({
    name: '', role: '', specialty: '', email: '', phone: '',
    department: 'ENT', timeSlots: '09:00 AM - 11:00 AM, 04:00 PM - 06:00 PM',
    qualification: '', experience: ''
  });
  const [formError, setFormError] = useState('');

  // ── Derived: filtered doctors
  const filteredDoctors = doctors.filter(doc => {
    const name = (doc.user?.name || '').toLowerCase();
    const spec = (doc.specialization || '').toLowerCase();
    const dept = (doc.qualification || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    if (q && !name.includes(q) && !spec.includes(q) && !dept.includes(q)) return false;
    if (filterDept && (doc.qualification || '') !== filterDept) return false;
    return true;
  });

  // ── Stats
  const totalDoctors = doctors.length;
  const uniqueDepts = [...new Set(doctors.map(d => d.qualification).filter(Boolean))].length;
  const statuses = ['available', 'available', 'available', 'leave', 'busy'];
  const availableToday = doctors.filter(d => statuses[(d.id || 0) % statuses.length] === 'available').length;

  // ── Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setEditingDocId(null);
    setFormData({ name: '', role: '', specialty: '', email: '', phone: '', department: 'ENT', timeSlots: '09:00 AM - 11:00 AM, 04:00 PM - 06:00 PM', qualification: '', experience: '' });
    setFormError('');
    setFormStep(1);
    setIsFormOpen(true);
  };

  const openEditForm = (doc) => {
    setEditingDocId(doc.id);
    setFormData({
      name: doc.user?.name || doc.name || '',
      role: doc.role || '',
      specialty: doc.specialization || doc.specialty || '',
      email: doc.user?.email || doc.email || '',
      phone: doc.phone || '',
      department: doc.qualification || 'ENT',
      timeSlots: (doc.timeSlots || []).join(', '),
      qualification: doc.qualification || '',
      experience: doc.experience || ''
    });
    setFormError('');
    setFormStep(1);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.specialty || !formData.email) {
      setFormError('Please fill out all required fields.');
      return;
    }
    const slotsArray = formData.timeSlots.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const docPayload = {
      name: formData.name, role: formData.role, specialty: formData.specialty,
      email: formData.email, phone: formData.phone, department: formData.department,
      timeSlots: slotsArray.length > 0 ? slotsArray : ['09:00 AM - 11:00 AM'],
      qualification: formData.department, experience: Number(formData.experience) || 1
    };
    if (editingDocId) { editDoctor(editingDocId, docPayload); }
    else { addDoctor(docPayload); }
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor profile?')) { deleteDoctor(id); }
  };

  // ── Schedule handlers
  const openScheduleModal = (doc) => {
    setScheduleData({ doctorId: doc.id, doctorName: doc.user?.name || 'Doctor', scheduleDate: '', startTime: '', endTime: '' });
    setScheduleList([]); setAvailableSlots([]); setScheduleTab('create');
    setIsScheduleModalOpen(true);
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({ ...prev, [name]: value }));
  };

  const createSchedule = async () => {
    const { doctorId, scheduleDate, startTime, endTime } = scheduleData;
    try {
      const res = await fetch(`${API}/doctor-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ doctorId, scheduleDate, startTime, endTime })
      });
      if (res.ok) {
        await fetchSchedule(doctorId, scheduleDate);
        setScheduleTab('view');
      }
    } catch (e) { toast.error(String('Create schedule failed')); }
  };

  const fetchSchedule = async (doctorId, date) => {
    try {
      const res = await fetch(`${API}/doctor-schedule?doctorId=${doctorId}&date=${date}`, { headers: { ...getAuthHeaders() } });
      const data = await res.json();
      setScheduleList(data);
    } catch (e) { toast.error(String('Fetch schedule failed')); }
  };

  const generateSlots = async () => {
    const { doctorId, scheduleDate } = scheduleData;
    try {
      const res = await fetch(`${API}/doctor-schedule/slots?doctorId=${doctorId}&date=${scheduleDate}`, { headers: { ...getAuthHeaders() } });
      const data = await res.json();
      setAvailableSlots(data);
    } catch (e) { toast.error(String('Generate slots failed')); }
  };

  // ── Unique departments for filter dropdown
  const allDepts = [...new Set(doctors.map(d => d.qualification).filter(Boolean))];

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans text-gray-800 bg-gray-50/30 min-h-screen">

      {/* ═══ Page Header ═══════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">Doctor Management</h1>
          <p className="text-gray-400 text-xs mt-1 font-semibold">
            Manage specialists, consultation timings and schedules &nbsp;·&nbsp;
            Updated {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="px-5 py-2.5 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-xl shadow-md transition duration-200 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      {/* ═══ Stat Cards ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" label="Total Doctors" value={totalDoctors} />
        <StatCard icon={UserCheck} iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Available Today" value={availableToday} />
        <StatCard icon={LayoutGrid} iconBg="bg-purple-50" iconColor="text-purple-600" label="Departments" value={uniqueDepts} />
        <StatCard icon={ClipboardList} iconBg="bg-amber-50" iconColor="text-amber-600" label="Schedules" value="—" sub="View in Schedules tab" />
      </div>

      {/* ═══ Search / Filter Bar ════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctor, speciality..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0B2C56] bg-gray-50/50 transition"
          />
        </div>
        <div className="relative">
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:border-[#0B2C56] bg-white cursor-pointer appearance-none min-w-[140px]"
          >
            <option value="">All Departments</option>
            {allDepts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {(searchQuery || filterDept) && (
          <button
            onClick={() => { setSearchQuery(''); setFilterDept(''); }}
            className="px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
        <span className="ml-auto text-xs font-semibold text-gray-400">
          {filteredDoctors.length} specialist{filteredDoctors.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ═══ Doctor Cards Grid ══════════════════════════════════════════════ */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-extrabold text-gray-700 mb-1">No Doctors Found</h3>
          <p className="text-xs text-gray-400 font-semibold mb-6">Add your first specialist to get started.</p>
          <button
            onClick={openAddForm}
            className="px-5 py-2.5 bg-[#0B2C56] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredDoctors.map(doc => (
            <DoctorCard
              key={doc.id}
              doc={doc}
              onEdit={openEditForm}
              onSchedule={openScheduleModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ═══ Add / Edit Modal ════════════════════════════════════════════════ */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#0B2C56]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-0 w-full max-w-lg shadow-2xl overflow-hidden text-left animate-fadeIn">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0B2C56] to-[#154175] px-6 py-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-white text-lg">
                    {editingDocId ? 'Edit Doctor Profile' : 'Register New Specialist'}
                  </h3>
                  <p className="text-blue-200 text-xs mt-0.5 font-semibold">
                    Step {formStep} of 3 — {formStep === 1 ? 'Basic Details' : formStep === 2 ? 'Professional Details' : 'Consultation Timings'}
                  </p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="text-blue-200 hover:text-white font-extrabold cursor-pointer transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Step indicator */}
              <div className="flex gap-1.5 mt-4">
                {[1, 2, 3].map(s => (
                  <div key={s} onClick={() => setFormStep(s)} className={`h-1 flex-1 rounded-full cursor-pointer transition-all ${formStep >= s ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                </div>
              )}

              {/* Step 1: Basic Details */}
              {formStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Doctor Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Rajendra Shinde" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2C56] bg-white" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Designation / Role</label>
                      <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="e.g. Chief ENT Specialist" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2C56] bg-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="doctor@hospital.com" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2C56] bg-white" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Phone</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2C56] bg-white" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setFormStep(2)} className="px-5 py-2.5 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition">Next →</button>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {formStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Department *</label>
                      <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2C56] bg-white cursor-pointer">
                        {(departments || ['ENT', 'Cardiology', 'Neurology', 'Dental', 'General']).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Speciality *</label>
                      <input type="text" name="specialty" value={formData.specialty} onChange={handleInputChange} placeholder="e.g. Ear Care, Tinnitus" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2C56] bg-white" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Qualification</label>
                      <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="e.g. MBBS, MS" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2C56] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Experience (Years)</label>
                      <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g. 10" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2C56] bg-white" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setFormStep(1)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl cursor-pointer hover:bg-gray-50 transition">← Back</button>
                    <button type="button" onClick={() => setFormStep(3)} className="px-5 py-2.5 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition">Next →</button>
                  </div>
                </div>
              )}

              {/* Step 3: Consultation Timings */}
              {formStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Consultation Slots (comma-separated)</label>
                    <input type="text" name="timeSlots" value={formData.timeSlots} onChange={handleInputChange} placeholder="e.g. 09:00 AM - 11:00 AM, 04:00 PM - 06:00 PM" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B2C56] bg-white" />
                    <p className="text-[10px] text-gray-400 mt-1 font-semibold">Separate multiple slots with commas</p>
                  </div>
                  {/* Slot preview */}
                  {formData.timeSlots && (
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-2">Preview</p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.timeSlots.split(',').map((s, i) => s.trim() && (
                          <span key={i} className="px-2.5 py-1 bg-white border border-blue-200 text-blue-700 text-[10px] font-bold rounded-lg">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <button type="button" onClick={() => setFormStep(2)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl cursor-pointer hover:bg-gray-50 transition">← Back</button>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl cursor-pointer hover:bg-gray-50 transition">Cancel</button>
                      <button type="submit" className="px-6 py-2.5 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition">
                        {editingDocId ? '✓ Save Profile' : '+ Add Specialist'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ═══ Schedule Modal ═══════════════════════════════════════════════════ */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-[#0B2C56]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] text-left overflow-hidden animate-fadeIn">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0B2C56] to-[#154175] px-6 py-5 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-white text-lg">Manage Schedule</h3>
                  <p className="text-blue-200 text-xs mt-0.5 font-semibold">Dr. {scheduleData.doctorName}</p>
                </div>
                <button onClick={() => setIsScheduleModalOpen(false)} className="text-blue-200 hover:text-white cursor-pointer transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Tabs inside header */}
              <div className="flex gap-1.5 mt-4 bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setScheduleTab('create')}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${scheduleTab === 'create' ? 'bg-white text-[#0B2C56]' : 'text-white/70 hover:text-white'}`}
                >
                  Create Schedule
                </button>
                <button
                  onClick={() => setScheduleTab('view')}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${scheduleTab === 'view' ? 'bg-white text-[#0B2C56]' : 'text-white/70 hover:text-white'}`}
                >
                  View Schedules
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Create tab */}
              {scheduleTab === 'create' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-blue-900 mb-1.5 uppercase tracking-wide">Schedule Date</label>
                      <input type="date" name="scheduleDate" value={scheduleData.scheduleDate} onChange={handleScheduleChange} className="w-full p-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-800 font-semibold text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-blue-900 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">Morning</span> Start
                        </label>
                        <input type="time" name="startTime" value={scheduleData.startTime} onChange={handleScheduleChange} className="w-full p-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-800 font-semibold text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-blue-900 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-bold">Evening</span> End
                        </label>
                        <input type="time" name="endTime" value={scheduleData.endTime} onChange={handleScheduleChange} className="w-full p-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-800 font-semibold text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Preview strip */}
                  {scheduleData.scheduleDate && scheduleData.startTime && scheduleData.endTime && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Preview</p>
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                        <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">{scheduleData.startTime}</span>
                        <span className="text-gray-400">→</span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">{scheduleData.endTime}</span>
                        <span className="text-gray-400 font-normal">on</span>
                        <span className="font-semibold text-gray-600">{scheduleData.scheduleDate ? new Date(scheduleData.scheduleDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : ''}</span>
                      </div>
                    </div>
                  )}

                  <button onClick={createSchedule} className="w-full py-3 bg-[#0B2C56] hover:bg-[#154175] text-white font-extrabold rounded-xl shadow-xs transition duration-200 cursor-pointer text-sm flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Save Schedule
                  </button>
                </div>
              )}

              {/* View tab */}
              {scheduleTab === 'view' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-wider">Select Date</label>
                      <input type="date" name="scheduleDate" value={scheduleData.scheduleDate} onChange={(e) => {
                        handleScheduleChange(e);
                        if (e.target.value) fetchSchedule(scheduleData.doctorId, e.target.value);
                      }} className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white text-sm font-semibold" />
                    </div>
                    <button onClick={() => fetchSchedule(scheduleData.doctorId, scheduleData.scheduleDate)} className="w-full sm:w-auto px-4 py-2.5 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-extrabold rounded-xl transition cursor-pointer">
                      Fetch
                    </button>
                  </div>

                  {scheduleList.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-[#0B2C56] text-sm">Configured Shifts</h4>
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">{scheduleList.length} Found</span>
                      </div>

                      {/* Timeline view of shifts */}
                      <div className="space-y-2">
                        {scheduleList.map((s, idx) => (
                          <div key={idx} className="flex gap-4 items-start relative">
                            {idx < scheduleList.length - 1 && (
                              <div className="absolute left-[15px] top-[30px] bottom-0 w-[2px] bg-blue-100 z-0" />
                            )}
                            <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 z-10 flex-shrink-0">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 bg-white border border-gray-150 rounded-xl p-3 shadow-xs">
                              <p className="text-[10px] font-extrabold text-gray-400 uppercase">{s.scheduleDate}</p>
                              <p className="text-sm font-bold text-gray-800 mt-0.5">
                                <span className="text-amber-600">{s.startTime}</span>
                                <span className="text-gray-400 mx-2">→</span>
                                <span className="text-indigo-600">{s.endTime}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button onClick={generateSlots} className="w-full py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold rounded-xl transition cursor-pointer">
                        ⚡ Generate 15-Min Slots
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                      <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 text-xs font-bold">No schedules found for this date.</p>
                    </div>
                  )}

                  {availableSlots.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-extrabold text-[#0B2C56] text-sm">Generated Patient Slots</h4>
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">{availableSlots.length} Slots</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map((slot, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 text-gray-700 px-2 py-2 rounded-xl text-[11px] font-bold shadow-xs text-center hover:border-blue-300 hover:text-blue-600 transition cursor-default">
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
