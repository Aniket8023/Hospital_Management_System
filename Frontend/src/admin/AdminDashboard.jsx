import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';
export default function AdminDashboard({ appointments = [], doctors = [], setAdminTab }) {
  const API = 'http://localhost:8080';
  

  const [appointmentsData, setAppointmentsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, docsRes, patsRes, billsRes] = await Promise.all([
          fetch(`${API}/appointments`, { headers: { ...getAuthHeaders() } }),
          fetch(`${API}/doctor`, { headers: { ...getAuthHeaders() } }),
          fetch(`${API}/patients`, { headers: { ...getAuthHeaders() } }),
          fetch(`${API}/bills`, { headers: { ...getAuthHeaders() } })
        ]);
        
        if (!apptsRes.ok) throw new Error(`HTTP ${apptsRes.status}`);
        if (!docsRes.ok) throw new Error(`HTTP ${docsRes.status}`);
        if (!patsRes.ok) throw new Error(`HTTP ${patsRes.status}`);
        // don't fail if bills fails, just log it, but wait bills is needed
        if (!billsRes.ok) throw new Error(`HTTP ${billsRes.status}`);

        const [appts, docs, pats, bills] = await Promise.all([
          apptsRes.json(), 
          docsRes.json(), 
          patsRes.json(),
          billsRes.json()
        ]);
        
        setAppointmentsData(appts);
        setDoctorsData(docs);
        setPatientsData(pats);
        setBillsData(Array.isArray(bills) ? bills : []);
        setLoading(false);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
        setError(e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const totalPatientsCount = patientsData.length;
  const pendingCount = appointmentsData.filter(a => a.status === 'Pending').length;

  const todaysAppts = appointmentsData.filter(a => a.appointmentDate === todayStr);
  const todayApptsCount = todaysAppts.length;

  const todayRevenue = billsData
    .filter(b => b.billDate === todayStr)
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  // Use the first few today's items for display
  const todayAppointments = todaysAppts.slice(0, 5).map(appt => ({
    time: appt.appointmentTime || '',
    name: appt.fullName || '',
    mobile: appt.mobileNumber || '',
    status: appt.status || 'Pending'
  }));

  const sortedPatients = [...patientsData].sort((a, b) => (b.id || 0) - (a.id || 0));
  const recentPatients = sortedPatients.slice(0, 5).map(pat => ({
    name: pat.fullName || '',
    date: pat.createdAt ? new Date(pat.createdAt).toLocaleDateString() : '',
    initial: pat.fullName ? pat.fullName.split(' ').map(n => n[0]).join('') : ''
  }));

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      
      {/* Page Title */}
      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-extrabold text-[#0B2C56] tracking-tight">Dashboard</h1>
        <p className="text-gray-400 text-xs mt-1">Hospital metrics overview and operations dashboard</p>
      </div>

      {/* KPI Stats Row (Panel 3 top cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Today's Appointments */}
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider block">Today's Appointments</span>
            <span className="text-2xl font-black text-gray-900 block">{todayApptsCount}</span>
          </div>
          <span className="text-3xl bg-blue-50 p-3 rounded-2xl text-blue-600">📅</span>
        </div>

        {/* Total Patients */}
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider block">Total Patients</span>
            <span className="text-2xl font-black text-gray-900 block">{totalPatientsCount}</span>
          </div>
          <span className="text-3xl bg-emerald-50 p-3 rounded-2xl text-emerald-600">👥</span>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider block">Today's Revenue</span>
            <span className="text-2xl font-black text-gray-900 block">₹ {todayRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          <span className="text-3xl bg-purple-50 p-3 rounded-2xl text-purple-600">💸</span>
        </div>

        {/* Pending Appointments */}
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider block">Pending Appointments</span>
            <span className="text-2xl font-black text-gray-900 block">{pendingCount}</span>
          </div>
          <span className="text-3xl bg-orange-50 p-3 rounded-2xl text-orange-600">⏳</span>
        </div>

      </div>

      {/* Grid: Today's Appointments and Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Today's Appointments Table */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-extrabold text-[#0B2C56] text-base">
                Today's Appointments
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Patient Name</th>
                    <th className="pb-3">Mobile</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {todayAppointments.map((appt, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 font-semibold text-gray-500">{appt.time}</td>
                      <td className="py-3 font-extrabold text-[#0B2C56]">{appt.name}</td>
                      <td className="py-3 font-mono font-medium text-gray-600">{appt.mobile}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border inline-block ${
                          appt.status === 'Confirmed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-4 flex justify-center">
            <button
              onClick={() => setAdminTab('appointments')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>

        {/* Right: Recent Patients List */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-extrabold text-[#0B2C56] text-base">
                Recent Patients
              </h3>
            </div>

            <div className="space-y-4">
              {recentPatients.map((patient, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0B2C56] font-bold text-xs flex items-center justify-center">
                    {patient.initial}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-extrabold text-[#0B2C56] text-xs leading-none">{patient.name}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{patient.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-4 flex justify-center">
            <button
              onClick={() => setAdminTab('patients')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
