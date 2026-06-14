import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ appointments, doctors, setAdminTab }) {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const savedInquiries = JSON.parse(localStorage.getItem('contactInquiries') || '[]');
    setInquiries(savedInquiries);
  }, []);

  const totalAppts = appointments.length;
  const pendingAppts = appointments.filter(a => a.status === 'Pending').length;
  const approvedAppts = appointments.filter(a => a.status === 'Approved').length;
  const completedAppts = appointments.filter(a => a.status === 'Completed').length;

  // Calculate appointments by department for analytical bars
  const deptCounts = {};
  appointments.forEach(a => {
    deptCounts[a.department] = (deptCounts[a.department] || 0) + 1;
  });

  const clearInquiries = () => {
    localStorage.removeItem('contactInquiries');
    setInquiries([]);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      
      {/* Welcome & Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B2C56] tracking-tight">
            Admin Portal
          </h1>
          <p className="text-gray-500 text-xs mt-1 font-semibold">
            Real-time analytics and patient registration management
          </p>
        </div>

        {/* Admin Tabs */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setAdminTab('dashboard')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-[#0B2C56] shadow-xs cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={() => setAdminTab('appointments')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-white/60 transition cursor-pointer"
          >
            Manage Appointments
          </button>
          <button
            onClick={() => setAdminTab('doctors')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-white/60 transition cursor-pointer"
          >
            Manage Doctors
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider block">Total Visits</span>
            <span className="text-2xl font-black text-gray-900 block">{totalAppts}</span>
          </div>
          <span className="text-3xl bg-blue-50 p-3 rounded-full text-blue-600">📋</span>
        </div>

        <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider block">Pending Requests</span>
            <span className="text-2xl font-black text-rose-600 block">{pendingAppts}</span>
          </div>
          <span className="text-3xl bg-rose-50 p-3 rounded-full text-rose-600">⏳</span>
        </div>

        <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider block">Active Specialists</span>
            <span className="text-2xl font-black text-emerald-600 block">{doctors.length}</span>
          </div>
          <span className="text-3xl bg-emerald-50 p-3 rounded-full text-emerald-600">🩺</span>
        </div>

        <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-black text-[#0B2C56] block">{completedAppts}</span>
          </div>
          <span className="text-3xl bg-indigo-50 p-3 rounded-full text-indigo-600">✓</span>
        </div>

      </div>

      {/* Analytical Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Card: Department Workload Visualizer */}
        <div className="lg:col-span-2 bg-white border border-gray-150 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[#0B2C56] text-base border-b border-gray-100 pb-3 mb-4">
              Department Workload Chart
            </h3>
            <div className="space-y-4">
              {Object.keys(deptCounts).length > 0 ? (
                Object.keys(deptCounts).map(dept => {
                  const count = deptCounts[dept];
                  const percentage = Math.round((count / totalAppts) * 100);
                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-gray-700">
                        <span>{dept}</span>
                        <span>{count} Appointment(s) ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-xs py-4 text-center">No appointment distributions recorded yet.</p>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mt-6 text-xs text-[#0B2C56] leading-relaxed">
            <strong>📊 Insights:</strong> ENT care is seeing the highest patient flow. We recommend allocating more consultation slots during the morning for Dr. Rajendra Shinde.
          </div>
        </div>

        {/* Right Card: Contact Inquiries Board */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <h3 className="font-extrabold text-[#0B2C56] text-base">
              Patient Queries ({inquiries.length})
            </h3>
            {inquiries.length > 0 && (
              <button 
                onClick={clearInquiries}
                className="text-[10px] text-rose-600 hover:underline cursor-pointer font-bold"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto flex-1 pr-1">
            {inquiries.length > 0 ? (
              inquiries.map(iq => (
                <div key={iq.id} className="bg-gray-50 border border-gray-150 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                    <span>{iq.date}</span>
                    <span className="text-[#2B9CB5]">{iq.phone}</span>
                  </div>
                  <h4 className="font-extrabold text-[#0B2C56] text-xs leading-tight">{iq.subject}</h4>
                  <p className="text-gray-600 text-[11px] leading-snug italic">"{iq.message}"</p>
                  <div className="text-[10px] font-semibold text-gray-500 text-right">
                    - By {iq.name} ({iq.email})
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                <span>📬</span>
                <p className="mt-1">No contact inquiries logged yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
