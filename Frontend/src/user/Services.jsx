import React from 'react';

export default function Services({ services, setCurrentTab }) {
  const benefits = [
    {
      title: "Expert Doctors",
      desc: "Highly experienced specialists in every field.",
      icon: "🎖️"
    },
    {
      title: "Advanced Technology",
      desc: "State-of-the-art equipment for accurate diagnosis.",
      icon: "💾"
    },
    {
      title: "Patient-Centered Care",
      desc: "Personalized care plans with respect for every patient.",
      icon: "🤝"
    },
    {
      title: "24/7 Support",
      desc: "Round-the-clock emergency care for peace of mind.",
      icon: "⏰"
    }
  ];

  return (
    <div className="w-full text-gray-800 font-sans pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0B2C56] to-[#1a4b87] text-white py-16 px-4 text-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#2B9CB5] bg-blue-900/50 px-3 py-1 rounded-full">
          Our Services
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3 tracking-wide">
          Comprehensive Healthcare for You
        </h1>
        <p className="mt-3 text-sm md:text-lg text-blue-100 max-w-2xl mx-auto">
          At Shinde Hospital, we offer a wide range of advanced medical services with compassion and excellence. Your health is our priority.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* Core Value Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          {benefits.map((ben, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <span className="text-3xl">{ben.icon}</span>
              <h4 className="font-bold text-[#0B2C56] text-sm mt-3">{ben.title}</h4>
              <p className="text-gray-500 text-xs mt-1 max-w-[200px]">{ben.desc}</p>
            </div>
          ))}
        </div>

        {/* Specialities Header */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2C56]">
            Our Specialities
          </h2>
          <div className="flex justify-center items-center gap-2 mt-2">
            <span className="h-[2px] w-12 bg-blue-300"></span>
            <span className="text-[#0B2C56] text-xs">💙</span>
            <span className="h-[2px] w-12 bg-blue-300"></span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-3 max-w-xl mx-auto">
            Advanced ENT care and a wide range of medical services to ensure your well-being.
          </p>
        </div>

        {/* Specialities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col space-y-4 text-center hover:-translate-y-1"
            >
              <span className="text-3xl inline-block bg-blue-50 p-3 rounded-full mx-auto self-center text-blue-900 w-14 h-14 flex items-center justify-center">
                {svc.icon}
              </span>
              <div className="space-y-2">
                <h3 className="font-extrabold text-gray-900 text-base">
                  {svc.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed min-h-[50px]">
                  {svc.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Need Help Banner */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📞</span>
            <div className="text-left">
              <h4 className="font-bold text-[#0B2C56] text-base">Need Immediate Help?</h4>
              <p className="text-gray-500 text-xs">Our experts are available 24x7 for medical assistance.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-[#0B2C56] tracking-wider">
              8888551743, 7058094146
            </p>
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">
              24x7 Emergency Support
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
