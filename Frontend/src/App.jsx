import React, { useState, useEffect, useCallback, useContext } from 'react';
import toast from 'react-hot-toast';

// Data imports
import {
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_DEPARTMENTS,
  INITIAL_SERVICES
} from './data/initialData';

// Shared component imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Logo from './components/Logo';
import { LanguageProvider, LanguageContext } from './contexts/LanguageContext';
import { t } from './i18n';
import { getAuthHeaders } from './utils/auth';

import LanguageSwitcher from './components/LanguageSwitcher';

// Patient page imports
import Home from './user/Home';
import About from './user/About';
import Services from './user/Services';
import Contact from './user/Contact';
import BookAppointment from './user/BookAppointment';

// Admin page imports
import AdminDashboard from './admin/AdminDashboard';
import AdminAppointments from './admin/AdminAppointments';
import AdminDoctors from './admin/AdminDoctors';
import AdminPatients from './admin/AdminPatients';
import AdminPrescriptions from './admin/AdminPrescriptions';
import AdminDoctorSchedules from './admin/AdminDoctorSchedules';
import AdminBilling from './admin/AdminBilling';
import AdminReports from './admin/AdminReports';
import AdminServices from './admin/AdminServices';
import AdminGallery from './admin/AdminGallery';
import AdminUsers from './admin/AdminUsers';
import AdminSettings from './admin/AdminSettings';
import AdminInventory from './admin/AdminInventory';
import AdminPurchases from './admin/AdminPurchases';
import AdminSuppliers from './admin/AdminSuppliers';
// Doctor page imports
import DoctorDashboard from './doctor/DoctorDashboard';

// Login page imports
import AdminLogin from './pages/AdminLogin';
import DoctorLogin from './pages/DoctorLogin';

// ---------- Hash-based Router Helpers ----------
function getHash() {
  return window.location.hash.replace(/^#/, '') || '/';
}

function navigate(path) {
  window.location.hash = path;
}

// ---------- Initial Mock Data ----------
const INITIAL_PATIENTS = [
  { id: 'P001', name: 'Rahul Patil', age: '28', gender: 'Male', mobile: '9922334455', date: '15 May 2024' },
  { id: 'P002', name: 'Sneha Deshmukh', age: '24', gender: 'Female', mobile: '8765432109', date: '15 May 2024' },
  { id: 'P003', name: 'Sagar More', age: '35', gender: 'Male', mobile: '7447788999', date: '14 May 2024' },
  { id: 'P004', name: 'Rohan Tayade', age: '18', gender: 'Male', mobile: '9156784321', date: '14 May 2024' },
  { id: 'P005', name: 'Pooja Kharat', age: '27', gender: 'Female', mobile: '9090909090', date: '13 May 2024' }
];

const INITIAL_REPORTS = [
  { id: 'R001', patientName: 'Rahul Patil', reportName: 'Audio Test Report', date: '15 May 2024' },
  { id: 'R002', patientName: 'Sneha Deshmukh', reportName: 'X-Ray PNS', date: '15 May 2024' },
  { id: 'R003', patientName: 'Sagar More', reportName: 'Endoscopy Report', date: '15 May 2024' },
  { id: 'R004', patientName: 'Rohan Tayade', reportName: 'Hearing Test', date: '14 May 2024' },
  { id: 'R005', patientName: 'Pooja Kharat', reportName: 'Blood Report', date: '14 May 2024' }
];

// ---------- Sidebar Navigation Items ----------
const ADMIN_NAV_ITEMS = [
  { key: 'dashboard',     label: 'Dashboard',      icon: '📊', hash: '/admin' },
  { key: 'appointments',  label: 'Appointments',   icon: '📅', hash: '/admin/appointments' },
  { key: 'patients',      label: 'Patients',       icon: '👥', hash: '/admin/patients' },
  { key: 'doctors',       label: 'Doctors',        icon: '🩺', hash: '/admin/doctors' },
  { key: 'prescriptions', label: 'Prescriptions',  icon: '💊', hash: '/admin/prescriptions' },
  { key: 'schedules', label: 'Schedules', icon: '⏰', hash: '/admin/schedules' },
  { key: 'billing',       label: 'Billing',        icon: '💰', hash: '/admin/billing' },
  { key: 'reports',       label: 'Reports',        icon: '📄', hash: '/admin/reports' },
  { key: 'inventory',     label: 'Inventory',      icon: '📦', hash: '/admin/inventory' },
  { key: 'purchases',     label: 'Purchases',      icon: '🛒', hash: '/admin/purchases' },
  { key: 'suppliers',     label: 'Suppliers',      icon: '🏭', hash: '/admin/suppliers' },
  { key: 'services',      label: 'Services',       icon: '🏥', hash: '/admin/services' },
  { key: 'gallery',       label: 'Gallery',        icon: '🖼️', hash: '/admin/gallery' },
  { key: 'users',         label: 'Users',          icon: '👤', hash: '/admin/users' },
  { key: 'settings',      label: 'Settings',       icon: '⚙️', hash: '/admin/settings' },
];

// ---------- Admin Portal Shell with Sidebar ----------
function AdminPortal({
  appointments, doctors, patients, reports, prescriptions, bills,
  addDoctor, editDoctor, deleteDoctor,
  addPatient, editPatient, deletePatient,
  updateAppointmentStatus, deleteAppointment, addAppointment, editAppointment,
  savePrescription, saveBill, addReport,
  onLogout, hash
}) {
  const { lang } = useContext(LanguageContext);
  // ----- Dashboard data fetched from backend -----
  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: [],
    recentPatients: [],
    totalPatients: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetch('http://localhost:8080/dashboard', { headers: { ...getAuthHeaders() } })
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(() => toast.error(String('Failed to load dashboard data')));
  }, []);

  // Determine active admin tab from hash
  const getAdminTab = () => {
    if (hash.startsWith('/admin/appointments'))  return 'appointments';
    if (hash.startsWith('/admin/patients'))      return 'patients';
    if (hash.startsWith('/admin/doctors'))       return 'doctors';
    if (hash.startsWith('/admin/prescriptions')) return 'prescriptions';
    if (hash.startsWith('/admin/schedules'))     return 'schedules';
    if (hash.startsWith('/admin/billing'))       return 'billing';
    if (hash.startsWith('/admin/reports'))       return 'reports';
    if (hash.startsWith('/admin/inventory'))      return 'inventory';
    if (hash.startsWith('/admin/purchases'))     return 'purchases';
    if (hash.startsWith('/admin/suppliers'))     return 'suppliers';
    if (hash.startsWith('/admin/services'))      return 'services';
    if (hash.startsWith('/admin/gallery'))       return 'gallery';
    if (hash.startsWith('/admin/users'))         return 'users';
    if (hash.startsWith('/admin/settings'))      return 'settings';
    return 'dashboard';
  };
  const adminTab = getAdminTab();

  const setAdminTab = (tab) => {
    const item = ADMIN_NAV_ITEMS.find(n => n.key === tab);
    if (item) navigate(item.hash);
  };

  return (<LanguageProvider>
    <div className="min-h-screen bg-[#F3F6F9] flex">
      
      {/* ===== Left Sidebar ===== */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 bottom-0 z-50 shadow-sm">
        
        {/* Sidebar Brand Logo */}
        <div className="px-4 py-4 border-b border-gray-100">
          {/* <div
            className="cursor-pointer flex items-center"
            onClick={() => setAdminTab('dashboard')}
          >
            <Logo showText={true} imgClassName="h-20" />
          </div> */}
          <div
  className="cursor-pointer flex items-center"
  onClick={() => navigate('/admin')}
>
    <Logo showText={true} imgClassName="h-20" />
</div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = adminTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setAdminTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#0B2C56] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#0B2C56]'
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span>{t(`sidebar.${item.key}`, lang)}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <span className="text-base w-5 text-center">🚪</span>
            <span>{t('header.logout', lang)}</span>
          </button>
          <LanguageSwitcher />
        </div>
      </aside>

      {/* ===== Main Content Area ===== */}
      <main className="flex-1 ml-56 bg-[#F3F6F9] min-h-screen">
        
        {/* Top Toolbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-[#0B2C56] capitalize">{adminTab}</h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold transition items-center gap-1.5 hidden sm:inline-flex"
            >
              🏥 Patient Site
            </a>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0B2C56] text-white flex items-center justify-center text-xs font-bold">A</div>
              <span className="text-xs font-bold text-gray-600 hidden md:block">Admin</span>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-gray-400 hover:text-rose-600 cursor-pointer transition"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          {adminTab === 'dashboard' && (
            <AdminDashboard 
                appointments={appointments} 
                doctors={doctors} 
                setAdminTab={setAdminTab} 
                dashboardData={dashboardData}
            />
          )}
          {adminTab === 'appointments' && (
            <AdminAppointments
              appointments={appointments}
              updateAppointmentStatus={updateAppointmentStatus}
              deleteAppointment={deleteAppointment}
              addAppointment={addAppointment}
              editAppointment={editAppointment}
              patients={patients}
            />
          )}
          {adminTab === 'patients' && (
            <AdminPatients
              patients={patients}
              addPatient={addPatient}
              editPatient={editPatient}
              deletePatient={deletePatient}
            />
          )}
          {adminTab === 'doctors' && (
            <AdminDoctors
              doctors={doctors}
              addDoctor={addDoctor}
              editDoctor={editDoctor}
              deleteDoctor={deleteDoctor}
              departments={INITIAL_DEPARTMENTS}
              setAdminTab={setAdminTab}
            />
          )}
            {adminTab === 'prescriptions' && (
              <AdminPrescriptions
                patients={patients}
                appointments={appointments}
                savePrescription={savePrescription}
                prescriptions={prescriptions}
                hash={hash}
              />
            )}
            {adminTab === 'schedules' && (
              <AdminDoctorSchedules
                doctors={doctors}
              />
            )}
          {adminTab === 'billing' && (
            <AdminBilling
              patients={patients}
              saveBill={saveBill}
              bills={bills}
              hash={hash}
            />
          )}
          {adminTab === 'reports' && (
            <AdminReports
              reports={reports}
              addReport={addReport}
              patients={patients}
            />
          )}
                      {adminTab === 'inventory' && (
              <AdminInventory />
            )}
            {adminTab === 'purchases' && <AdminPurchases />}
                {adminTab === 'suppliers' && <AdminSuppliers />}
                {adminTab === 'services' && <AdminServices />}
          {adminTab === 'gallery' && <AdminGallery />}
          {adminTab === 'users' && <AdminUsers />}
          {adminTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  </LanguageProvider>);
}

// ---------- Doctor Portal Shell ----------
function DoctorPortal({ doctors, appointments, resolveAppointment, loggedInDoctorId, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#0B2C56] text-white shadow-md border-b border-[#12396b] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
         <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/doctor')}
          >
            <div className="bg-white px-3 py-1 rounded-xl shadow-sm">
              <Logo showText={true} imgClassName="h-10" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="#/" className="hidden sm:inline-flex px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/10 transition items-center gap-1.5">
              🏥 Patient Site
            </a>
            <button onClick={onLogout} className="px-3.5 py-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5">
              <span>🚪</span><span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-white">
        <DoctorDashboard
          doctors={doctors}
          appointments={appointments}
          resolveAppointment={resolveAppointment}
          loggedInDoctorId={loggedInDoctorId}
        />
      </main>
    </div>
  );
}

// ---------- Patient Site Shell ----------
function PatientSite({ doctors, departments, services, appointments, handleBookAppointment, hash }) {
  const getTab = () => {
    if (hash === '/' || hash === '') return 'home';
    if (hash.startsWith('/about')) return 'about';
    if (hash.startsWith('/services')) return 'services';
    if (hash.startsWith('/contact')) return 'contact';
    if (hash.startsWith('/book-appointment')) return 'book-appointment';
    return 'home';
  };
  const patientTab = getTab();
  const setCurrentTab = (tab) => {
    if (tab === 'home') navigate('/');
    else navigate('/' + tab);
  };

  const [selectedDoctorName, setSelectedDoctorName] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar currentTab={patientTab} setCurrentTab={setCurrentTab} />
      <main className="flex-1 bg-white">
        {patientTab === 'home' && (
          <Home
            setCurrentTab={setCurrentTab}
            doctors={doctors}
            departments={departments}
            handleBookAppointment={handleBookAppointment}
          />
        )}
        {patientTab === 'about' && <About setCurrentTab={setCurrentTab} />}
        {patientTab === 'services' && <Services services={services} setCurrentTab={setCurrentTab} />}
        {patientTab === 'contact' && <Contact />}
        {patientTab === 'book-appointment' && (
          <BookAppointment
            doctors={doctors}
            departments={departments}
            handleBookAppointment={handleBookAppointment}
            selectedDoctorName={selectedDoctorName}
            setSelectedDoctorName={setSelectedDoctorName}
          />
        )}
      </main>
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}

// ==========================================================
// ROOT APP
// ==========================================================
function App() {
  // ---------- Hash routing state ----------
  const [hash, setHash] = useState(getHash);

  useEffect(() => {
    const onHashChange = () => setHash(getHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ---------- Auth state ----------
  const [adminAuthed, setAdminAuthed] = useState(() => sessionStorage.getItem('shinde_admin_auth') === 'true');
  const [doctorAuthed, setDoctorAuthed] = useState(() => sessionStorage.getItem('shinde_doctor_auth') === 'true');
  const [loggedInDoctorId, setLoggedInDoctorId] = useState(() => {
    const id = sessionStorage.getItem('shinde_doctor_id');
    return id ? Number(id) : null;
  });

  // ---------- Database state ----------

  

  // ---------- Database state ----------
  const [patients, setPatients] = useState([]);
  // ---------- Doctors state ----------
  const [doctors, setDoctors] = useState(() => {
    const local = localStorage.getItem('shinde_hospital_doctors');
    return local ? JSON.parse(local) : INITIAL_DOCTORS;
  });
  // ---------- Appointments state ----------
  const [appointments, setAppointments] = useState(() => {
    const local = localStorage.getItem('shinde_hospital_appointments');
    return local ? JSON.parse(local) : [];
  });
  // Fetch data from backend on mount
  useEffect(() => {
    // Fetch doctors
    fetch('http://localhost:8080/doctor', { headers: { ...getAuthHeaders() } })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setDoctors(data);
      })
      .catch(e => toast.error(String('Failed to load doctors')));
      
    // Fetch patients
    fetch('http://localhost:8080/patients', { headers: { ...getAuthHeaders() } })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setPatients(data);
      })
      .catch(e => toast.error(String('Failed to load patients')));
  }, []);

  const [reports, setReports] = useState(() => {
    const local = localStorage.getItem('shinde_hospital_reports');
    return local ? JSON.parse(local) : INITIAL_REPORTS;
  });

  const [prescriptions, setPrescriptions] = useState(() => {
    const local = localStorage.getItem('shinde_hospital_prescriptions');
    return local ? JSON.parse(local) : [];
  });

  const [bills, setBills] = useState(() => {
    const local = localStorage.getItem('shinde_hospital_bills');
    return local ? JSON.parse(local) : [];
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('shinde_hospital_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('shinde_hospital_doctors', JSON.stringify(doctors)); }, [doctors]);
  useEffect(() => { localStorage.setItem('shinde_hospital_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('shinde_hospital_prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
  useEffect(() => { localStorage.setItem('shinde_hospital_bills', JSON.stringify(bills)); }, [bills]);

  // ---------- Appointment actions ----------
  const handleBookAppointment = useCallback((apptDetails) => {
    const newId = `APT${1000 + appointments.length + 1}`;
    setAppointments(prev => [{ id: newId, ...apptDetails, status: 'Pending', comments: '', prescription: '' }, ...prev]);
  }, [appointments.length]);

  const updateAppointmentStatus = useCallback((id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  }, []);

  const deleteAppointment = useCallback((id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  const addAppointment = useCallback((appt) => {
    setAppointments(prev => [appt, ...prev]);
  }, []);

  const editAppointment = useCallback((id, data) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, []);

  const resolveAppointment = useCallback((id, comments, prescription) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Completed', comments, prescription } : a));
  }, []);

  // ---------- Doctor CRUD ----------
  // ----- Doctor CRUD via backend API -----
  const addDoctor = useCallback(async (p) => {
    const doctorPayload = {
      name: p.name,
      email: p.email,
      password: "doctor123",
      specialization: p.specialty,
      qualification: p.department,
      experience: 1,
      phone: p.phone || ''
    };

    try {
      const res = await fetch('http://localhost:8080/doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(doctorPayload)
      });

      console.log("STATUS:", res.status);
      const text = await res.text();
      console.log("RESPONSE:", text);

      if (res.ok) {
        const newDoc = JSON.parse(text);
        setDoctors(prev => [...prev, newDoc]);
        toast.success("Doctor Added Successfully");
      } else {
        toast.error("Doctor Add Failed");
      }
    } catch (error) {
      toast.error(String(error));
    }
  }, []);

  const editDoctor = useCallback(async (id, p) => {
    try {
      const res = await fetch(`http://localhost:8080/doctor/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        const updated = await res.json();
        setDoctors(prev => prev.map(d => d.id === id ? updated : d));
      } else {
        toast.error(String('Failed to edit doctor'));
      }
    } catch (e) {
      toast.error(String(e));
    }
  }, []);

  const deleteDoctor = useCallback(async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/doctor/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
      if (res.ok) {
        setDoctors(prev => prev.filter(d => d.id !== id));
      } else {
        toast.error(String('Failed to delete doctor'));
      }
    } catch (e) {
      toast.error(String(e));
    }
  }, []);

  // ---------- Patient CRUD ----------
  const addPatient = useCallback(async (p) => {
    console.log("PATIENT SENT:", p);

    try {
      const res = await fetch('http://localhost:8080/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(p),
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RESPONSE:", text);

      if (res.ok) {
        const newPatient = JSON.parse(text);
        setPatients(prev => [...prev, newPatient]);
      }
    } catch (e) {
      toast.error(String(e));
    }
  }, []);

  const editPatient = useCallback(async (id, p) => {
    try {
      const res = await fetch(`http://localhost:8080/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        const updated = await res.json();
        setPatients(prev => prev.map(pt => pt.id === id ? updated : pt));
      } else {
        toast.error(String('Failed to edit patient'));
      }
    } catch (e) { toast.error(String(e)); }
  }, []);

  const deletePatient = useCallback(async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/patients/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
      if (res.ok) {
        setPatients(prev => prev.filter(pt => pt.id !== id));
      } else {
        toast.error(String('Failed to delete patient'));
      }
    } catch (e) { toast.error(String(e)); }
  }, []);

  // ---------- Prescriptions ----------
  const savePrescription = useCallback((p) => setPrescriptions(prev => [...prev, p]), []);

  // ---------- Billing ----------
  const saveBill = useCallback((b) => setBills(prev => [...prev, b]), []);

  // ---------- Reports ----------
  const addReport = useCallback((r) => setReports(prev => [...prev, r]), []);

  // ---------- Auth handlers ----------
  const handleAdminLogin = () => {
    setAdminAuthed(true);
    navigate('/admin');
  };

  const handleDoctorLogin = (docId) => {
    setDoctorAuthed(true);
    setLoggedInDoctorId(docId);
    navigate('/doctor');
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('shinde_admin_auth');
    setAdminAuthed(false);
    navigate('/admin/login');
  };

  const handleDoctorLogout = () => {
    sessionStorage.removeItem('shinde_doctor_auth');
    sessionStorage.removeItem('shinde_doctor_id');
    setDoctorAuthed(false);
    setLoggedInDoctorId(null);
    navigate('/doctor/login');
  };

  // ---------- Route rendering ----------
  // Admin routes
  if (hash.startsWith('/admin')) {
    // Force login if at base admin path or not authenticated
    if (!adminAuthed || hash === '/admin' || hash === '/admin/') {
      if (hash !== '/admin/login') navigate('/admin/login');
      return <AdminLogin onLoginSuccess={handleAdminLogin} />;
    }
    // Authenticated: render admin portal
    return (
      <AdminPortal
        hash={hash}
        appointments={appointments}
        doctors={doctors}
        patients={patients}
        reports={reports}
        prescriptions={prescriptions}
        bills={bills}
        addDoctor={addDoctor}
        editDoctor={editDoctor}
        deleteDoctor={deleteDoctor}
        addPatient={addPatient}
        editPatient={editPatient}
        deletePatient={deletePatient}
        updateAppointmentStatus={updateAppointmentStatus}
        deleteAppointment={deleteAppointment}
        addAppointment={addAppointment}
        editAppointment={editAppointment}
        savePrescription={savePrescription}
        saveBill={saveBill}
        addReport={addReport}
        onLogout={handleAdminLogout}
      />
    );
  }

  // Doctor routes
  if (hash.startsWith('/doctor')) {
    if (!doctorAuthed || hash === '/doctor/login') {
      return <DoctorLogin doctors={doctors} onLoginSuccess={handleDoctorLogin} />;
    }
    return (
      <DoctorPortal
        doctors={doctors}
        appointments={appointments}
        resolveAppointment={resolveAppointment}
        loggedInDoctorId={loggedInDoctorId}
        onLogout={handleDoctorLogout}
      />
    );
  }

  // Default: Patient-facing public site
  return (
    <PatientSite
      hash={hash}
      doctors={doctors}
      departments={INITIAL_DEPARTMENTS}
      services={INITIAL_SERVICES}
      appointments={appointments}
      handleBookAppointment={handleBookAppointment}
    />
  );
}

export default App;
