import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Phone, MapPin, CreditCard, Calendar, User, ArrowLeft,
  Stethoscope, FileText, FlaskConical, ClipboardList,
  CheckCircle2, Download, Activity, Clock
} from 'lucide-react';
import { getAuthHeaders } from '../utils/auth';

export default function AdminPatientProfile({ patientId, onBack }) {
  const API = 'http://localhost:8080';
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab state for the history section
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    fetch(`${API}/patient-history/${patientId}`, {
      headers: { ...getAuthHeaders() }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch patient history');
        return res.json();
      })
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        toast.error(String(err));
        setError(err.message);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTopColor: '#0B2C56', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: 14 }}>Loading Patient Profile...</p>
      </div>
    );
  }

  if (error || !history || !history.patient) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', textAlign: 'center' }}>
        <Activity size={48} color="#f87171" />
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Error Loading Profile</h3>
        <p style={{ color: '#94a3b8', maxWidth: 400 }}>{error || 'Patient data could not be found.'}</p>
        <button onClick={onBack} style={{ marginTop: 12, padding: '10px 28px', background: '#0B2C56', color: '#fff', borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  const { patient, appointments = [], prescriptions = [], reports = [] } = history;

  // Derive last visit & next appointment
  const sortedApts = [...appointments].sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastApts = sortedApts.filter(a => new Date(a.appointmentDate) < today);
  const futureApts = sortedApts.filter(a => new Date(a.appointmentDate) >= today);

  const lastVisit = pastApts.length > 0 ? pastApts[0].appointmentDate : null;
  const nextAppointment = futureApts.length > 0 ? futureApts[futureApts.length - 1].appointmentDate : null;

  const fmtDate = (d) => {
    if (!d) return 'N/A';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Last prescription date
  const sortedPx = [...prescriptions].sort((a, b) => new Date(b.prescriptionDate) - new Date(a.prescriptionDate));
  const lastPx = sortedPx.length > 0 ? sortedPx[0].prescriptionDate : null;

  // Last report date
  const sortedRep = [...reports].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  const lastRep = sortedRep.length > 0 ? sortedRep[0].uploadDate : null;

  const statusColor = {
    Completed: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
    Cancelled:  { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
    Pending:    { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
    Confirmed:  { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  };

  return (
    <div style={{ padding: '24px 32px', fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

      {/* Back Button */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 16px', fontWeight: 600, fontSize: 14, color: '#475569', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <ArrowLeft size={16} />
          Back to Patients
        </button>
      </div>

      {/* ═══════════════ HERO CARD ═══════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #0B2C56 0%, #1a4b87 60%, #1e5fa8 100%)',
        borderRadius: 24,
        padding: '36px 40px',
        marginBottom: 24,
        boxShadow: '0 20px 60px rgba(11,44,86,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decor */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: -40, right: 120, width: 140, height: 140, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Name + ID + Status Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                {patient.fullName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <span style={{ fontSize: 13, color: '#93c5fd', fontWeight: 600 }}>
                  Patient ID #{patient.id}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(74,222,128,0.18)', border: '1px solid rgba(74,222,128,0.3)', color: '#86efac', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 0 3px rgba(74,222,128,0.3)' }}></span>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '20px 0' }}></div>

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}>
            <InfoItem icon={<Phone size={15} />} label="Phone" value={patient.mobileNumber || 'N/A'} />
            <InfoItem icon={<MapPin size={15} />} label="Address" value={patient.address || 'N/A'} />
            <InfoItem icon={<CreditCard size={15} />} label="Aadhar" value={patient.aadharNumber || 'N/A'} />
            <InfoItem icon={<Calendar size={15} />} label="Age" value={patient.age ? `${patient.age} Years` : 'N/A'} />
            <InfoItem icon={<User size={15} />} label="Gender" value={patient.gender || 'N/A'} />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '20px 0' }}></div>

          {/* Last Visit / Next Appointment */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Last Visit</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>
                {lastVisit ? fmtDate(lastVisit) : fmtDate(new Date())}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Next Appointment</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: nextAppointment ? '#86efac' : '#94a3b8', margin: 0 }}>
                {nextAppointment ? fmtDate(nextAppointment) : 'None scheduled'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════ SUMMARY CARDS ═══════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <SummaryCard
          icon={<ClipboardList size={22} />}
          iconBg="#eff6ff"
          iconColor="#2563eb"
          label="Appointments"
          count={appointments.length}
          subLabel="Last"
          subValue={lastVisit ? fmtDate(lastVisit) : fmtDate(new Date())}
        />
        <SummaryCard
          icon={<FileText size={22} />}
          iconBg="#f0fdf4"
          iconColor="#16a34a"
          label="Prescriptions"
          count={prescriptions.length}
          subLabel="Latest"
          subValue={lastPx ? fmtDate(lastPx) : 'N/A'}
        />
        <SummaryCard
          icon={<FlaskConical size={22} />}
          iconBg="#faf5ff"
          iconColor="#9333ea"
          label="Reports"
          count={reports.length}
          subLabel="Latest"
          subValue={lastRep ? fmtDate(lastRep) : 'N/A'}
        />
      </div>

      {/* ═══════════════ TABS ═══════════════ */}
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

        {/* Tab Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
          {[
            { id: 'appointments', label: 'Appointments History', icon: <ClipboardList size={15} /> },
            { id: 'prescriptions', label: 'Prescriptions', icon: <FileText size={15} /> },
            { id: 'reports', label: 'Medical Reports', icon: <FlaskConical size={15} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px 20px',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #0B2C56' : '2px solid transparent',
                background: activeTab === tab.id ? '#f0f6ff' : 'transparent',
                color: activeTab === tab.id ? '#0B2C56' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '28px 32px', minHeight: 360, background: '#fafbfc' }}>

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div>
              {appointments.length === 0 ? (
                <EmptyState icon={<ClipboardList size={36} />} message="No appointments found for this patient." />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                  {appointments.map((apt, idx) => {
                    const sc = statusColor[apt.status] || statusColor['Pending'];
                    return (
                      <div key={idx} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}>
                        <div style={{ height: 4, background: sc.text }}></div>
                        <div style={{ padding: '18px 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', background: '#f1f5f9', padding: '3px 10px', borderRadius: 6 }}>
                                {fmtDate(apt.appointmentDate)}
                              </span>
                              {apt.appointmentTime && (
                                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{apt.appointmentTime}</span>
                              )}
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              {apt.status || 'Pending'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <div style={{ color: '#0B2C56', marginTop: 2 }}><Stethoscope size={14} /></div>
                              <div>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Doctor</p>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#0B2C56', margin: '2px 0 0' }}>
                                  {apt.doctor ? (apt.doctor.user ? apt.doctor.user.name : 'Unknown Doctor') : 'Unassigned'}
                                </p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <div style={{ color: '#64748b', marginTop: 2 }}><ClipboardList size={14} /></div>
                              <div>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Reason</p>
                                <p style={{ fontSize: 12, color: '#475569', fontWeight: 500, margin: '2px 0 0' }}>
                                  {apt.problemDescription || 'No description provided'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PRESCRIPTIONS TAB */}
          {activeTab === 'prescriptions' && (
            <div>
              {prescriptions.length === 0 ? (
                <EmptyState icon={<FileText size={36} />} message="No prescriptions found for this patient." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {prescriptions.map((px, idx) => {
                    const presIdFormatted = px.prescriptionDate 
                      ? `PRES-${px.prescriptionDate.split('-')[0]}-${String(px.id).padStart(5, '0')}`
                      : `PRES-${String(px.id).padStart(5, '0')}`;
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          background: '#fff', 
                          borderRadius: 16, 
                          border: '1px solid #e2e8f0', 
                          overflow: 'hidden', 
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                          transition: 'transform 0.2s, box-shadow 0.2s' 
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                      >
                        {/* Top emerald accent bar */}
                        <div style={{ height: 3, background: 'linear-gradient(90deg, #059669, #34d399)' }}></div>

                        <div style={{ padding: '18px 22px' }}>
                          {/* Header row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ 
                              width: 46, height: 46, borderRadius: 12, 
                              background: '#ecfdf5', border: '1px solid #a7f3d0', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              color: '#059669', fontWeight: 900, fontSize: 16, flexShrink: 0
                            }}>
                              Rx
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                Prescription Record
                              </p>
                              <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={11} /> {fmtDate(px.prescriptionDate)}
                              </p>
                            </div>
                            <span style={{
                              fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 6,
                              background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                              letterSpacing: '0.05em', fontFamily: 'monospace',
                            }}>
                              {presIdFormatted}
                            </span>
                          </div>

                          {/* Detail panel */}
                          <div style={{ 
                            display: 'flex', flexDirection: 'column', gap: 10, 
                            background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #f1f5f9',
                            marginBottom: 16
                          }}>
                            {px.doctor && px.doctor.user && (
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Stethoscope size={13} color="#94a3b8" />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', minWidth: 80 }}>Doctor:</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#0B2C56' }}>Dr. {px.doctor.user.name}</span>
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <Activity size={13} color="#94a3b8" />
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', minWidth: 80 }}>Diagnosis:</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{px.diagnosis || 'No details available'}</span>
                            </div>
                            {px.advice && (
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <FileText size={13} color="#94a3b8" />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', minWidth: 80 }}>Advice:</span>
                                <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{px.advice}</span>
                              </div>
                            )}
                          </div>

                          {/* Action button row */}
                          <div style={{ display: 'flex', gap: 12 }}>
                            <button
                              onClick={() => { window.location.hash = `/admin/prescriptions/details/${px.id}`; }}
                              style={{
                                flex: 1, padding: '10px 0',
                                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
                                fontSize: 12, fontWeight: 700, color: '#0B2C56', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; }}
                            >
                              <FileText size={13} /> View Details
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const res = await fetch(`${API}/prescriptions/${px.id}/pdf`, {
                                    headers: { ...getAuthHeaders() }
                                  });
                                  if (!res.ok) throw new Error('Failed to download PDF');
                                  const blob = await res.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = `Prescription_${presIdFormatted}.pdf`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                  toast.success('Prescription PDF downloaded successfully!');
                                } catch (err) {
                                  toast.error('Error downloading prescription PDF.');
                                }
                              }}
                              style={{
                                flex: 1, padding: '10px 0',
                                background: 'linear-gradient(135deg, #059669, #047857)',
                                border: 'none', borderRadius: 10,
                                fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 6px rgba(5,150,105,0.15)',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,150,105,0.3)'; }}
                              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(5,150,105,0.15)'; }}
                            >
                              <Download size={13} /> Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div>
              {reports.length === 0 ? (
                <EmptyState icon={<FlaskConical size={36} />} message="No medical reports found for this patient." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {reports.map((rep, idx) => {
                    // Report type color mapping
                    const typeColors = {
                      'Lab Report': { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
                      'X-Ray': { bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff', gradient: 'linear-gradient(135deg, #9333ea, #c084fc)' },
                      'MRI': { bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8', gradient: 'linear-gradient(135deg, #db2777, #f472b6)' },
                      'CT Scan': { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', gradient: 'linear-gradient(135deg, #ea580c, #fb923c)' },
                      'Blood Test': { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', gradient: 'linear-gradient(135deg, #dc2626, #f87171)' },
                      'Ultrasound': { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4', gradient: 'linear-gradient(135deg, #0d9488, #2dd4bf)' },
                    };
                    const tc = typeColors[rep.reportType] || { bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd', gradient: 'linear-gradient(135deg, #0B2C56, #1e5494)' };

                    // Detect file extension from filePath or reportName
                    const filePath = rep.filePath || rep.reportName || '';
                    const ext = filePath.split('.').pop()?.toUpperCase() || 'FILE';
                    const fileExt = ['PDF', 'JPG', 'JPEG', 'PNG', 'DICOM', 'DCM', 'DOC', 'DOCX'].includes(ext) ? ext : 'FILE';

                    return (
                      <div
                        key={idx}
                        style={{
                          background: '#fff',
                          borderRadius: 16,
                          border: '1px solid #e2e8f0',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          cursor: 'default',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                      >
                        {/* Accent bar */}
                        <div style={{ height: 3, background: tc.gradient }}></div>

                        <div style={{ padding: '18px 22px' }}>
                          {/* Header row: icon + title + badges */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                            {/* File type icon */}
                            <div style={{
                              width: 46, height: 46, borderRadius: 12,
                              background: tc.bg, border: `1px solid ${tc.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              <FlaskConical size={22} color={tc.text} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {rep.reportName}
                              </p>
                              <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={11} /> {fmtDate(rep.uploadDate)}
                              </p>
                            </div>
                            {/* Badges */}
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {rep.reportType && (
                                <span style={{
                                  fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                                  background: tc.bg, color: tc.text, border: `1px solid ${tc.border}`,
                                  textTransform: 'uppercase', letterSpacing: '0.04em',
                                }}>
                                  {rep.reportType}
                                </span>
                              )}
                              <span style={{
                                fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6,
                                background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0',
                                letterSpacing: '0.05em', fontFamily: 'monospace',
                              }}>
                                .{fileExt}
                              </span>
                            </div>
                          </div>

                          {/* Details section */}
                          <div style={{
                            display: 'flex', flexDirection: 'column', gap: 10,
                            background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #f1f5f9',
                            marginBottom: 16,
                          }}>
                            {rep.doctor && rep.doctor.user && (
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Stethoscope size={13} color="#94a3b8" />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', minWidth: 80 }}>Doctor:</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#0B2C56' }}>Dr. {rep.doctor.user.name}</span>
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <FileText size={13} color="#94a3b8" />
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', minWidth: 80 }}>Description:</span>
                              <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{rep.description || 'Uploaded report document'}</span>
                            </div>
                            {rep.reportType && (
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <FlaskConical size={13} color="#94a3b8" />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', minWidth: 80 }}>Type:</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: tc.text }}>{rep.reportType}</span>
                              </div>
                            )}
                          </div>

                          {/* Download button */}
                          <button
                            onClick={async () => {
                              if (rep.id) {
                                try {
                                  const res = await fetch(`${API}/reports/${rep.id}/download`, {
                                    headers: { ...getAuthHeaders() }
                                  });
                                  if (!res.ok) throw new Error('Failed to download file');
                                  const blob = await res.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = rep.reportName || 'Report';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                  toast.success('Report downloaded successfully!');
                                } catch (e) {
                                  toast.error('Error downloading file.');
                                }
                              } else {
                                toast.error('No file data available.');
                              }
                            }}
                            style={{
                              width: '100%', padding: '11px 0',
                              background: 'linear-gradient(135deg, #0B2C56, #1a4478)',
                              border: 'none', borderRadius: 10,
                              fontSize: 12, fontWeight: 700, color: '#fff',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                              transition: 'all 0.25s ease',
                              boxShadow: '0 2px 8px rgba(11,44,86,0.15)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(11,44,86,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(11,44,86,0.15)'; e.currentTarget.style.transform = 'none'; }}
                          >
                            <Download size={14} /> Download Report
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

/* ─── Sub-components ─── */

function InfoItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ color: '#93c5fd', marginTop: 2 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 10, color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{label}</p>
        <p style={{ fontSize: 14, color: '#fff', fontWeight: 600, margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({ icon, iconBg, iconColor, label, count, subLabel, subValue }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
          <h3 style={{ fontSize: 28, fontWeight: 900, color: '#1e293b', margin: '2px 0 0', lineHeight: 1 }}>{count}</h3>
        </div>
      </div>
      <div style={{ height: 1, background: '#f1f5f9' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{subLabel}</span>
        <span style={{ fontSize: 12, color: '#475569', fontWeight: 700 }}>{subValue}</span>
      </div>
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
      <div style={{ color: '#cbd5e1' }}>{icon}</div>
      <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: 14, margin: 0 }}>{message}</p>
    </div>
  );
}
