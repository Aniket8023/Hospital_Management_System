import React, { useState } from 'react';
import { getAuthHeaders } from '../utils/auth';

export default function AdminDoctorSchedules({ doctors = [] }) {
  const API = 'http://localhost:8080';

  // Create Schedule State
  const [createDoctor, setCreateDoctor] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [createStart, setCreateStart] = useState('09:00');
  const [createEnd, setCreateEnd] = useState('17:00');
  const [creating, setCreating] = useState(false);

  // Search Schedule State
  const [searchDoctor, setSearchDoctor] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searching, setSearching] = useState(false);

  // Results State
  const [scheduleResult, setScheduleResult] = useState(null);
  const [slots, setSlots] = useState([]);

  // Helpers
  const formatTimeForApi = (t) => t.length === 5 ? `${t}:00` : t;

  const getDoctorName = (id) => {
    const d = doctors.find((doc) => doc.id === Number(id));
    return d ? (d.user?.name || d.name) : 'Unknown Doctor';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  };

  const formatTime12Hr = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  // Handlers
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createDoctor || !createDate || !createStart || !createEnd) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      doctorId: Number(createDoctor),
      scheduleDate: createDate,
      startTime: formatTimeForApi(createStart),
      endTime: formatTimeForApi(createEnd)
    };

    setCreating(true);
    try {
      const res = await fetch(`${API}/doctor-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Schedule created successfully!");
        setCreateDoctor('');
        setCreateDate('');
        setCreateStart('09:00');
        setCreateEnd('17:00');
      } else {
        const text = await res.text();
        alert("Failed to create schedule: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setCreating(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchDoctor || !searchDate) {
      alert("Please select doctor and date");
      return;
    }

    setSearching(true);
    setScheduleResult(null);
    setSlots([]);

    try {
      // 1. Fetch Schedule Details
      const res = await fetch(`${API}/doctor-schedule?doctorId=${searchDoctor}&date=${searchDate}`, {
        headers: { ...getAuthHeaders() }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setScheduleResult(data[0]); 
        } else {
          alert("No schedule found for this doctor on selected date.");
        }
      }

      // 2. Fetch Slots
      const slotRes = await fetch(`${API}/doctor-schedule/slots?doctorId=${searchDoctor}&date=${searchDate}`, {
        headers: { ...getAuthHeaders() }
      });
      if (slotRes.ok) {
        const slotData = await slotRes.json();
        setSlots(slotData);
      }
    } catch (err) {
      console.error(err);
      alert("Network error while searching");
    } finally {
      setSearching(false);
    }
  };

  // UI Styles
  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] bg-white";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="p-6 md:p-8 font-sans text-gray-800 bg-gray-50/30 min-h-screen space-y-8">
      
      {/* ─── Page Header ─── */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">DOCTOR SCHEDULE MANAGEMENT</h1>
          <p className="text-gray-400 text-xs mt-1 font-semibold">Create and view availability slots for doctors</p>
        </div>
      </div>

      {/* ─── Create Schedule Form ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B2C56] to-[#154175] px-6 py-4">
          <h2 className="text-white font-bold text-base">📅 Create Doctor Schedule</h2>
          <p className="text-blue-200 text-xs mt-0.5">Define working hours for a specific date</p>
        </div>

        <form onSubmit={handleCreate} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Doctor</label>
              <select
                value={createDoctor}
                onChange={e => setCreateDoctor(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select Doctor ▼</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.user?.name || d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={createDate}
                onChange={e => setCreateDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Start Time</label>
              <input
                type="time"
                value={createStart}
                onChange={e => setCreateStart(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>End Time</label>
              <input
                type="time"
                value={createEnd}
                onChange={e => setCreateEnd(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-[#0B2C56] hover:bg-[#154175] disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow transition flex items-center gap-2"
            >
              {creating ? '⏳ Creating...' : '➕ Create Schedule'}
            </button>
          </div>
        </form>
      </div>

      {/* ─── Search Schedule Form ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4">
          <h2 className="text-white font-bold text-base">🔍 View Doctor Schedule</h2>
          <p className="text-emerald-100 text-xs mt-0.5">Search for an existing schedule to view available slots</p>
        </div>

        <form onSubmit={handleSearch} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Doctor</label>
              <select
                value={searchDoctor}
                onChange={e => setSearchDoctor(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select Doctor ▼</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.user?.name || d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={searchDate}
                onChange={e => setSearchDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={searching}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow transition flex items-center justify-center gap-2"
              >
                {searching ? '⏳ Searching...' : '🔍 Search'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ─── Schedule Details & Slots ─── */}
      {scheduleResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Schedule Details Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
              <h3 className="font-extrabold text-[#0B2C56] text-sm">📋 Schedule Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Doctor</p>
                <p className="font-extrabold text-gray-800 text-base">{getDoctorName(scheduleResult.doctorId)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date</p>
                <p className="font-bold text-gray-700">{formatDate(scheduleResult.scheduleDate)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Time</p>
                <p className="font-bold text-[#0B2C56] bg-blue-50 px-3 py-1.5 rounded-lg inline-block mt-1">
                  {formatTime12Hr(scheduleResult.startTime)} - {formatTime12Hr(scheduleResult.endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Available Slots Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-[#0B2C56] text-sm">⏰ Available Time Slots</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                {slots.length} slots found
              </span>
            </div>
            
            <div className="p-6">
              {slots.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-3xl block mb-2">📭</span>
                  <p className="text-sm font-semibold">No slots available for this schedule.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {slots.map((slot, idx) => {
                    // Extracting the time string just in case it's an object or simple string
                    const timeStr = typeof slot === 'object' ? slot.time : slot;
                    return (
                      <div
                        key={idx}
                        className="bg-emerald-50 border border-emerald-200 text-emerald-700 py-2.5 px-2 rounded-xl text-center font-extrabold text-sm shadow-sm hover:shadow-md hover:bg-emerald-100 transition cursor-default"
                      >
                        {formatTime12Hr(timeStr)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
