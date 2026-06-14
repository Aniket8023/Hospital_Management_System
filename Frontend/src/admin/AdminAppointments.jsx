import React, { useState } from 'react';

export default function AdminAppointments({ appointments, updateAppointmentStatus, updateAppointmentDateTime, setAdminTab }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [reschedulingId, setReschedulingId] = useState(null);
  
  // Reschedule Form State
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: ''
  });

  const filteredAppts = filterStatus === 'All'
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  const startReschedule = (appt) => {
    setReschedulingId(appt.id);
    setRescheduleData({
      date: appt.preferredDate,
      time: appt.preferredTime
    });
  };

  const saveReschedule = (id) => {
    if (!rescheduleData.date || !rescheduleData.time) return;
    updateAppointmentDateTime(id, rescheduleData.date, rescheduleData.time);
    setReschedulingId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">Manage Appointments</h1>
          <p className="text-gray-500 text-xs mt-1 font-semibold">Verify registration logs and confirm booking slots</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setAdminTab('dashboard')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-white/60 transition cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={() => setAdminTab('appointments')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-[#0B2C56] shadow-xs cursor-pointer"
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {['All', 'Pending', 'Approved', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition duration-150 border cursor-pointer ${
              filterStatus === status
                ? 'bg-[#0B2C56] text-white border-[#0B2C56]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status} ({status === 'All' ? appointments.length : appointments.filter(a => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Appointments Grid/List */}
      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                <th className="p-4">Appt ID & Date</th>
                <th className="p-4">Patient Details</th>
                <th className="p-4">Doctor & Dept</th>
                <th className="p-4">Slot Details</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {filteredAppts.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50/50 transition">
                  
                  {/* ID & date booked */}
                  <td className="p-4 space-y-1">
                    <span className="font-extrabold text-[#0B2C56] block text-xs md:text-sm">{appt.id}</span>
                    <span className="text-[10px] text-gray-400 block font-semibold">Registered</span>
                  </td>

                  {/* Patient Info */}
                  <td className="p-4 space-y-1.5">
                    <div className="font-bold text-gray-800">{appt.patientName}</div>
                    <div className="text-[10.5px] text-gray-500 font-semibold space-y-0.5 leading-snug">
                      <p>📞 Phone: {appt.mobileNumber}</p>
                      <p>💳 Aadhar: {appt.aadharNumber}</p>
                      {appt.emailAddress && <p>✉️ Email: {appt.emailAddress}</p>}
                    </div>
                  </td>

                  {/* Doctor & Department */}
                  <td className="p-4 space-y-1">
                    <span className="font-bold text-gray-800 block">{appt.selectDoctor}</span>
                    <span className="bg-blue-50 text-[#0B2C56] text-[9px] font-bold px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wide inline-block">
                      {appt.department}
                    </span>
                  </td>

                  {/* Preferred Slot & Inline Reschedule form */}
                  <td className="p-4 space-y-1.5">
                    {reschedulingId === appt.id ? (
                      <div className="space-y-1.5 bg-gray-50 p-2 rounded-lg border border-gray-200">
                        <input
                          type="date"
                          value={rescheduleData.date}
                          onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full p-1 border border-gray-200 rounded text-[11px] focus:outline-none bg-white font-medium"
                        />
                        <select
                          value={rescheduleData.time}
                          onChange={(e) => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full p-1 border border-gray-200 rounded text-[11px] focus:outline-none bg-white font-medium cursor-pointer"
                        >
                          <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                          <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                          <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                          <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                        </select>
                        <div className="flex gap-1">
                          <button
                            onClick={() => saveReschedule(appt.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold px-2 py-1 rounded cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setReschedulingId(null)}
                            className="bg-gray-400 hover:bg-gray-500 text-white text-[9px] font-bold px-2 py-1 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-gray-800 block">📅 {appt.preferredDate}</span>
                        <span className="text-gray-500 font-semibold block text-[11px]">⏰ {appt.preferredTime}</span>
                        {appt.reasonForVisit && (
                          <span className="text-[10px] text-gray-400 leading-tight block max-w-[180px] truncate" title={appt.reasonForVisit}>
                            ✏️ "{appt.reasonForVisit}"
                          </span>
                        )}
                      </>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border inline-block ${getStatusBadge(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>

                  {/* Operation Actions */}
                  <td className="p-4 text-right space-y-1">
                    <div className="flex flex-col sm:flex-row justify-end gap-1.5">
                      
                      {/* Show Approval control only if pending */}
                      {appt.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, 'Approved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition shadow-xs cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appt.id, 'Cancelled')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition shadow-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* General Reschedule button if not completed/cancelled */}
                      {(appt.status === 'Pending' || appt.status === 'Approved') && (
                        <button
                          onClick={() => startReschedule(appt)}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold rounded-lg transition shadow-xs cursor-pointer"
                        >
                          Reschedule
                        </button>
                      )}

                      {/* Show Cancel for Approved appointments too if patients cancel */}
                      {appt.status === 'Approved' && (
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'Cancelled')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition shadow-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      
                      {/* Details of clinical records if completed */}
                      {appt.status === 'Completed' && (
                        <div className="text-[10px] font-semibold text-gray-500 text-right pr-2">
                          {appt.prescription ? 'Prescription Sent ✓' : 'Report Logged ✓'}
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppts.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-xs">
            <span>📋</span>
            <p className="mt-1">No appointments found matching this status filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}
