import React, { useState } from 'react';

export default function DoctorDashboard({ doctors, appointments, resolveAppointment, loggedInDoctorId }) {
  // Clinical Session States
  const [activeCheckupId, setActiveCheckupId] = useState(null);
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');

  // Auto-select the logged-in doctor from the login page
  const currentDoctor = doctors.find(d => d.id === Number(loggedInDoctorId));

  // Filter appointments assigned to this doctor
  const docAppointments = currentDoctor
    ? appointments.filter(a => a.selectDoctor === currentDoctor.name)
    : [];

  const handleStartCheckup = (appt) => {
    setActiveCheckupId(appt.id);
    setNotes(appt.comments || '');
    setPrescription(appt.prescription || '');
  };

  const handleCompleteCheckup = (e, id) => {
    e.preventDefault();
    if (!notes.trim() || !prescription.trim()) {
      alert('Please fill in both checkup notes and prescription details.');
      return;
    }
    resolveAppointment(id, notes, prescription);
    setActiveCheckupId(null);
    setNotes('');
    setPrescription('');
  };

  if (!currentDoctor) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
        <div className="text-center space-y-2">
          <span className="text-4xl block">⚠️</span>
          <p className="font-semibold">Doctor profile not found. Please sign in again.</p>
          <a href="#/doctor/login" className="text-emerald-600 underline text-xs font-bold">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#065f46] tracking-tight">
          Clinical Workspace
        </h1>
        <p className="text-gray-500 text-xs mt-1 font-semibold">
          Manage your appointments and issue digital prescriptions
        </p>
      </div>

      {/* Doctor Identity Card */}
      <div className="bg-gradient-to-r from-[#065f46] to-[#047857] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-md">
        <img
          src={currentDoctor.image}
          alt={currentDoctor.name}
          className="w-16 h-16 rounded-xl object-cover border-3 border-white/30 shadow-sm flex-shrink-0"
        />
        <div className="flex-1 text-left space-y-1">
          <span className="bg-emerald-400/30 text-emerald-100 text-[8px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30 uppercase tracking-wide inline-block">
            {currentDoctor.department}
          </span>
          <h2 className="font-extrabold text-xl text-white leading-snug">{currentDoctor.name}</h2>
          <p className="text-emerald-200 text-xs font-medium">{currentDoctor.role}</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right text-emerald-100 text-xs flex-shrink-0">
          <span className="font-bold text-white text-sm">{docAppointments.length} Appointment(s)</span>
          <span className="text-[10px]">
            {docAppointments.filter(a => a.status === 'Approved').length} awaiting checkup
          </span>
        </div>
      </div>

      {/* Appointments Schedule */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-extrabold text-[#065f46] text-base">
            Consultation Schedule
          </h3>
          <div className="flex gap-2 text-[10px] font-bold">
            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              {docAppointments.filter(a => a.status === 'Pending').length} Pending
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
              {docAppointments.filter(a => a.status === 'Approved').length} Approved
            </span>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              {docAppointments.filter(a => a.status === 'Completed').length} Done
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {docAppointments.map(appt => {
            const isUnderSession = activeCheckupId === appt.id;

            return (
              <div
                key={appt.id}
                className={`border rounded-xl p-4 md:p-5 transition duration-200 space-y-4 ${
                  isUnderSession
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-gray-150 hover:border-gray-300'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-gray-900 text-sm">{appt.patientName}</span>
                    <span className="text-[10px] text-gray-400 font-bold">({appt.id})</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                      appt.status === 'Approved'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      appt.status === 'Pending'   ? 'bg-amber-50  text-amber-700  border-amber-200'   :
                      appt.status === 'Completed' ? 'bg-blue-50   text-blue-700   border-blue-200'    :
                                                    'bg-rose-50   text-rose-700   border-rose-200'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-gray-500 flex items-center gap-2">
                    <span>📅 {appt.preferredDate}</span>
                    <span>•</span>
                    <span>⏰ {appt.preferredTime}</span>
                  </div>
                </div>

                {/* Patient details */}
                <div className="text-xs text-gray-500 font-semibold space-y-1 leading-snug">
                  <p>📞 {appt.mobileNumber} &nbsp;|&nbsp; 💳 Aadhar: {appt.aadharNumber}</p>
                  {appt.reasonForVisit && (
                    <p className="text-gray-700 font-medium italic mt-1 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      Symptoms: "{appt.reasonForVisit}"
                    </p>
                  )}
                </div>

                {/* Checkup form / completed card */}
                {isUnderSession ? (
                  <form onSubmit={(e) => handleCompleteCheckup(e, appt.id)} className="space-y-4 border-t border-gray-100 pt-4">
                    <h4 className="font-extrabold text-emerald-900 text-xs uppercase tracking-wider">Clinical Checkup Editor</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Diagnoses / Notes *</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows="3"
                          placeholder="Describe findings or diagnosis..."
                          className="w-full p-2 border border-emerald-200 rounded-lg text-xs focus:outline-none focus:border-emerald-400 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Prescription *</label>
                        <textarea
                          value={prescription}
                          onChange={(e) => setPrescription(e.target.value)}
                          rows="3"
                          placeholder="e.g. Paracetamol 650mg — 1 tab after meals, 3x daily"
                          className="w-full p-2 border border-emerald-200 rounded-lg text-xs focus:outline-none focus:border-emerald-400 bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveCheckupId(null)}
                        className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                      >
                        ✓ Save & Complete
                      </button>
                    </div>
                  </form>
                ) : appt.status === 'Completed' ? (
                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 text-xs space-y-2 leading-relaxed">
                    <p className="font-bold text-emerald-900 flex items-center gap-1.5">⚕️ Medical Consultation Card</p>
                    <p><strong>Clinical Notes:</strong> {appt.comments}</p>
                    <p className="border-t border-emerald-100/50 pt-2 font-bold text-blue-900">💊 Prescription:</p>
                    <p className="bg-white border border-emerald-100 p-2.5 rounded-lg font-mono text-gray-700 whitespace-pre-line text-[11px]">
                      {appt.prescription}
                    </p>
                  </div>
                ) : (
                  appt.status === 'Approved' && (
                    <div className="flex justify-end border-t border-gray-100 pt-3">
                      <button
                        onClick={() => handleStartCheckup(appt)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition flex items-center gap-1.5"
                      >
                        <span>📝</span>
                        <span>Conduct Checkup</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })}

          {docAppointments.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-xs border border-dashed border-gray-150 rounded-xl">
              <span className="text-3xl block">📅</span>
              <p className="mt-2 font-semibold">No appointments in your schedule yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

