import React, { useState, useEffect } from 'react';

export default function Home({ setCurrentTab, doctors, departments, handleBookAppointment }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    emailAddress: '',
    department: '',
    selectDoctor: '',
    preferredDate: '',
    preferredTime: '',
    reasonForVisit: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

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

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.patientName || !formData.mobileNumber || !formData.department || !formData.selectDoctor || !formData.preferredDate || !formData.preferredTime) {
      setFormError('Please fill out all required fields.');
      return;
    }

    if (formData.mobileNumber.length !== 10 || isNaN(formData.mobileNumber)) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Submit appointment
    handleBookAppointment({
      ...formData,
      aadharNumber: "Not Provided (Quick Form)", // Optional in quick form
    });

    setFormSubmitted(true);
    setFormError('');
    setFormData({
      patientName: '',
      mobileNumber: '',
      emailAddress: '',
      department: '',
      selectDoctor: '',
      preferredDate: '',
      preferredTime: '',
      reasonForVisit: ''
    });

    // Reset success message after 5 seconds
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="w-full text-gray-800 font-sans pb-12">
      
      {/* 1. Hero Section (Slider) */}
      <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden bg-[#0B2C56]">
        {/* Slides */}
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
            </div>
            
            {/* Slide Content */}
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-[#0B2C56] scale-125' : 'bg-gray-400/60'
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
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=400"
              alt="Dr. Rajendra Shinde"
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
              <p className="font-bold text-[#0B2C56] text-[16px]">- Dr. Rajendra Shinde</p>
              <p className="text-gray-500 text-xs mt-0.5">Founder & Managing Director</p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Quick Appointment Booking Form */}
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
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center animate-fadeIn">
              <span className="text-4xl">🎉</span>
              <h3 className="text-emerald-800 font-bold text-lg mt-2">Appointment Request Submitted!</h3>
              <p className="text-emerald-600 text-sm mt-1">Our receptionist will contact you shortly to confirm your booking.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 text-left">
                  ⚠️ {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Name */}
                <div className="text-left">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>

                {/* Mobile */}
                <div className="text-left">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit number"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>

                {/* Email */}
                <div className="text-left">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Department */}
                <div className="text-left">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Select Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Doctor */}
                <div className="text-left">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Select Doctor *</label>
                  <select
                    name="selectDoctor"
                    value={formData.selectDoctor}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                    required
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctors
                      .filter(doc => !formData.department || doc.department === formData.department)
                      .map((doc) => (
                        <option key={doc.id} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="text-left">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Select Date *</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                    required
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Time Slot */}
                <div className="text-left md:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Select Time *</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                    required
                  >
                    <option value="">-- Select Time Slot --</option>
                    {formData.selectDoctor ? (
                      doctors.find(d => d.name === formData.selectDoctor)?.timeSlots.map(slot => (
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
                </div>

                {/* Message */}
                <div className="text-left md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Your Message (Optional)</label>
                  <input
                    type="text"
                    name="reasonForVisit"
                    value={formData.reasonForVisit}
                    onChange={handleInputChange}
                    placeholder="Briefly describe symptoms or reason for visit"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg bg-[#0B2C56] hover:bg-[#154175] text-white text-[15px] font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
