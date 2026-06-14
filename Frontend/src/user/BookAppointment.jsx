import React, { useState, useEffect } from 'react';

export default function BookAppointment({
  doctors,
  departments,
  handleBookAppointment,
  selectedDoctorName,
  setSelectedDoctorName
}) {
  // Local Form state
  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    aadharNumber: '',
    emailAddress: '',
    department: '',
    selectDoctor: '',
    preferredDate: '',
    preferredTime: '',
    reasonForVisit: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // If a doctor was selected from the Doctor list page, auto-fill it
  useEffect(() => {
    if (selectedDoctorName) {
      const doc = doctors.find(d => d.name === selectedDoctorName);
      if (doc) {
        setFormData(prev => ({
          ...prev,
          selectDoctor: doc.name,
          department: doc.department
        }));
      }
      // Clear selection helper so it doesn't override future edits
      setSelectedDoctorName('');
    }
  }, [selectedDoctorName, doctors, setSelectedDoctorName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setFormData(prev => ({
      ...prev,
      department: dept,
      selectDoctor: '', // Reset doctor when dept changes
      preferredTime: '' // Reset slot
    }));
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.patientName.trim()) tempErrors.patientName = "Full Name is required";
    
    // Mobile Validation
    if (!formData.mobileNumber) {
      tempErrors.mobileNumber = "Mobile Number is required";
    } else if (formData.mobileNumber.length !== 10 || isNaN(formData.mobileNumber)) {
      tempErrors.mobileNumber = "Mobile Number must be exactly 10 digits";
    }

    // Aadhar Validation
    if (!formData.aadharNumber) {
      tempErrors.aadharNumber = "Aadhar Number is required";
    } else if (formData.aadharNumber.length !== 12 || isNaN(formData.aadharNumber)) {
      tempErrors.aadharNumber = "Aadhar Number must be exactly 12 digits";
    }

    if (!formData.department) tempErrors.department = "Department is required";
    if (!formData.selectDoctor) tempErrors.selectDoctor = "Doctor is required";
    if (!formData.preferredDate) tempErrors.preferredDate = "Preferred Date is required";
    if (!formData.preferredTime) tempErrors.preferredTime = "Preferred Time is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Call the parent state handler to save the appointment
    handleBookAppointment(formData);

    setSubmitted(true);
    // Reset Form
    setFormData({
      patientName: '',
      mobileNumber: '',
      aadharNumber: '',
      emailAddress: '',
      department: '',
      selectDoctor: '',
      preferredDate: '',
      preferredTime: '',
      reasonForVisit: ''
    });

    // Reset success banner after 6 seconds
    setTimeout(() => setSubmitted(false), 6000);
  };

  // Get active doctor's time slots
  const activeDoc = doctors.find(d => d.name === formData.selectDoctor);
  const timeSlots = activeDoc ? activeDoc.timeSlots : [];

  return (
    <div className="w-full text-gray-800 font-sans pb-16">
      
      {/* 1. Header Banner */}
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
          
          {/* 2. Main Appointment Form Block (Cols 2/3) */}
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
                  Your appointment has been logged in the system as <strong>Pending</strong>. An administrator will review details shortly to confirm.
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
                
                {/* Row 1: Full Name & Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Full Name *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">👤</span>
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`w-full pl-9 p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 ${
                          errors.patientName ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                      />
                    </div>
                    {errors.patientName && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.patientName}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Mobile Number *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">📞</span>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="Enter 10 digit mobile number"
                        maxLength="10"
                        className={`w-full pl-9 p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 ${
                          errors.mobileNumber ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                      />
                    </div>
                    {errors.mobileNumber && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.mobileNumber}</span>}
                  </div>
                </div>

                {/* Row 2: Aadhar Number & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Aadhar Number *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">💳</span>
                      <input
                        type="text"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        placeholder="Enter 12 digit Aadhar number"
                        maxLength="12"
                        className={`w-full pl-9 p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 ${
                          errors.aadharNumber ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                      />
                    </div>
                    {errors.aadharNumber && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.aadharNumber}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">✉️</span>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="w-full pl-9 p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Select Doctor & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Department *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">🏥</span>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleDepartmentChange}
                        className={`w-full pl-9 p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 cursor-pointer appearance-none ${
                          errors.department ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                      >
                        <option value="">-- Select Department --</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <span className="absolute right-3.5 inset-y-0 flex items-center text-gray-400 pointer-events-none text-xs">▼</span>
                    </div>
                    {errors.department && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.department}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Select Doctor *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">🩺</span>
                      <select
                        name="selectDoctor"
                        value={formData.selectDoctor}
                        onChange={handleInputChange}
                        className={`w-full pl-9 p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 cursor-pointer appearance-none ${
                          errors.selectDoctor ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                      >
                        <option value="">-- Select Doctor --</option>
                        {doctors
                          .filter(doc => !formData.department || doc.department === formData.department)
                          .map((doc) => (
                            <option key={doc.id} value={doc.name}>{doc.name}</option>
                          ))}
                      </select>
                      <span className="absolute right-3.5 inset-y-0 flex items-center text-gray-400 pointer-events-none text-xs">▼</span>
                    </div>
                    {errors.selectDoctor && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.selectDoctor}</span>}
                  </div>
                </div>

                {/* Row 4: Preferred Date & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 cursor-pointer ${
                        errors.preferredDate ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'
                      }`}
                    />
                    {errors.preferredDate && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.preferredDate}</span>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-600 mb-1">Preferred Time Slot *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm">⏰</span>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className={`w-full pl-9 p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 cursor-pointer appearance-none ${
                          errors.preferredTime ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-400'
                        }`}
                      >
                        <option value="">-- Select Time Slot --</option>
                        {timeSlots.length > 0 ? (
                          timeSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))
                        ) : (
                          <>
                            <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                            <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                            <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                            <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                          </>
                        )}
                      </select>
                      <span className="absolute right-3.5 inset-y-0 flex items-center text-gray-400 pointer-events-none text-xs">▼</span>
                    </div>
                    {errors.preferredTime && <span className="text-[10px] text-rose-500 mt-1 font-semibold">⚠️ {errors.preferredTime}</span>}
                  </div>
                </div>

                {/* Reason for Visit */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-600 mb-1">Reason for Visit</label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-gray-400 text-sm">✏️</span>
                    <textarea
                      name="reasonForVisit"
                      value={formData.reasonForVisit}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Briefly describe your symptoms or reason for visit"
                      className="w-full pl-9 p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-gray-400 text-[10.5px] font-semibold">
                    * All fields marked with an asterisk (*) are required.
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-[#0B2C56] hover:bg-[#154175] text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>📅</span>
                    <span>Book Appointment</span>
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* 3. Sidebar: "Why Book With Us?" (Col 1/3) */}
          <div className="space-y-6">
            
            {/* Why Book Info */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs text-left space-y-5">
              <h3 className="font-extrabold text-[#0B2C56] text-base border-b border-gray-100 pb-2.5">
                Why Book With Us?
              </h3>

              <div className="space-y-4">
                
                <div className="flex gap-3">
                  <span className="text-lg bg-blue-50 text-[#0B2C56] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Expert Doctors</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5 leading-snug">
                      Consult with highly qualified and experienced ENT specialists.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-lg bg-blue-50 text-[#0B2C56] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Easy & Quick Booking</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5 leading-snug">
                      Book your appointment slot in just a few clicks.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-lg bg-blue-50 text-[#0B2C56] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Patient First Approach</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5 leading-snug">
                      Your comfort, hygiene, and wellness is our absolute top priority.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-lg bg-blue-50 text-[#0B2C56] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">Secure & Confidential</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5 leading-snug">
                      Your health records and clinical history are kept completely private.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Need Help CTA block */}
            <div className="bg-[#f0f6fc] border border-blue-100 rounded-2xl p-6 text-left flex gap-4 items-center">
              <span className="text-3xl">📞</span>
              <div>
                <h4 className="font-bold text-[#0B2C56] text-xs uppercase tracking-wider">Need Help?</h4>
                <p className="font-black text-[#0B2C56] text-base mt-0.5">8888551743</p>
                <p className="font-black text-[#0B2C56] text-base">7058094146</p>
                <p className="text-gray-400 text-[9px] mt-1 font-semibold">We are here to assist you!</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
