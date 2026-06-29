import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, Pill, User, UserRound, CalendarDays, Download,
  Eye, Printer, Clock, Stethoscope, Plus, X, Search,
  RefreshCw, ChevronDown, AlertCircle, RotateCcw, Share2,
  ZoomIn, ArrowLeft, CheckCircle2, Activity, FlaskConical,
  Building2, Phone, MapPin
} from 'lucide-react';
import { getAuthHeaders } from '../utils/auth';

// ─── helpers ──────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const presId = (p) => {
  const yr = p.prescriptionDate ? p.prescriptionDate.split('-')[0] : new Date().getFullYear();
  return 'PRES-' + yr + '-' + String(p.id).padStart(5, '0');
};
// Convert "1-0-1" → "Morning / Night"
const formatDosage = (dosage) => {
  if (!dosage) return '—';
  const parts = dosage.split('-');
  if (parts.length < 3) return dosage; // already human-readable
  const labels = ['Morning', 'Afternoon', 'Night'];
  const active = labels.filter((_, i) => parts[i]?.trim() === '1');
  return active.length > 0 ? active.join(' / ') : '—';
};

const aptId = (a) => {
  if (!a?.id) return 'N/A';
  const yr = a.appointmentDate ? new Date(a.appointmentDate).getFullYear() : new Date().getFullYear();
  return 'APT-' + yr + '-' + String(a.id).padStart(5, '0');
};

const STATUS_STYLES = {
  Active:     { bg: '#dcfce7', text: '#16a34a', border: '#86efac', dot: '#22c55e' },
  Completed:  { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd', dot: '#3b82f6' },
  Draft:      { bg: '#fef9c3', text: '#ca8a04', border: '#fde047', dot: '#eab308' },
  Cancelled:  { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5', dot: '#ef4444' },
};
const getStatus = (p) => p.status || 'Active';

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 10,
  fontSize: 13, fontWeight: 500, color: '#1e293b', background: '#fff',
  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
};
const labelStyle = { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 };

// ─── StatusBadge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Active'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: s.bg, color: s.text, border: `1px solid ${s.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }}></span>
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function AdminPrescriptions({ patients = [], appointments = [], hash }) {
  const API = 'http://localhost:8080';

  // ── Data state ──
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // ── Detail view ──
  const isDetailView = hash && hash.startsWith('/admin/prescriptions/details/');
  const prescriptionId = isDetailView ? hash.substring('/admin/prescriptions/details/'.length) : null;
  const [detailPresc, setDetailPresc] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);

  // ── Filters ──
  const [filterPatient, setFilterPatient] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDiagnosis, setFilterDiagnosis] = useState('');

  // ── Modal state ──
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // ── Form state ──
  const [formData, setFormData] = useState({
    patientId: '', doctorId: '', appointmentId: '',
    diagnosis: '', advice: '',
    medicines: [{ medicineName: '', morning: false, afternoon: false, night: false, duration: '' }]
  });
  const [formError, setFormError] = useState('');
  const [modalTab, setModalTab] = useState('patient'); // patient | diagnosis | medicines

  // ── Patient search (create modal) ──
  const [patientSearch, setPatientSearch] = useState('');
  const [patientOptions, setPatientOptions] = useState(patients);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // ── Sync patientOptions ──
  useEffect(() => { setPatientOptions(patients); }, [patients]);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    const fn = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // ── Patient search API ──
  useEffect(() => {
    if (!patientSearch.trim()) { setPatientOptions(patients); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/patients/search/name?name=${encodeURIComponent(patientSearch)}`, { headers: getAuthHeaders() });
        if (res.ok) setPatientOptions(await res.json());
      } catch (e) { console.error(e); }
    }, 300);
    return () => clearTimeout(t);
  }, [patientSearch, patients]);

  // ── Fetch doctors ──
  useEffect(() => {
    fetch(`${API}/doctor`, { headers: getAuthHeaders() }).then(r => r.json()).then(setDoctors).catch(console.error);
  }, []);

  // ── Fetch prescriptions ──
  const fetchPrescriptions = async () => {
    try {
      const res = await fetch(`${API}/prescriptions`, { headers: getAuthHeaders() });
      if (res.ok) setPrescriptions(await res.json());
    } catch (e) { console.error(e); }
  };
  useEffect(() => { fetchPrescriptions(); }, []);

  // ── Load detail view ──
  useEffect(() => {
    if (!prescriptionId) { if (pdfUrl) { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); } setDetailPresc(null); return; }
    const load = async () => {
      setLoadingDetail(true);
      try {
        const dr = await fetch(`${API}/prescriptions/${prescriptionId}`, { headers: getAuthHeaders() });
        if (dr.ok) setDetailPresc(await dr.json());
        const pr = await fetch(`${API}/prescriptions/${prescriptionId}/pdf`, { headers: getAuthHeaders() });
        if (pr.ok) setPdfUrl(URL.createObjectURL(await pr.blob()));
      } catch (e) { console.error(e); } finally { setLoadingDetail(false); }
    };
    load();
  }, [prescriptionId]);

  // ── Download PDF helper ──
  const handleDownloadPdf = () => {
    if (!pdfUrl || !detailPresc) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `Prescription_${presId(detailPresc)}.pdf`;
    a.click();
  };

  const downloadPdfById = async (id) => {
    try {
      const res = await fetch(`${API}/prescriptions/${id}/pdf`, { headers: getAuthHeaders() });
      if (res.ok) { const u = URL.createObjectURL(await res.blob()); window.open(u, '_blank'); }
    } catch (e) { console.error(e); }
  };

  // ── Names helpers ──
  const getPatientName = (p) => p.patient?.fullName || patients.find(x => x.id === p.patientId)?.fullName || 'N/A';
  const getDoctorName = (p) => p.doctor?.user?.name || doctors.find(d => d.id === p.doctorId)?.user?.name || 'N/A';

  // ── Medicine helpers ──
  const handleMedicineChange = (idx, field, value) => {
    const updated = [...formData.medicines];
    updated[idx][field] = value;
    setFormData(prev => ({ ...prev, medicines: updated }));
  };
  const addMedicineRow = () => setFormData(prev => ({ ...prev, medicines: [...prev.medicines, { medicineName: '', morning: false, afternoon: false, night: false, duration: '' }] }));
  const removeMedicineRow = (idx) => setFormData(prev => ({ ...prev, medicines: prev.medicines.filter((_, i) => i !== idx) }));

  // ── Submit ──
  const submitPrescription = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.diagnosis) { setFormError('Patient, Doctor and Diagnosis are required'); return; }
    const payload = {
      ...formData,
      patientId: Number(formData.patientId),
      doctorId: Number(formData.doctorId),
      appointmentId: formData.appointmentId ? Number(formData.appointmentId) : null,
      medicines: formData.medicines.map(m => ({
        medicineName: m.medicineName,
        dosage: [m.morning ? '1' : '0', m.afternoon ? '1' : '0', m.night ? '1' : '0'].join('-'),
        duration: m.duration
      }))
    };
    try {
      const res = await fetch(`${API}/prescriptions`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify(payload) });
      if (res.ok) { await fetchPrescriptions(); setModalOpen(false); }
      else setFormError(await res.text());
    } catch (e) { setFormError('Network error'); }
  };

  // ── Open view modal ──
  const openViewModal = async (presc) => {
    try {
      const res = await fetch(`${API}/prescriptions/${presc.id}`, { headers: getAuthHeaders() });
      if (res.ok) { setSelectedPrescription(await res.json()); setViewModalOpen(true); }
    } catch (e) { console.error(e); }
  };

  // ── Open add modal ──
  const openAddModal = () => {
    setFormData({ patientId: '', doctorId: '', appointmentId: '', diagnosis: '', advice: '', medicines: [{ medicineName: '', morning: false, afternoon: false, night: false, duration: '' }] });
    setPatientSearch(''); setFormError(''); setModalTab('patient'); setModalOpen(true);
  };

  // ── Filter prescriptions ──
  const filteredPrescriptions = prescriptions.filter(p => {
    const pName = getPatientName(p).toLowerCase();
    const dName = getDoctorName(p).toLowerCase();
    const diag = (p.diagnosis || '').toLowerCase();
    const dt = p.prescriptionDate || p.createdDate || '';
    if (filterPatient && !pName.includes(filterPatient.toLowerCase())) return false;
    if (filterDoctor && !dName.includes(filterDoctor.toLowerCase())) return false;
    if (filterDiagnosis && !diag.includes(filterDiagnosis.toLowerCase())) return false;
    if (filterDate && !dt.includes(filterDate)) return false;
    return true;
  });

  // ── Stats ──
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const todayCount = prescriptions.filter(p => (p.prescriptionDate || '').startsWith(today)).length;
  const weekCount = prescriptions.filter(p => (p.prescriptionDate || '') >= weekAgo).length;

  // ════════════════════════════════════════
  // DETAIL VIEW
  // ════════════════════════════════════════
  if (isDetailView) {
    if (loadingDetail) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 44, height: 44, border: '4px solid #e2e8f0', borderTopColor: '#0B2C56', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: 14 }}>Loading prescription...</p>
      </div>
    );

    if (!detailPresc) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
        <AlertCircle size={40} color="#ef4444" />
        <p style={{ color: '#94a3b8', fontWeight: 600 }}>Prescription not found.</p>
        <button onClick={() => window.location.hash = '/admin/prescriptions'} style={{ padding: '9px 22px', background: '#0B2C56', color: '#fff', borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 13 }}>
          Back to Prescriptions
        </button>
      </div>
    );

    const dp = detailPresc;
    const formattedDate = fmtDate(dp.prescriptionDate);
    const formattedAptId = aptId(dp.appointment);
    const meds = dp.medicines || [];
    const status = getStatus(dp);

    return (
      <div style={{ padding: '24px 28px', fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <button onClick={() => window.location.hash = '/admin/prescriptions'} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 16px', fontWeight: 600, fontSize: 13, color: '#475569', cursor: 'pointer' }}>
            <ArrowLeft size={15} /> Back to Prescriptions
          </button>
          {/* PDF toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setPdfZoom(z => Math.min(z + 25, 200))} title="Zoom In" style={toolbarBtn}><ZoomIn size={15} /></button>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', minWidth: 40, textAlign: 'center' }}>{pdfZoom}%</span>
            <button onClick={() => setPdfZoom(100)} title="Reset Zoom" style={toolbarBtn}><RotateCcw size={15} /></button>
            <button onClick={() => { if (pdfUrl) window.open(pdfUrl, '_blank'); }} title="Print" style={toolbarBtn}><Printer size={15} /></button>
            <button onClick={() => { if (pdfUrl) navigator.clipboard?.writeText(pdfUrl); }} title="Share" style={toolbarBtn}><Share2 size={15} /></button>
            <button onClick={handleDownloadPdf} title="Download" style={{ ...toolbarBtn, background: '#0B2C56', color: '#fff', borderColor: '#0B2C56' }}>
              <Download size={15} /> <span style={{ fontSize: 13, fontWeight: 700 }}>Download</span>
            </button>
          </div>
        </div>

        {/* Content: left panel + PDF */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>

          {/* ── LEFT PANEL ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Prescription ID & Status */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}><FileText size={18} /></div>
                  <div>
                    <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Prescription</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', margin: 0 }}>{presId(dp)}</p>
                  </div>
                </div>
                <StatusBadge status={status} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <DetailRow label="Date" value={formattedDate} icon={<CalendarDays size={13} />} />
                <DetailRow label="Appointment" value={formattedAptId} icon={<Clock size={13} />} />
              </div>
            </div>

            {/* Patient card */}
            <div style={card}>
              <SectionTitle icon={<User size={15} />} title="Patient" color="#0B2C56" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 }}>{dp.patient?.fullName || 'N/A'}</p>
                <DetailRow label="Age" value={dp.patient?.age ? `${dp.patient.age} Years` : 'N/A'} icon={<UserRound size={13} />} />
                <DetailRow label="Gender" value={dp.patient?.gender || 'N/A'} icon={<User size={13} />} />
                <DetailRow label="Phone" value={dp.patient?.mobileNumber || 'N/A'} icon={<Phone size={13} />} />
                <DetailRow label="Address" value={dp.patient?.address || 'N/A'} icon={<MapPin size={13} />} />
              </div>
            </div>

            {/* Doctor card */}
            <div style={card}>
              <SectionTitle icon={<Stethoscope size={15} />} title="Doctor" color="#0B2C56" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 }}>Dr. {dp.doctor?.user?.name || 'N/A'}</p>
                <DetailRow label="Department" value={dp.doctor?.specialization || 'N/A'} icon={<Building2 size={13} />} />
                <DetailRow label="Experience" value={dp.doctor?.experience ? `${dp.doctor.experience} Years` : 'N/A'} icon={<Activity size={13} />} />
                <DetailRow label="Room" value={dp.doctor?.roomNumber || 'N/A'} icon={<Building2 size={13} />} />
              </div>
            </div>

            {/* Diagnosis card */}
            <div style={card}>
              <SectionTitle icon={<FlaskConical size={15} />} title="Diagnosis" color="#0B2C56" />
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 12px' }}>{dp.diagnosis || '—'}</p>
                {dp.advice && (
                  <>
                    <div style={{ height: 1, background: '#f1f5f9', margin: '12px 0' }}></div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Advice</p>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>{dp.advice}</p>
                  </>
                )}
              </div>
            </div>

            {/* Medicines */}
            {meds.length > 0 && (
              <div style={card}>
                <SectionTitle icon={<Pill size={15} />} title="Medicines" color="#0B2C56" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                  {meds.map((m, i) => {
                    const parts = (m.dosage || '0-0-0').split('-');
                    const morn = parts[0] === '1', aft = parts[1] === '1', ngt = parts[2] === '1';
                    return (
                      <div key={i} style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>{m.medicineName}</p>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', background: '#e2e8f0', borderRadius: 6, padding: '2px 8px' }}>{m.duration || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {[['M', morn], ['A', aft], ['N', ngt]].map(([lbl, active]) => (
                            <span key={lbl} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: active ? '#0B2C56' : '#f1f5f9', color: active ? '#fff' : '#94a3b8' }}>{lbl}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: PDF Viewer ── */}
          <div style={{ background: '#1e2126', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'sticky', top: 20 }}>
            {/* PDF top bar */}
            <div style={{ background: '#2d3139', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>PDF Preview</span>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{presId(dp)}</span>
            </div>
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&statusbar=0&zoom=${pdfZoom}`}
                style={{ width: '100%', height: 'calc(100vh - 180px)', minHeight: 600, border: 'none', display: 'block' }}
                title="Prescription PDF"
              />
            ) : (
              <div style={{ width: '100%', height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#94a3b8' }}>
                <FileText size={40} />
                <p style={{ fontSize: 13, fontWeight: 600 }}>Loading PDF Preview...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════
  return (
    <div style={{ padding: '24px 28px', fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0B2C56', margin: 0 }}>Prescription Management</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, margin: '4px 0 0' }}>Create and manage patient prescriptions</p>
        </div>
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0B2C56', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(11,44,86,0.25)' }}>
          <Plus size={16} /> New Prescription
        </button>
      </div>

      {/* ── Dashboard Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<FileText size={22} />} iconBg="#eff6ff" iconColor="#2563eb" label="Total Prescriptions" value={prescriptions.length} />
        <StatCard icon={<CalendarDays size={22} />} iconBg="#f0fdf4" iconColor="#16a34a" label="Today's" value={todayCount} />
        <StatCard icon={<Stethoscope size={22} />} iconBg="#faf5ff" iconColor="#9333ea" label="Doctors" value={doctors.length} />
        <StatCard icon={<Download size={22} />} iconBg="#fff7ed" iconColor="#ea580c" label="This Week" value={weekCount} />
      </div>

      {/* ── Filters ── */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '20px 22px', marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <FilterInput icon={<Search size={14} />} placeholder="Search patient..." value={filterPatient} onChange={setFilterPatient} label="Patient" />
          <FilterInput icon={<Stethoscope size={14} />} placeholder="Search doctor..." value={filterDoctor} onChange={setFilterDoctor} label="Doctor" />
          <FilterInput icon={<FlaskConical size={14} />} placeholder="Diagnosis..." value={filterDiagnosis} onChange={setFilterDiagnosis} label="Diagnosis" />
          <div style={{ flex: '0 0 160px' }}>
            <label style={labelStyle}>Date</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ ...inputStyle, paddingRight: 8 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={() => { setFilterPatient(''); setFilterDoctor(''); setFilterDate(''); setFilterDiagnosis(''); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 700, fontSize: 13, color: '#64748b', cursor: 'pointer' }}>
              <RefreshCw size={13} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Prescriptions <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>({filteredPrescriptions.length})</span></span>
          <button onClick={fetchPrescriptions} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontWeight: 600, fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {filteredPrescriptions.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><FileText size={32} /></div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>No Prescriptions Found</p>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Create your first prescription to get started.</p>
            <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, padding: '10px 22px', background: '#0B2C56', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
              <Plus size={15} /> Create Prescription
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  {['Prescription ID', 'Patient', 'Doctor', 'Diagnosis', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: h === 'Actions' ? 'center' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#1e293b', fontFamily: 'monospace', fontSize: 12 }}>{presId(p)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}><User size={15} /></div>
                        <span style={{ fontWeight: 700, color: '#0B2C56' }}>{getPatientName(p)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 600 }}>Dr. {getDoctorName(p)}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.diagnosis || '—'}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmtDate(p.prescriptionDate || p.createdDate)}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={getStatus(p)} /></td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <ActionBtn title="View Details" onClick={() => openViewModal(p)} color="#2563eb" bg="#eff6ff"><Eye size={14} /></ActionBtn>
                        <ActionBtn title="Download PDF" onClick={() => downloadPdfById(p.id)} color="#16a34a" bg="#f0fdf4"><Download size={14} /></ActionBtn>
                        <ActionBtn title="Open Detail Page" onClick={() => window.location.hash = `/admin/prescriptions/details/${p.id}`} color="#7c3aed" bg="#faf5ff"><FileText size={14} /></ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          VIEW MODAL
      ════════════════════════════════════════ */}
      {viewModalOpen && selectedPrescription && (
        <div style={overlay} onClick={() => setViewModalOpen(false)}>
          <div style={{ ...modalBox, maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}><FileText size={18} /></div>
                <div>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>Prescription</p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 }}>{presId(selectedPrescription)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StatusBadge status={getStatus(selectedPrescription)} />
                <button onClick={() => setViewModalOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
              </div>
            </div>

            <div style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: '75vh' }}>

              {/* Patient + Doctor Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ background: '#f8fafc', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                  <SectionTitle icon={<User size={14} />} title="Patient" color="#0B2C56" />
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', margin: 0 }}>{selectedPrescription.patient?.fullName || 'N/A'}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{selectedPrescription.patient?.age ? `${selectedPrescription.patient.age} yrs` : ''} {selectedPrescription.patient?.gender || ''}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{selectedPrescription.patient?.mobileNumber || ''}</p>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' }}>
                  <SectionTitle icon={<Stethoscope size={14} />} title="Doctor" color="#0B2C56" />
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', margin: 0 }}>Dr. {selectedPrescription.doctor?.user?.name || 'N/A'}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{selectedPrescription.doctor?.specialization || ''}</p>
                  </div>
                </div>
              </div>

              {/* Appointment & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <InfoTile label="Date" value={fmtDate(selectedPrescription.prescriptionDate)} icon={<CalendarDays size={13} />} />
                <InfoTile label="Appointment" value={aptId(selectedPrescription.appointment)} icon={<Clock size={13} />} />
              </div>

              {/* Diagnosis */}
              <div style={{ background: '#f8fafc', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9', marginBottom: 16 }}>
                <SectionTitle icon={<FlaskConical size={14} />} title="Diagnosis" color="#0B2C56" />
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '10px 0 0' }}>{selectedPrescription.diagnosis || '—'}</p>
                {selectedPrescription.advice && (
                  <>
                    <div style={{ height: 1, background: '#e2e8f0', margin: '12px 0' }}></div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Advice</p>
                    <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>{selectedPrescription.advice}</p>
                  </>
                )}
              </div>

              {/* Medicines */}
              {(selectedPrescription.medicines || []).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <SectionTitle icon={<Pill size={14} />} title="Medicines" color="#0B2C56" />
                  <div style={{ overflowX: 'auto', marginTop: 10 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderRadius: 8 }}>
                          {['Medicine', 'Morning', 'Afternoon', 'Night', 'Days'].map(h => (
                            <th key={h} style={{ padding: '9px 12px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', border: '1px solid #f1f5f9' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPrescription.medicines.map((m, i) => {
                          const parts = (m.dosage || '0-0-0').split('-');
                          const morn = parts[0] === '1', aft = parts[1] === '1', ngt = parts[2] === '1';
                          return (
                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>{m.medicineName}</td>
                              <DoseCell active={morn} />
                              <DoseCell active={aft} />
                              <DoseCell active={ngt} />
                              <td style={{ padding: '10px 12px', color: '#64748b', fontWeight: 600 }}>{m.duration || 'N/A'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => downloadPdfById(selectedPrescription.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', background: '#0B2C56', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                  <Download size={14} /> Download PDF
                </button>
                <button onClick={() => { setViewModalOpen(false); window.location.hash = `/admin/prescriptions/details/${selectedPrescription.id}`; }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', background: '#f1f5f9', color: '#1e293b', borderRadius: 10, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                  <Eye size={14} /> Full Details
                </button>
                <button onClick={() => setViewModalOpen(false)} style={{ padding: '10px 20px', background: '#fff', color: '#64748b', borderRadius: 10, fontWeight: 700, fontSize: 13, border: '1px solid #e2e8f0', cursor: 'pointer' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          CREATE MODAL
      ════════════════════════════════════════ */}
      {modalOpen && (
        <div style={overlay} onClick={() => setModalOpen(false)}>
          <div style={{ ...modalBox, maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}><Plus size={18} /></div>
                <div>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>New</p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 }}>Create Prescription</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
            </div>

            {/* Tab Nav */}
            <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
              {[['patient', <User size={13} />, 'Patient & Doctor'], ['diagnosis', <FlaskConical size={13} />, 'Diagnosis'], ['medicines', <Pill size={13} />, 'Medicines']].map(([id, icon, label]) => (
                <button key={id} onClick={() => setModalTab(id)} style={{ flex: 1, padding: '13px 8px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: 'none', borderBottom: modalTab === id ? '2px solid #0B2C56' : '2px solid transparent', background: 'transparent', color: modalTab === id ? '#0B2C56' : '#94a3b8', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {icon} {label}
                </button>
              ))}
            </div>

            <form onSubmit={submitPrescription}>
              <div style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: '55vh' }}>
                {formError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
                    <AlertCircle size={15} /> {formError}
                  </div>
                )}

                {/* Patient & Doctor Tab */}
                {modalTab === 'patient' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Patient search */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                      <label style={labelStyle}>Patient *</label>
                      <div style={{ position: 'relative' }}>
                        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                        <input
                          type="text"
                          placeholder="Type to search patient..."
                          value={patientSearch}
                          onChange={e => { setPatientSearch(e.target.value); setShowDropdown(true); if (!e.target.value) setFormData(prev => ({ ...prev, patientId: '' })); }}
                          onFocus={() => setShowDropdown(true)}
                          style={{ ...inputStyle, paddingLeft: 36 }}
                        />
                        {patientSearch && (
                          <button type="button" onClick={() => { setPatientSearch(''); setFormData(prev => ({ ...prev, patientId: '' })); setPatientOptions(patients); setShowDropdown(false); }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={14} /></button>
                        )}
                      </div>
                      {showDropdown && (
                        <div style={{ position: 'absolute', zIndex: 100, left: 0, right: 0, top: '100%', marginTop: 4, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: 220, overflowY: 'auto' }}>
                          {patientOptions.length === 0 ? (
                            <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No patients found</div>
                          ) : patientOptions.map(pt => (
                            <div key={pt.id} onClick={() => { setFormData(prev => ({ ...prev, patientId: pt.id })); setPatientSearch(pt.fullName); setShowDropdown(false); }}
                              style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc', background: String(formData.patientId) === String(pt.id) ? '#eff6ff' : 'transparent', transition: 'background 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.background = String(formData.patientId) === String(pt.id) ? '#eff6ff' : 'transparent'}
                            >
                              <div>
                                <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{pt.fullName}</span>
                                <span style={{ marginLeft: 8, fontSize: 11, color: '#94a3b8' }}>ID: {pt.id}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Doctor */}
                    <div>
                      <label style={labelStyle}>Doctor *</label>
                      <select name="doctorId" value={formData.doctorId} onChange={e => setFormData(p => ({ ...p, doctorId: e.target.value }))} style={inputStyle} required>
                        <option value="">— Choose Doctor —</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.user?.name} {d.specialization ? `(${d.specialization})` : ''}</option>)}
                      </select>
                    </div>

                    {/* Appointment */}
                    <div>
                      <label style={labelStyle}>Appointment (optional)</label>
                      <select name="appointmentId" value={formData.appointmentId} onChange={e => setFormData(p => ({ ...p, appointmentId: e.target.value }))} style={inputStyle}>
                        <option value="">— None —</option>
                        {appointments.map(a => <option key={a.id} value={a.id}>{a.id} – {a.fullName}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Diagnosis Tab */}
                {modalTab === 'diagnosis' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Diagnosis *</label>
                      <input type="text" value={formData.diagnosis} onChange={e => setFormData(p => ({ ...p, diagnosis: e.target.value }))} placeholder="e.g. Viral Fever" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Advice</label>
                      <textarea value={formData.advice} onChange={e => setFormData(p => ({ ...p, advice: e.target.value }))} rows={4} placeholder="Drink water, rest, avoid cold food..." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                    </div>
                  </div>
                )}

                {/* Medicines Tab */}
                {modalTab === 'medicines' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Medicine List</span>
                      <button type="button" onClick={addMedicineRow} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                        <Plus size={13} /> Add Medicine
                      </button>
                    </div>

                    {/* Medicine table */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            {['Medicine', 'Morning', 'Afternoon', 'Night', 'Days', ''].map(h => (
                              <th key={h} style={{ padding: '10px 12px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.medicines.map((med, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                              <td style={{ padding: '8px 10px' }}>
                                <input type="text" placeholder="Medicine name" value={med.medicineName} onChange={e => handleMedicineChange(idx, 'medicineName', e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: '7px 10px' }} />
                              </td>
                              {['morning', 'afternoon', 'night'].map(slot => (
                                <td key={slot} style={{ padding: '8px 6px', textAlign: 'center' }}>
                                  <button type="button" onClick={() => handleMedicineChange(idx, slot, !med[slot])} style={{ width: 28, height: 28, borderRadius: 6, border: med[slot] ? '2px solid #0B2C56' : '2px solid #e2e8f0', background: med[slot] ? '#0B2C56' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: 'auto', transition: 'all 0.15s' }}>
                                    {med[slot] ? <CheckCircle2 size={14} color="#fff" /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0', display: 'block' }}></span>}
                                  </button>
                                </td>
                              ))}
                              <td style={{ padding: '8px 10px' }}>
                                <input type="text" placeholder="Days" value={med.duration} onChange={e => handleMedicineChange(idx, 'duration', e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: '7px 10px', width: 70 }} />
                              </td>
                              <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                                <button type="button" onClick={() => removeMedicineRow(idx)} style={{ width: 28, height: 28, borderRadius: 6, background: '#fef2f2', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: 'auto' }}>
                                  <X size={13} color="#ef4444" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['patient', 'diagnosis', 'medicines'].map((t, i) => (
                    <button key={t} type="button" onClick={() => setModalTab(t)} style={{ width: 8, height: 8, borderRadius: '50%', background: modalTab === t ? '#0B2C56' : '#e2e8f0', border: 'none', cursor: 'pointer', padding: 0, transition: 'background 0.2s' }}></button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {modalTab !== 'patient' && (
                    <button type="button" onClick={() => setModalTab(modalTab === 'medicines' ? 'diagnosis' : 'patient')} style={{ padding: '9px 18px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 700, fontSize: 13, color: '#475569', cursor: 'pointer' }}>Back</button>
                  )}
                  {modalTab !== 'medicines' ? (
                    <button type="button" onClick={() => setModalTab(modalTab === 'patient' ? 'diagnosis' : 'medicines')} style={{ padding: '9px 22px', background: '#0B2C56', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Next →</button>
                  ) : (
                    <button type="submit" style={{ padding: '9px 22px', background: '#0B2C56', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Save Prescription</button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Style helpers ──────────────────────────────────────────────
const card = {
  background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
  padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
};

const toolbarBtn = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
  fontWeight: 700, fontSize: 13, color: '#475569', cursor: 'pointer'
};

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(11,44,86,0.45)',
  backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', padding: 24, zIndex: 50
};

const modalBox = {
  background: '#fff', borderRadius: 20, width: '100%',
  boxShadow: '0 24px 80px rgba(0,0,0,0.2)', overflow: 'hidden'
};

// ─── Sub-components ─────────────────────────────────────────────

function StatCard({ icon, iconBg, iconColor, label, value }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 50, height: 50, borderRadius: 14, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
        <h3 style={{ fontSize: 26, fontWeight: 900, color: '#1e293b', margin: '2px 0 0', lineHeight: 1 }}>{value}</h3>
      </div>
    </div>
  );
}

function FilterInput({ icon, placeholder, value, onChange, label }) {
  return (
    <div style={{ flex: '1 1 160px', minWidth: 140 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>{icon}</span>
        <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, paddingLeft: 36 }} />
      </div>
    </div>
  );
}

function ActionBtn({ onClick, title, color, bg, children }) {
  return (
    <button title={title} onClick={onClick} style={{ width: 32, height: 32, borderRadius: 8, background: bg, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color }} onMouseEnter={e => e.currentTarget.style.opacity = '0.75'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
      {children}
    </button>
  );
}

function SectionTitle({ icon, title, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ color }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
    </div>
  );
}

function DetailRow({ label, value, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: '#94a3b8' }}>{icon}</span>
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, minWidth: 80, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{value}</span>
    </div>
  );
}

function InfoTile({ label, value, icon }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ color: '#94a3b8' }}>{icon}</span>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: '2px 0 0' }}>{value}</p>
      </div>
    </div>
  );
}

function DoseCell({ active }) {
  return (
    <td style={{ padding: '10px 12px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
      {active
        ? <CheckCircle2 size={16} color="#16a34a" />
        : <X size={16} color="#e2e8f0" />
      }
    </td>
  );
}
