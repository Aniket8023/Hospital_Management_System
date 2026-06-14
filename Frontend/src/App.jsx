import React, { useState, useEffect, useCallback } from 'react';

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

// Doctor page imports
import DoctorDashboard from './doctor/DoctorDashboard';

// Login page imports
import AdminLogin from './pages/AdminLogin';
import DoctorLogin from './pages/DoctorLogin';

// ---------- Hash-based Router Helpers ----------
// Routes:
//   #/                   → Patient home
//   #/about              → Patient about
//   #/services           → Patient services
//   #/contact            → Patient contact
//   #/book-appointment   → Patient booking
//   #/admin/login        → Admin login
//   #/admin              → Admin dashboard (protected)
//   #/admin/appointments → Admin appointments (protected)
//   #/admin/doctors      → Admin doctors (protected)
//   #/doctor/login       → Doctor login
//   #/doctor             → Doctor workspace (protected)

function getHash() {
  // Return everything after '#', defaulting to '/'
  return window.location.hash.replace(/^#/, '') || '/';
}

function navigate(path) {
  window.location.hash = path;
}

// ---------- Portal Header ----------
function PortalHeader({ title, subtitle, onLogout }) {
  return (
    <header className="bg-[#0B2C56] text-white shadow-md border-b border-[#12396b] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-white p-1.5 rounded-lg">
            <Logo showText={false} />
          </div>
          <div className="text-left leading-tight">
            <span className="font-extrabold text-sm tracking-widest block text-white">SHINDE HOSPITAL</span>
            <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">{subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#/"
            className="hidden sm:inline-flex px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/10 transition items-center gap-1.5"
          >
            🏥 Patient Site
          </a>
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ---------- Admin Portal Shell ----------
function AdminPortal({ appointments, doctors, addDoctor, editDoctor, deleteDoctor, updateAppointmentStatus, updateAppointmentDateTime, onLogout, hash }) {
  // Determine active admin tab from hash
  const getAdminTab = () => {
    if (hash.startsWith('/admin/appointments')) return 'appointments';
    if (hash.startsWith('/admin/doctors')) return 'doctors';
    return 'dashboard';
  };
  const adminTab = getAdminTab();

  const setAdminTab = (tab) => {
    if (tab === 'dashboard')     navigate('/admin');
    if (tab === 'appointments')  navigate('/admin/appointments');
    if (tab === 'doctors')       navigate('/admin/doctors');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PortalHeader
        title="Admin"
        subtitle="Administrative Portal"
        onLogout={onLogout}
      />
      <main className="flex-1 bg-white">
        {adminTab === 'dashboard' && (
          <AdminDashboard appointments={appointments} doctors={doctors} setAdminTab={setAdminTab} />
        )}
        {adminTab === 'appointments' && (
          <AdminAppointments
            appointments={appointments}
            updateAppointmentStatus={updateAppointmentStatus}
            updateAppointmentDateTime={updateAppointmentDateTime}
            setAdminTab={setAdminTab}
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
      </main>
    </div>
  );
}

// ---------- Doctor Portal Shell ----------
function DoctorPortal({ doctors, appointments, resolveAppointment, loggedInDoctorId, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PortalHeader
        title="Doctor"
        subtitle="Clinical Workspace"
        onLogout={onLogout}
      />
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
  // Derive the current patient tab from the hash
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
  const [appointments, setAppointments] = useState(() => {
    const local = localStorage.getItem('shinde_hospital_appointments');
    return local ? JSON.parse(local) : INITIAL_APPOINTMENTS;
  });

  const [doctors, setDoctors] = useState(() => {
    const local = localStorage.getItem('shinde_hospital_doctors');
    return local ? JSON.parse(local) : INITIAL_DOCTORS;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('shinde_hospital_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('shinde_hospital_doctors', JSON.stringify(doctors));
  }, [doctors]);

  // ---------- Appointment actions ----------
  const handleBookAppointment = useCallback((apptDetails) => {
    const newId = `APT${1000 + appointments.length + 1}`;
    setAppointments(prev => [{ id: newId, ...apptDetails, status: 'Pending', comments: '', prescription: '' }, ...prev]);
  }, [appointments.length]);

  const updateAppointmentStatus = useCallback((id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  }, []);

  const updateAppointmentDateTime = useCallback((id, date, time) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, preferredDate: date, preferredTime: time } : a));
  }, []);

  const resolveAppointment = useCallback((id, comments, prescription) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Completed', comments, prescription } : a));
  }, []);

  // ---------- Doctor CRUD ----------
  const addDoctor    = useCallback((p) => setDoctors(prev => [...prev, { id: Math.max(...prev.map(d => d.id), 0) + 1, rating: 5.0, reviews: 0, ...p }]), []);
  const editDoctor   = useCallback((id, p) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...p } : d)), []);
  const deleteDoctor = useCallback((id) => setDoctors(prev => prev.filter(d => d.id !== id)), []);

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
    if (!adminAuthed || hash === '/admin/login') {
      return <AdminLogin onLoginSuccess={handleAdminLogin} />;
    }
    return (
      <AdminPortal
        hash={hash}
        appointments={appointments}
        doctors={doctors}
        addDoctor={addDoctor}
        editDoctor={editDoctor}
        deleteDoctor={deleteDoctor}
        updateAppointmentStatus={updateAppointmentStatus}
        updateAppointmentDateTime={updateAppointmentDateTime}
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
