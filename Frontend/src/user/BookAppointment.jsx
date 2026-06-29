import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';

export default function BookAppointment({
  departments,
  selectedDoctorName,
  setSelectedDoctorName
}) {
  const API = 'http://localhost:8080';

  // State
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    aadharNumber: '',
    emailAddress: '',
    department: '',
    doctorId: '',
    preferredDate: '',
    preferredTime: '',
    reasonForVisit: '',
    age: '',
    gender: '',
    address: ''
  });

  // Step 1: Load Doctors From Backend
  useEffect(() => {
    fetch(`${API}/doctor`, {
      headers: { ...getAuthHeaders() }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDoctors(data);
      })
      .catch(err => console.error(err));
  }, []);

  // Pre-fill doctor if passed from prop
  useEffect(() => {
    if (selectedDoctorName && doctors.length > 0) {
      const doc = doctors.find(d => d.user?.name === selectedDoctorName || d.name === selectedDoctorName);
      if (doc) {
        setFormData(prev => ({
          ...prev,
          doctorId: doc.id,
          department: doc.department || ''
        }));
      }
      setSelectedDoctorName('');
    }
  }, [selectedDoctorName, doctors, setSelectedDoctorName]);

  // Step 4: Load Slots automatically
  useEffect(() => {
    if (formData.doctorId && formData.preferredDate) {
      fetch(`${API}/doctor-schedule/slots?doctorId=${formData.doctorId}&date=${formData.preferredDate}`, {
        headers: { ...getAuthHeaders() }
      })
        .then(res => res.json())
        .then(data => setSlots(data))
        .catch(err => console.error(err));
    } else {
      setSlots([]); // clear slots if doc or date missing
    }
  }, [formData.doctorId, formData.preferredDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setFormData(prev => ({
      ...prev,
      department: dept,
      doctorId: '', 
      preferredTime: '' 
    }));
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.patientName.trim()) tempErrors.patientName = "Full Name is required";
    
    if (!formData.mobileNumber) {
      tempErrors.mobileNumber = "Mobile Number is required";
    } else if (formData.mobileNumber.length !== 10 || isNaN(formData.mobileNumber)) {
      tempErrors.mobileNumber = "Must be 10 digits";
    }

    if (!formData.aadharNumber) {
      tempErrors.aadharNumber = "Aadhar Number is required";
    } else if (formData.aadharNumber.length !== 12 || isNaN(formData.aadharNumber)) {
      tempErrors.aadharNumber = "Must be 12 digits";
    }

    if (!formData.age) tempErrors.age = "Age is required";
    if (!formData.gender) tempErrors.gender = "Gender is required";
    if (!formData.address) tempErrors.address = "Address is required";
    if (!formData.department) tempErrors.department = "Department is required";
    if (!formData.doctorId) tempErrors.doctorId = "Doctor is required";
    if (!formData.preferredDate) tempErrors.preferredDate = "Date is required";
    if (!formData.preferredTime) tempErrors.preferredTime = "Time is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Step 6: Submit API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          patientName: '', mobileNumber: '', aadharNumber: '', emailAddress: '',
          department: '', doctorId: '', preferredDate: '', preferredTime: '',
          reasonForVisit: '', age: '', gender: '', address: ''
        });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        const errText = await res.text();
        alert("Booking failed: " + errText);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (name) => `w-full pl-9 p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 ${
    errors[name] ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'
  }`;

  return (
    <div className="w-full text-gray-800 font-sans pb-16">
      <div className="bg-gradient-to-r from-[#0B2C56] to-[#1a4b87] text-white py-14 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide">
          Book Appointment
        </h1>
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="h-[2px] w-12 bg-blue-300"></span>
          <span className="text-white text-xs">💙</span>
          <span className="h-[2px] w-12 bg-blue-300"></span>
        </div>
        <p className="mt-3 text-xs md:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Schedule your visit with our specialists and take the first step towards better health.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs text-left">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <span className="text-2xl bg-blue-50 p-2 rounded-lg text-[#0B2C56]">📅</span>
              <div>
                <h3 className="font-extrabold text-[#0B2C56] text-base md:text-lg">Appointment Details</h3>
                <p className="text-gray-400 text-[10px] font-semibold mt-0.5">Please fill in correct patient information</p>
              </div>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-8 rounded-xl text-center space-y-4 animate-fadeIn">
                <span className="text-5xl inline-block">📋</span>
                <h3 className="font-bold text-xl text-emerald-800">Booking Request Placed!</h3>
                <p className="text-sm text-emerald-600 max-w-md mx-auto leading-relaxed">
                  Your appointment has been successfully booked in the system.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Full Name *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">👤</span>
                      <input
                        type="text" name="patientName" value={formData.patientName} onChange={handleInputChange}
                        placeholder="Enter your full name" className={inputClass('patientName')}
                      />
                    </div>
                    {errors.patientName && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.patientName}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Mobile Number *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">📞</span>
                      <input
                        type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange}
                        placeholder="Enter 10 digit mobile" maxLength="10" className={inputClass('mobileNumber')}
                      />
                    </div>
                    {errors.mobileNumber && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.mobileNumber}</span>}
                  </div>
                </div>

                {/* Aadhar & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Aadhar Number *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">💳</span>
                      <input
                        type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange}
                        placeholder="12 digit Aadhar" maxLength="12" className={inputClass('aadharNumber')}
                      />
                    </div>
                    {errors.aadharNumber && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.aadharNumber}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">✉️</span>
                      <input
                        type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange}
                        placeholder="Optional" className="w-full pl-9 p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Age, Gender, Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Age *</label>
                    <input
                      type="number" name="age" value={formData.age} onChange={handleInputChange}
                      placeholder="Age" className={`w-full p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 ${errors.age ? 'border-rose-400' : 'border-gray-200'}`}
                    />
                    {errors.age && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.age}</span>}
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Gender *</label>
                    <select
                      name="gender" value={formData.gender} onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 ${errors.gender ? 'border-rose-400' : 'border-gray-200'}`}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.gender}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Address *</label>
                    <input
                      type="text" name="address" value={formData.address} onChange={handleInputChange}
                      placeholder="City/Area" className={`w-full p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 ${errors.address ? 'border-rose-400' : 'border-gray-200'}`}
                    />
                    {errors.address && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.address}</span>}
                  </div>
                </div>

                {/* Department & Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Department *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">🏥</span>
                      <select
                        name="department" value={formData.department} onChange={handleDepartmentChange}
                        className={inputClass('department')}
                      >
                        <option value="">-- Select Department --</option>
                        {departments?.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    {errors.department && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.department}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Select Doctor *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">🩺</span>
                      <select
                        name="doctorId" value={formData.doctorId} onChange={handleInputChange}
                        className={inputClass('doctorId')}
                      >
                        <option value="">-- Select Doctor --</option>
                        {doctors
                          .filter(doc => {
                            if (!formData.department) return true;
                            const dept = formData.department.toLowerCase().trim();
                            const spec = (doc.specialization || '').toLowerCase().trim();
                            const docDept = (doc.department || '').toLowerCase().trim();
                            return spec === dept || spec.includes(dept) || dept.includes(spec) || docDept.includes(dept);
                          })
                          .map((doc) => (
                            <option key={doc.id} value={doc.id}>{doc.user?.name || doc.name}</option>
                          ))}
                      </select>
                    </div>
                    {errors.doctorId && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.doctorId}</span>}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Preferred Date *</label>
                    <input
                      type="date" name="preferredDate" value={formData.preferredDate} onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 cursor-pointer ${errors.preferredDate ? 'border-rose-400' : 'border-gray-200'}`}
                    />
                    {errors.preferredDate && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.preferredDate}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Preferred Time Slot *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">⏰</span>
                      <select
                        name="preferredTime" value={formData.preferredTime} onChange={handleInputChange}
                        className={inputClass('preferredTime')}
                        disabled={!formData.doctorId || !formData.preferredDate}
                      >
                        <option value="">-- Select Time Slot --</option>
                        {slots.length > 0 ? (
                          slots.map((slot, index) => {
                            const timeStr = typeof slot === 'object' ? slot.slotTime : slot;
                            const isAvailable = typeof slot === 'object' ? slot.available : true;
                            return (
                              <option key={index} value={timeStr} disabled={!isAvailable}>
                                {timeStr} {!isAvailable ? "(Booked)" : ""}
                              </option>
                            );
                          })
                        ) : (
                          <option value="" disabled>No slots available</option>
                        )}
                      </select>
                    </div>
                    {errors.preferredTime && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.preferredTime}</span>}
                  </div>
                </div>

                {/* Reason */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-600 mb-1">Reason for Visit</label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-gray-400 text-sm">✏️</span>
                    <textarea
                      name="reasonForVisit" value={formData.reasonForVisit} onChange={handleInputChange}
                      rows="3" placeholder="Briefly describe your symptoms"
                      className="w-full pl-9 p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400 resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-gray-400 text-[10.5px] font-semibold">
                    * All fields marked with an asterisk (*) are required.
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-[#0B2C56] hover:bg-[#154175] disabled:opacity-50 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? '⏳ Booking...' : '📅 Book Appointment'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs text-left space-y-5">
              <h3 className="font-extrabold text-[#0B2C56] text-base border-b border-gray-100 pb-2.5">
                Why Book With Us?
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-lg bg-blue-50 text-[#0B2C56] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Expert Doctors</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5 leading-snug">Consult with highly qualified specialists.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg bg-blue-50 text-[#0B2C56] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Easy & Quick Booking</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5 leading-snug">Book your appointment in just a few clicks.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg bg-blue-50 text-[#0B2C56] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Patient First Approach</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5 leading-snug">Your comfort and wellness is our priority.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#f0f6fc] border border-blue-100 rounded-2xl p-6 text-left flex gap-4 items-center">
              <span className="text-3xl">📞</span>
              <div>
                <h4 className="font-bold text-[#0B2C56] text-xs uppercase tracking-wider">Need Help?</h4>
                <p className="font-black text-[#0B2C56] text-base mt-0.5">8888551743</p>
                <p className="text-gray-400 text-[9px] mt-1 font-semibold">We are here to assist you!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
