import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import teamImg from '../assets/team.jpg';
import { showLocalStorageErrors } from '../utils/errors';

const API = 'http://localhost:8080';

export default function Home({ setCurrentTab }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Your Health Our Priority",
      description: "Highly advanced healthcare solutions with compassion and care.",
      bgImage: "https://images.unsplash.com/photo-1586773860418-d3b3da96a362?auto=format&fit=crop&q=80&w=1200&h=500",
      cta: "Book Appointment",
      tab: "book-appointment"
    },
    {
      title: "Advanced ENT Specialties",
      description: "State-of-the-art diagnostic and surgical technology for all ages.",
      bgImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200&h=500",
      cta: "Our Services",
      tab: "services"
    },
    {
      title: "Care With Compassion",
      description: "Consult with highly qualified, experienced doctors who put patients first.",
      bgImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200&h=500",
      cta: "Meet Doctors",
      tab: "doctors"
    }
  ];

  // Show local storage errors on mount
  useEffect(() => {
    showLocalStorageErrors();
  }, []);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full text-gray-800 font-sans pb-12">

      {/* 1. Hero Section (Slider) */}
      <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden bg-[#0B2C56]">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-left">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B2C56] leading-tight drop-shadow-xs">
                  {slide.title}
                </h1>
                <p className="mt-4 text-base md:text-xl text-gray-700 leading-relaxed font-medium">
                  {slide.description}
                </p>
                <button
                  onClick={() => setCurrentTab(slide.tab)}
                  className="mt-8 px-7 py-3 rounded-md bg-[#0B2C56] hover:bg-[#154175] text-white text-sm md:text-base font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/60 hover:bg-white text-[#0B2C56] shadow-md transition-colors cursor-pointer"
        >
          ❮
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/60 hover:bg-white text-[#0B2C56] shadow-md transition-colors cursor-pointer"
        >
          ❯
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-[#0B2C56] scale-125' : 'bg-gray-400/60'
                }`}
            ></button>
          ))}
        </div>
      </div>

      {/* 2. Key Badges / Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
            <div className="p-3 bg-blue-50 text-[#0B2C56] rounded-full text-2xl">🏥</div>
            <div>
              <h3 className="font-bold text-[#0B2C56] text-[15px]">Patient First</h3>
              <p className="text-gray-500 text-xs mt-1">Your health and well-being is our top most priority.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
            <div className="p-3 bg-blue-50 text-[#0B2C56] rounded-full text-2xl">🎓</div>
            <div>
              <h3 className="font-bold text-[#0B2C56] text-[15px]">Experienced Doctors</h3>
              <p className="text-gray-500 text-xs mt-1">Our team of expert doctors ensure the best treatment.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
            <div className="p-3 bg-blue-50 text-[#0B2C56] rounded-full text-2xl">⏳</div>
            <div>
              <h3 className="font-bold text-[#0B2C56] text-[15px]">24/7 Care</h3>
              <p className="text-gray-500 text-xs mt-1">We are always here for your emergency and critical care.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
            <div className="p-3 bg-blue-50 text-[#0B2C56] rounded-full text-2xl">⚙️</div>
            <div>
              <h3 className="font-bold text-[#0B2C56] text-[15px]">Modern Equipment</h3>
              <p className="text-gray-500 text-xs mt-1">We use advanced technology for better treatment.</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Vision Section (Founder details) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 py-12 bg-gray-50/50 rounded-2xl border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          <div className="rounded-xl overflow-hidden shadow-md border-4 border-white aspect-video md:aspect-auto md:h-80">
            <img
              src={teamImg}
              alt="Shinde Hospital Founders"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-left flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2C56] mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
              At Shinde Hospital, our vision is to provide exceptional healthcare services with compassion, innovation and integrity. We aim to build a healthier community by delivering world-class medical treatment at affordable costs. We specialize in ENT and neck conditions, ensuring that our patients receive top-tier specialist care in Satara.
            </p>
            <div className="border-l-4 border-[#2B9CB5] pl-4 py-1.5">
              <p className="font-bold text-[#0B2C56] text-[16px]">- Dr. Akshay Raju Shinde</p>
              <p className="text-gray-500 text-xs mt-0.5">Founder &amp; Managing Director</p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Quick Appointment Booking Form — fully API integrated */}
      <QuickAppointmentForm setCurrentTab={setCurrentTab} />

    </div>
  );
}

// ─── Quick Appointment Form with full API integration ────────────────────────
function QuickAppointmentForm({ setCurrentTab }) {
  const [apiFetchedDoctors, setApiFetchedDoctors] = useState([]);
  const [apiFetchedDepts, setApiFetchedDepts] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    aadharNumber: '',
    emailAddress: '',
    age: '',
    gender: '',
    address: '',
    department: '',
    doctorId: '',
    preferredDate: '',
    preferredTime: '',
    reasonForVisit: ''
  });

  // Fetch doctors from API on mount
  useEffect(() => {
    fetch(`${API}/doctor`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApiFetchedDoctors(data);
          // Extract unique departments/specializations from doctors
          const depts = [...new Set(
            data.map(d => d.specialization || d.department || '').filter(Boolean)
          )];
          setApiFetchedDepts(depts);
        }
      })
      .catch(err => toast.error(String('Failed to load doctors:')));
  }, []);

  // Fetch time slots when doctorId + date are both selected
  useEffect(() => {
    if (formData.doctorId && formData.preferredDate) {
      fetch(`${API}/doctor-schedule/slots?doctorId=${formData.doctorId}&date=${formData.preferredDate}`)
        .then(res => res.json())
        .then(data => setSlots(Array.isArray(data) ? data : []))
        .catch(err => {
          toast.error(String('Failed to load slots:'));
          setSlots([]);
        });
    } else {
      setSlots([]);
    }
  }, [formData.doctorId, formData.preferredDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    setFormError('');
  };

  const handleDepartmentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      department: e.target.value,
      doctorId: '',
      preferredTime: ''
    }));
    setSlots([]);
  };

  const handleDoctorChange = (e) => {
    setFormData(prev => ({
      ...prev,
      doctorId: e.target.value,
      preferredTime: ''
    }));
    setSlots([]);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.patientName.trim()) errs.patientName = 'Full Name is required';
    if (!formData.mobileNumber) {
      errs.mobileNumber = 'Mobile Number is required';
    } else if (formData.mobileNumber.length !== 10 || isNaN(formData.mobileNumber)) {
      errs.mobileNumber = 'Must be 10 digits';
    }
    if (!formData.aadharNumber) {
      errs.aadharNumber = 'Aadhar Number is required';
    } else if (formData.aadharNumber.length !== 12 || isNaN(formData.aadharNumber)) {
      errs.aadharNumber = 'Must be 12 digits';
    }
    if (!formData.age) errs.age = 'Age is required';
    if (!formData.gender) errs.gender = 'Gender is required';
    if (!formData.address) errs.address = 'Address is required';
    if (!formData.department) errs.department = 'Department is required';
    if (!formData.doctorId) errs.doctorId = 'Doctor is required';
    if (!formData.preferredDate) errs.preferredDate = 'Date is required';
    if (!formData.preferredTime) errs.preferredTime = 'Time Slot is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormError('Please fill all required fields correctly.');
      return;
    }

    // Exact same payload structure as BookAppointment.jsx
    const payload = {
      doctorId: Number(formData.doctorId),
      fullName: formData.patientName,
      mobileNumber: formData.mobileNumber,
      aadharNumber: formData.aadharNumber,
      age: Number(formData.age),
      gender: formData.gender,
      address: formData.address,
      appointmentDate: formData.preferredDate,
      appointmentTime: formData.preferredTime,
      problemDescription: formData.reasonForVisit
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
        setFormError('');
        setErrors({});
        setFormData({
          patientName: '', mobileNumber: '', aadharNumber: '', emailAddress: '',
          age: '', gender: '', address: '', department: '', doctorId: '',
          preferredDate: '', preferredTime: '', reasonForVisit: ''
        });
        setSlots([]);
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        const errText = await res.text();
        setFormError('Booking failed: ' + errText);
      }
    } catch (err) {
      toast.error(String(err));
      setFormError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter doctors by selected department
  const filteredDoctors = apiFetchedDoctors.filter(doc => {
    if (!formData.department) return true;
    const dept = formData.department.toLowerCase().trim();
    const spec = (doc.specialization || '').toLowerCase().trim();
    const docDept = (doc.department || '').toLowerCase().trim();
    return spec === dept || spec.includes(dept) || dept.includes(spec) || docDept.includes(dept);
  });

  const inputBase = 'w-full p-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400';
  const inputCls = (name) =>
    `${inputBase} ${errors[name] ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-200'}`;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="bg-[#f0f6fc] border border-blue-100 rounded-2xl p-6 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2C56] flex items-center justify-center gap-1.5">
            <span>Book An Appointment</span>
          </h2>
          <div className="flex justify-center items-center gap-2 mt-2">
            <span className="h-[2px] w-12 bg-blue-300"></span>
            <span className="text-[#0B2C56] text-xs">💙</span>
            <span className="h-[2px] w-12 bg-blue-300"></span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Quick booking — fill in your details and we'll confirm your appointment.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
            <span className="text-5xl inline-block">🎉</span>
            <h3 className="text-emerald-800 font-bold text-lg">Appointment Booked Successfully!</h3>
            <p className="text-emerald-600 text-sm">Our team will contact you shortly to confirm your appointment.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Book Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 text-left">
                ⚠️ {formError}
              </div>
            )}

            {/* Row 1: Name, Mobile, Aadhar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text" name="patientName" value={formData.patientName}
                  onChange={handleInputChange} placeholder="Enter your full name"
                  className={inputCls('patientName')}
                />
                {errors.patientName && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.patientName}</span>}
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number *</label>
                <input
                  type="tel" name="mobileNumber" value={formData.mobileNumber}
                  onChange={handleInputChange} placeholder="10-digit number" maxLength="10"
                  className={inputCls('mobileNumber')}
                />
                {errors.mobileNumber && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.mobileNumber}</span>}
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Aadhar Number *</label>
                <input
                  type="text" name="aadharNumber" value={formData.aadharNumber}
                  onChange={handleInputChange} placeholder="12-digit Aadhar" maxLength="12"
                  className={inputCls('aadharNumber')}
                />
                {errors.aadharNumber && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.aadharNumber}</span>}
              </div>
            </div>

            {/* Row 2: Age, Gender, Address, Email */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Age *</label>
                <input
                  type="number" name="age" value={formData.age}
                  onChange={handleInputChange} placeholder="Age"
                  className={inputCls('age')} min="1" max="120"
                />
                {errors.age && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.age}</span>}
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputCls('gender')}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.gender}</span>}
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address *</label>
                <input
                  type="text" name="address" value={formData.address}
                  onChange={handleInputChange} placeholder="City / Area"
                  className={inputCls('address')}
                />
                {errors.address && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.address}</span>}
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <input
                  type="email" name="emailAddress" value={formData.emailAddress}
                  onChange={handleInputChange} placeholder="Optional"
                  className={`${inputBase} border-gray-200`}
                />
              </div>
            </div>

            {/* Row 3: Department, Doctor, Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Department *</label>
                <select
                  name="department" value={formData.department}
                  onChange={handleDepartmentChange} className={inputCls('department')}
                >
                  <option value="">-- Select Department --</option>
                  {apiFetchedDepts.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.department}</span>}
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Select Doctor *</label>
                <select
                  name="doctorId" value={formData.doctorId}
                  onChange={handleDoctorChange} className={inputCls('doctorId')}
                >
                  <option value="">-- Select Doctor --</option>
                  {filteredDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.user?.name || doc.name}</option>
                  ))}
                </select>
                {errors.doctorId && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.doctorId}</span>}
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Preferred Date *</label>
                <input
                  type="date" name="preferredDate" value={formData.preferredDate}
                  onChange={handleInputChange} min={today}
                  className={`${inputCls('preferredDate')} cursor-pointer`}
                />
                {errors.preferredDate && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.preferredDate}</span>}
              </div>
            </div>

            {/* Row 4: Time Slot + Reason */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Time Slot *
                  {formData.doctorId && formData.preferredDate && slots.length === 0 && (
                    <span className="text-gray-400 font-normal ml-1 text-[10px]">(loading...)</span>
                  )}
                </label>
                <select
                  name="preferredTime" value={formData.preferredTime}
                  onChange={handleInputChange}
                  className={`${inputCls('preferredTime')} cursor-pointer`}
                  disabled={!formData.doctorId || !formData.preferredDate}
                >
                  <option value="">-- Select Time Slot --</option>
                  {slots.length > 0 ? (
                    slots.map((slot, index) => {
                      const timeStr = typeof slot === 'object' ? slot.slotTime : slot;
                      const isAvailable = typeof slot === 'object' ? slot.available : true;
                      return (
                        <option key={index} value={timeStr} disabled={!isAvailable}>
                          {timeStr}{!isAvailable ? ' (Booked)' : ''}
                        </option>
                      );
                    })
                  ) : (
                    <option value="" disabled>
                      {formData.doctorId && formData.preferredDate
                        ? 'No slots available'
                        : 'Select doctor & date first'}
                    </option>
                  )}
                </select>
                {errors.preferredTime && <span className="text-[10px] text-rose-500 mt-1 font-semibold block">⚠️ {errors.preferredTime}</span>}
              </div>

              <div className="text-left md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Reason for Visit (Optional)</label>
                <input
                  type="text" name="reasonForVisit" value={formData.reasonForVisit}
                  onChange={handleInputChange}
                  placeholder="Briefly describe symptoms or reason for visit"
                  className={`${inputBase} border-gray-200`}
                />
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg bg-[#0B2C56] hover:bg-[#154175] disabled:opacity-50 text-white text-[15px] font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                {isSubmitting ? '⏳ Booking...' : '📅 Book Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
