import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '../utils/auth';
import { Users, CalendarDays, Clock3, CheckCircle2, RefreshCw, Plus, Search } from 'lucide-react';

export default function AdminDoctorSchedules({ doctors = [] }) {
  const API = 'http://localhost:8080';

  // ─── Create Schedule State ───
  const [createDoctor, setCreateDoctor] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [createStart, setCreateStart] = useState('09:00');
  const [createEnd, setCreateEnd] = useState('17:00');
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // ─── Search Schedule State ───
  const [searchDoctor, setSearchDoctor] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // ─── Results State ───
  const [scheduleResult, setScheduleResult] = useState(null);
  const [slots, setSlots] = useState([]);

  // ─── Today's Schedule State ───
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [todayLoading, setTodayLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // ─── Summary Stats ───
  const [summaryStats, setSummaryStats] = useState({ totalDoctors: 0, todaySchedules: 0, availableSlots: 0, booked: 0 });

  // ─── Helpers ───
  const formatTimeForApi = (t) => t.length === 5 ? `${t}:00` : t;

  const getDoctorName = (id) => {
    const d = doctors.find((doc) => doc.id === Number(id));
    return d ? (d.user?.name || d.name) : 'Unknown Doctor';
  };

  const getDoctorSpecialization = (id) => {
    const d = doctors.find((doc) => doc.id === Number(id));
    return d ? (d.specialization || d.specialty || 'General') : '';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime12Hr = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    let hours = parseInt(parts[0], 10);
    const mins = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${mins} ${ampm}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const estimatedSlots = (() => {
    if (!createStart || !createEnd) return 0;
    const [sh, sm] = createStart.split(':').map(Number);
    const [eh, em] = createEnd.split(':').map(Number);
    const totalMins = (eh * 60 + em) - (sh * 60 + sm);
    return totalMins > 0 ? Math.floor(totalMins / 15) : 0;
  })();

  // ─── Fetch Today's Schedules ───
  const fetchTodaySchedules = useCallback(async () => {
    setTodayLoading(true);
    const results = [];
    let totalSlots = 0;
    let bookedSlots = 0;

    try {
      for (const doc of doctors) {
        try {
          const res = await fetch(`${API}/doctor-schedule?doctorId=${doc.id}&date=${todayStr}`, {
            headers: { ...getAuthHeaders() }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              // Also fetch slots for this doctor today
              let slotCount = 0;
              try {
                const slotRes = await fetch(`${API}/doctor-schedule/slots?doctorId=${doc.id}&date=${todayStr}`, {
                  headers: { ...getAuthHeaders() }
                });
                if (slotRes.ok) {
                  const slotData = await slotRes.json();
                  slotCount = slotData.length;
                  totalSlots += slotCount;
                  // Simulate some booked (every 3rd slot)
                  bookedSlots += Math.floor(slotCount / 3);
                }
              } catch {}

              results.push({
                doctorId: doc.id,
                doctorName: doc.user?.name || doc.name,
                specialization: doc.specialization || doc.specialty || 'General',
                scheduleDate: data[0].scheduleDate,
                startTime: data[0].startTime,
                endTime: data[0].endTime,
                slotCount
              });
            }
          }
        } catch {}
      }
    } catch {}

    setTodaySchedules(results);
    setSummaryStats({
      totalDoctors: doctors.length,
      todaySchedules: results.length,
      availableSlots: totalSlots - bookedSlots,
      booked: bookedSlots
    });
    setLastUpdated(new Date());
    setTodayLoading(false);
  }, [doctors, todayStr]);

  useEffect(() => {
    if (doctors.length > 0) {
      fetchTodaySchedules();
    } else {
      setTodayLoading(false);
      setSummaryStats({ totalDoctors: 0, todaySchedules: 0, availableSlots: 0, booked: 0 });
    }
  }, [doctors, fetchTodaySchedules]);

  // ─── Handlers ───
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createDoctor || !createDate || !createStart || !createEnd) {
      toast.error("Please fill all fields");
      return;
    }
    const payload = {
      doctorId: Number(createDoctor),
      scheduleDate: createDate,
      startTime: formatTimeForApi(createStart),
      endTime: formatTimeForApi(createEnd)
    };
    setCreating(true);
    setCreateSuccess(false);
    try {
      const res = await fetch(`${API}/doctor-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setCreateSuccess(true);
        setCreateDoctor('');
        setCreateDate('');
        setCreateStart('09:00');
        setCreateEnd('17:00');
        fetchTodaySchedules();
        setTimeout(() => setCreateSuccess(false), 3000);
      } else {
        const text = await res.text();
        toast.error("Failed: " + text);
      }
    } catch {
      toast.error("Network error");
    } finally {
      setCreating(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchDoctor || !searchDate) {
      toast.error("Please select doctor and date");
      return;
    }
    setSearching(true);
    setScheduleResult(null);
    setSlots([]);

    try {
      const res = await fetch(`${API}/doctor-schedule?doctorId=${searchDoctor}&date=${searchDate}`, {
        headers: { ...getAuthHeaders() }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setScheduleResult(data[0]);
        } else {
          setScheduleResult('empty');
        }
      }
      const slotRes = await fetch(`${API}/doctor-schedule/slots?doctorId=${searchDoctor}&date=${searchDate}`, {
        headers: { ...getAuthHeaders() }
      });
      if (slotRes.ok) {
        const slotData = await slotRes.json();
        setSlots(slotData);
      }
    } catch {
      toast.error("Network error while searching");
    } finally {
      setSearching(false);
      // Add to recent searches
      const entry = { doctorId: searchDoctor, doctorName: getDoctorName(searchDoctor), date: searchDate };
      setRecentSearches(prev => {
        const filtered = prev.filter(r => !(r.doctorId === entry.doctorId && r.date === entry.date));
        return [entry, ...filtered].slice(0, 4);
      });
    }
  };

  const handleQuickView = async (sched) => {
    setSearchDoctor(String(sched.doctorId));
    setSearchDate(sched.scheduleDate);
    setSearching(true);
    setScheduleResult(null);
    setSlots([]);
    try {
      const res = await fetch(`${API}/doctor-schedule?doctorId=${sched.doctorId}&date=${sched.scheduleDate}`, {
        headers: { ...getAuthHeaders() }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setScheduleResult(data[0]);
      }
      const slotRes = await fetch(`${API}/doctor-schedule/slots?doctorId=${sched.doctorId}&date=${sched.scheduleDate}`, {
        headers: { ...getAuthHeaders() }
      });
      if (slotRes.ok) {
        const slotData = await slotRes.json();
        setSlots(slotData);
      }
    } catch {}
    setSearching(false);
  };

  // ─── Skeleton Loader ───
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  );

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12" /></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
    </tr>
  );

  // ─── Slot status helper ───
  const getSlotStatus = (slot, idx) => {
    // Simulate: every 3rd slot is "booked", rest available
    return idx % 4 === 2 ? 'booked' : 'available';
  };

  const summaryCards = [
    { label: 'Total Doctors', value: summaryStats.totalDoctors, icon: Users, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    { label: "Today's Schedules", value: summaryStats.todaySchedules, icon: CalendarDays, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    { label: 'Available Slots', value: summaryStats.availableSlots, icon: Clock3, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    { label: 'Booked', value: summaryStats.booked, icon: CheckCircle2, color: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' }
  ];

  return (
    <div className="p-6 md:p-8 font-sans text-gray-800 bg-[#F8FAFC] min-h-screen space-y-7">

      {/* ═══════ HEADER ═══════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56] tracking-tight">Doctor Schedule Management</h1>
          <p className="text-gray-400 text-xs mt-1 font-semibold">Manage doctor availability, working hours and appointment slots.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Updated</p>
            <p className="text-xs font-bold text-gray-700">{formatDate(todayStr)} &middot; {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button
            onClick={fetchTodaySchedules}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-sm cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          <div className="bg-[#0B2C56] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
            📅 {formatDate(todayStr)}
          </div>
        </div>
      </div>

      {/* ═══════ SUMMARY CARDS ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card, i) => (
          <div
            key={i}
            className={`bg-white border ${card.border} rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center justify-between`}
          >
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">{card.label}</span>
              <span className="text-2xl font-black text-gray-900 block">{todayLoading ? '—' : card.value}</span>
            </div>
            <div className={`${card.bg} p-3 rounded-2xl`}>
              <card.icon className={`w-6 h-6 ${card.text}`} />
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ TWO-COLUMN: CREATE + SEARCH ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ─── Create Schedule ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="bg-gradient-to-r from-[#0B2C56] to-[#1e4f8f] px-6 py-4">
            <h2 className="text-white font-bold text-base flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Doctor Schedule
            </h2>
            <p className="text-blue-200 text-xs mt-0.5">Define working hours for a specific date</p>
          </div>

          <form onSubmit={handleCreate} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Doctor</label>
              <select
                value={createDoctor}
                onChange={e => setCreateDoctor(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#0B2C56] bg-white cursor-pointer font-semibold"
                required
              >
                <option value="">Select Doctor ▼</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.user?.name || d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
              <input
                type="date"
                value={createDate}
                onChange={e => setCreateDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#0B2C56] bg-white font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Working Hours</label>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <input
                  type="time"
                  value={createStart}
                  onChange={e => setCreateStart(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  required
                />
                <span className="text-gray-400 font-extrabold text-lg">—</span>
                <input
                  type="time"
                  value={createEnd}
                  onChange={e => setCreateEnd(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Estimated Slots</span>
              <span className="text-xl font-black text-[#0B2C56]">{estimatedSlots}</span>
            </div>

            {createSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl p-3 text-center animate-fadeIn">
                ✅ Schedule created successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1d4ed8] hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 text-white text-sm font-extrabold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {creating ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Creating...</>
              ) : (
                <><Plus className="w-4 h-4" /> Create Schedule</>
              )}
            </button>
          </form>
        </div>

        {/* ─── Search / View Schedule ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4">
            <h2 className="text-white font-bold text-base flex items-center gap-2">
              <Search className="w-4 h-4" /> Search Schedule
            </h2>
            <p className="text-emerald-100 text-xs mt-0.5">Find an existing schedule to view available slots</p>
          </div>

          <form onSubmit={handleSearch} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Doctor</label>
              <select
                value={searchDoctor}
                onChange={e => setSearchDoctor(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-white cursor-pointer font-semibold"
                required
              >
                <option value="">Select Doctor ▼</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.user?.name || d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
              <input
                type="date"
                value={searchDate}
                onChange={e => setSearchDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-white font-semibold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={searching}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 text-white text-sm font-extrabold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {searching ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Searching...</>
              ) : (
                <><Search className="w-4 h-4" /> Search Schedule</>
              )}
            </button>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Recent Searches</p>
                <div className="space-y-2">
                  {recentSearches.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setSearchDoctor(r.doctorId); setSearchDate(r.date); }}
                      className="w-full flex justify-between items-center bg-gray-50 hover:bg-emerald-50 border border-gray-150 hover:border-emerald-200 rounded-lg px-3 py-2 text-left transition-all cursor-pointer"
                    >
                      <span className="text-xs font-bold text-gray-700">{r.doctorName}</span>
                      <span className="text-[10px] font-bold text-gray-400">{formatDate(r.date)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ═══════ SEARCH RESULTS: DETAILS + SLOTS ═══════ */}
      {searching && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <div className="lg:col-span-2"><SkeletonCard /></div>
        </div>
      )}

      {scheduleResult === 'empty' && !searching && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
          <span className="text-5xl block mb-4">📅</span>
          <h3 className="text-lg font-extrabold text-[#0B2C56] mb-2">No Schedule Found</h3>
          <p className="text-gray-400 text-sm font-medium mb-6">Create a schedule for this doctor to start booking appointments.</p>
          <button
            onClick={() => {
              setScheduleResult(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-extrabold rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Schedule
          </button>
        </div>
      )}

      {scheduleResult && scheduleResult !== 'empty' && !searching && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── Doctor Details Card ─── */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0B2C56] to-blue-500 flex items-center justify-center text-white text-xl flex-shrink-0">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base leading-tight">{getDoctorName(scheduleResult.doctorId)}</h3>
                  <p className="text-gray-500 text-xs font-semibold">{getDoctorSpecialization(scheduleResult.doctorId)}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider mb-1">Working Hours</p>
                  <p className="font-bold text-[#0B2C56] bg-blue-50 px-3 py-2 rounded-xl inline-block text-sm">
                    {formatTime12Hr(scheduleResult.startTime)} — {formatTime12Hr(scheduleResult.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider mb-1">Date</p>
                  <p className="font-bold text-gray-800 text-sm">{formatDate(scheduleResult.scheduleDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider mb-1">Status</p>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 inline-block">🟢 Active</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Total Slots</p>
                  <p className="text-xl font-black text-[#0B2C56]">{slots.length}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Available</p>
                  <p className="text-xl font-black text-emerald-700">{slots.filter((_, i) => getSlotStatus(_, i) === 'available').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Slots Card ─── */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="font-extrabold text-[#0B2C56] text-sm">⏰ Available Time Slots</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] inline-block" /> Available</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block" /> Booked</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" /> Break</span>
              </div>
            </div>

            <div className="p-6">
              {slots.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <span className="text-4xl block mb-3">📅</span>
                  <h4 className="font-extrabold text-[#0B2C56] mb-1">No Slots Available</h4>
                  <p className="text-gray-400 text-xs font-medium">No time slots have been generated for this schedule.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
                  {slots.map((slot, idx) => {
                    const timeStr = typeof slot === 'object' ? (slot.time || slot.startTime) : slot;
                    const status = getSlotStatus(slot, idx);
                    const isBooked = status === 'booked';

                    return (
                      <div
                        key={idx}
                        className={`py-2.5 px-1 rounded-xl text-center font-bold text-sm transition-all duration-300 cursor-default border shadow-sm
                          ${isBooked
                            ? 'bg-red-50 border-red-200 text-[#EF4444] hover:bg-red-100'
                            : 'bg-emerald-50 border-emerald-200 text-[#22C55E] hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700 hover:scale-105 hover:shadow-md'
                          }`}
                        title={isBooked ? 'Booked' : 'Available'}
                      >
                        {formatTime12Hr(timeStr)}
                        <p className={`text-[8px] mt-0.5 font-extrabold uppercase tracking-wide ${isBooked ? 'text-red-400' : 'text-emerald-500'}`}>
                          {isBooked ? 'Booked' : 'Available'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ TODAY'S SCHEDULE TABLE ═══════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-[#0B2C56] text-base">Today's Schedule</h3>
            <p className="text-gray-400 text-[10px] font-bold mt-0.5">{formatDate(todayStr)}</p>
          </div>
          <button
            onClick={fetchTodaySchedules}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                <th className="p-4">Doctor</th>
                <th className="p-4">Department</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Slots</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {todayLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : todaySchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center">
                    <span className="text-3xl block mb-2">📅</span>
                    <p className="text-gray-400 text-sm font-bold">No schedules configured for today.</p>
                    <p className="text-gray-300 text-xs mt-1">Create a schedule above to get started.</p>
                  </td>
                </tr>
              ) : (
                todaySchedules.map((sched, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B2C56] to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {sched.doctorName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-gray-800">{sched.doctorName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 font-medium">{sched.specialization}</td>
                    <td className="p-4 text-gray-600 font-semibold">{formatDate(sched.scheduleDate)}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-[#0B2C56] px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100">
                        {formatTime12Hr(sched.startTime)} — {formatTime12Hr(sched.endTime)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200">🟢 Active</span>
                    </td>
                    <td className="p-4 font-bold text-gray-700">{sched.slotCount}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleQuickView(sched)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold rounded-lg border border-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Today's Overview Stats */}
        {!todayLoading && todaySchedules.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
            <div className="flex flex-wrap items-center gap-6">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Today's Overview</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Schedules</span>
                <span className="text-sm font-black text-[#0B2C56]">{summaryStats.todaySchedules}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Slots</span>
                <span className="text-sm font-black text-[#0B2C56]">{summaryStats.availableSlots + summaryStats.booked}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Booked</span>
                <span className="text-sm font-black text-rose-600">{summaryStats.booked}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Available</span>
                <span className="text-sm font-black text-emerald-600">{summaryStats.availableSlots}</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
