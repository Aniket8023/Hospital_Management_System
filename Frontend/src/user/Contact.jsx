import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText("20°09'03.8\"N 76°34'36.6\"E");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save contact inquiry in localStorage for admin to read
    const inquiries = JSON.parse(localStorage.getItem('contactInquiries') || '[]');
    inquiries.push({
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem('contactInquiries', JSON.stringify(inquiries));
    
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="w-full text-gray-800 font-sans pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0B2C56] to-[#1a4b87] text-white py-16 px-4 text-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#2B9CB5] bg-blue-900/50 px-3 py-1 rounded-full">
          Contact Us
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3 tracking-wide">
          We Are Here To Help You
        </h1>
        <p className="mt-3 text-sm md:text-lg text-blue-100 max-w-2xl mx-auto">
          Your health and satisfaction are our top priorities. Reach out to us anytime. We are always here for you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-gray-150 text-left flex gap-3 shadow-xs">
            <span className="text-2xl bg-blue-50 p-2.5 rounded-full text-[#0B2C56] self-start">📍</span>
            <div>
              <h4 className="font-bold text-[#0B2C56] text-sm">Address</h4>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                Shivajinagar, Near City Center, Satara, Maharashtra 415001
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 text-left flex gap-3 shadow-xs">
            <span className="text-2xl bg-blue-50 p-2.5 rounded-full text-[#0B2C56] self-start">📞</span>
            <div>
              <h4 className="font-bold text-[#0B2C56] text-sm">Phone</h4>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                8888551743<br />7058094146
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 text-left flex gap-3 shadow-xs">
            <span className="text-2xl bg-blue-50 p-2.5 rounded-full text-[#0B2C56] self-start">✉️</span>
            <div>
              <h4 className="font-bold text-[#0B2C56] text-sm">Email</h4>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                info@shindehospital.com<br />support@shindehospital.com
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 text-left flex gap-3 shadow-xs">
            <span className="text-2xl bg-blue-50 p-2.5 rounded-full text-[#0B2C56] self-start">⏰</span>
            <div>
              <h4 className="font-bold text-[#0B2C56] text-sm">Working Hours</h4>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                Mon - Sat : 9:00 AM - 8:00 PM<br />Sunday : 10:00 AM - 2:00 PM
              </p>
            </div>
          </div>

        </div>

        {/* Map Location Section */}
        <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="bg-gray-50/80 backdrop-blur-xs p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-semibold text-gray-600 border-b border-gray-200">
            <span className="flex items-center gap-2">
              <span className="text-lg">🗺️</span>
              <div className="text-left">
                <h4 className="font-extrabold text-[#0B2C56] text-sm">Interactive Hospital Location Map</h4>
                <p className="text-gray-400 font-normal text-[11px] mt-0.5">Coordinates: 20°09'03.8"N 76°34'36.6"E</p>
              </div>
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyCoords}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer min-w-[130px]"
              >
                <span>{copied ? '✅ Copied' : '📋 Copy Coordinates'}</span>
              </button>
              <a
                href="https://www.google.com/maps/search/?api=1&query=20.151056,76.576833"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0B2C56] hover:bg-[#154175] text-white rounded-lg text-[11px] font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer text-center"
              >
                <span>Open in Google Maps ↗</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 h-[420px] lg:h-[480px]">
            {/* Location Details panel */}
            <div className="lg:col-span-1 bg-[#f8fafc] border-b lg:border-b-0 lg:border-r border-gray-150 p-6 flex flex-col justify-between text-left">
              <div className="space-y-5">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#2B9CB5] bg-blue-50 px-2.5 py-1 rounded-full">
                  GPS Location
                </span>
                <div className="space-y-4 mt-2">
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Hospital Latitude</h5>
                    <p className="text-sm font-semibold text-[#0B2C56] mt-0.5">20.151056° N</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Hospital Longitude</h5>
                    <p className="text-sm font-semibold text-[#0B2C56] mt-0.5">76.576833° E</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Address Coordinates</h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      20°09'03.8"N 76°34'36.6"E
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200/60 mt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-rose-500">📍</span>
                  <span>Easy Navigable Route</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                  Click the navigation buttons above or copy coordinates into your preferred maps application to begin your route directly to Shinde Hospital.
                </p>
              </div>
            </div>

            {/* Interactive Map IFrame */}
            <div className="lg:col-span-3 w-full h-full relative bg-[#e5e7eb]">
              <iframe
                src="https://maps.google.com/maps?q=20.151056,76.576833&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shinde Hospital Map Location"
                className="w-full h-full absolute inset-0 filter brightness-95 hover:brightness-100 transition-all duration-300"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Message Form & Get In Touch Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Inquiry Form */}
          <div className="md:col-span-2 bg-[#f8fafc] border border-gray-150 p-6 md:p-8 rounded-2xl text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[#0B2C56] mb-1">
              Send Us a Message
            </h2>
            <div className="flex items-center gap-1 mt-1 mb-6">
              <span className="h-[2px] w-10 bg-[#0B2C56]"></span>
              <span className="text-[#0B2C56] text-xs">💙</span>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center">
                <span className="text-4xl">📬</span>
                <h3 className="font-bold text-lg mt-2">Message Sent Successfully!</h3>
                <p className="text-sm text-emerald-600 mt-1">Thank you for writing. We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter name"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter subject"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Your Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe your inquiry..."
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Send Message</span>
                  <span>🚀</span>
                </button>
              </form>
            )}
          </div>

          {/* Get In Touch Sidebar */}
          <div className="bg-[#f0f6fc] border border-blue-50 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-4">
            <h2 className="text-xl font-bold text-[#0B2C56]">Get in Touch</h2>
            <div className="flex justify-center items-center gap-2">
              <span className="h-[2px] w-8 bg-blue-300"></span>
              <span className="text-[#0B2C56] text-xs">💙</span>
              <span className="h-[2px] w-8 bg-blue-300"></span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed max-w-[220px]">
              Have a question or need assistance? Fill out the form and our reception team will get back to you as soon as possible.
            </p>
            
            <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-xs w-full">
              <span className="text-3xl">🎧</span>
              <h4 className="font-extrabold text-[#0B2C56] text-sm mt-2">24/7 Support</h4>
              <p className="text-gray-400 text-[10px] font-semibold mt-1">We are always here to help you whenever you need us.</p>
            </div>
          </div>

        </div>

        {/* Lower Grid Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-150">
          
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs text-left">
            <span className="text-2xl">🚑</span>
            <div>
              <h4 className="font-bold text-[#0B2C56] text-xs">Emergency Care</h4>
              <p className="text-gray-400 text-[10px] mt-0.5 leading-snug">24/7 Emergency ENT care for critical conditions.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs text-left">
            <span className="text-2xl">🩺</span>
            <div>
              <h4 className="font-bold text-[#0B2C56] text-xs">Expert Doctors</h4>
              <p className="text-gray-400 text-[10px] mt-0.5 leading-snug">Highly experienced ENT specialists for all your needs.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs text-left">
            <span className="text-2xl">🛡️</span>
            <div>
              <h4 className="font-bold text-[#0B2C56] text-xs">Safe & Hygienic</h4>
              <p className="text-gray-400 text-[10px] mt-0.5 leading-snug">Advanced technology and sterilized environment.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs text-left">
            <span className="text-2xl">🤝</span>
            <div>
              <h4 className="font-bold text-[#0B2C56] text-xs">Patient First</h4>
              <p className="text-gray-400 text-[10px] mt-0.5 leading-snug">Compassionate care and personalized treatments.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
