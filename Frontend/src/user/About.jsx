import React from 'react';

export default function About({ setCurrentTab }) {
  const coreValues = [
    {
      title: "Patient First Focus",
      desc: "Every clinical decision we make revolves around the comfort, safety, and health of our patients.",
      icon: "❤️"
    },
    {
      title: "Integrity & Honesty",
      desc: "We practice transparent medical advice without unnecessary prescriptions or clinical procedures.",
      icon: "🤝"
    },
    {
      title: "Advanced Medical Care",
      desc: "Our diagnostic lab and clinical surgical suites feature state-of-the-art ENT instruments.",
      icon: "⚡"
    },
    {
      title: "Compassionate Support",
      desc: "We understand that medical issues can be stressful. We are here to listen, empathize, and heal.",
      icon: "✨"
    }
  ];

  return (
    <div className="w-full text-gray-800 font-sans pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0B2C56] to-[#1a4b87] text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide">
          About Shinde Hospital
        </h1>
        <p className="mt-3 text-sm md:text-lg text-blue-100 max-w-2xl mx-auto">
          Providing world-class healthcare in Satara with a focus on compassion, excellence, and state-of-the-art medical services.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#2B9CB5] bg-blue-50 px-3 py-1 rounded-full">
              Our Journey
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2C56] leading-snug">
              Serving the Community Since 2012
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Shinde Hospital began as a specialized ENT clinic in Satara with a singular goal: to bring premium, high-quality, and ethical ear, nose, and throat treatments directly to the local community, removing the need for long travel to major metropolitan hubs.
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Under the leadership of Dr. Rajendra Shinde, the clinic has grown into a full-scale specialist center equipped with modern diagnostic facilities, hearing evaluation suites, and advanced surgical microscopes. Despite our growth, our core principle remains unchanged—Care With Compassion.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 aspect-video md:aspect-auto md:h-[360px]">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600&h=400"
              alt="Hospital Facility"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-[#f0f6fc] border border-blue-50 p-8 rounded-2xl text-left space-y-3">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-bold text-[#0B2C56]">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To deliver ethical, evidence-based, and highly specialized medical care. We focus on patient-centric protocols, using advanced diagnostic technology to provide prompt treatments that restore health and enhance overall well-being.
            </p>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-2xl text-left space-y-3">
            <span className="text-2xl">👁️</span>
            <h3 className="text-lg font-bold text-emerald-900">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To build Shinde Hospital into the most trusted destination for ENT and general specialty care in the region. We work to pioneer local accessibility for advanced surgeries and medical care while maintaining a warm, compassionate family hospital environment.
            </p>
          </div>

        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2C56]">
              Our Core Pillars
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 max-w-xl mx-auto">
              Our clinical and administrative protocols are driven by four critical core principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs text-left space-y-2">
                <span className="text-3xl inline-block bg-gray-50 p-2 rounded-lg">{val.icon}</span>
                <h4 className="font-bold text-[#0B2C56] text-sm">{val.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call To Action Banner */}
        <div className="bg-[#0B2C56] text-white p-8 md:p-12 rounded-3xl text-center space-y-5 shadow-xl">
          <h2 className="text-xl md:text-3xl font-bold text-white">
            Need Expert Medical Guidance?
          </h2>
          <p className="text-gray-300 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Our specialists are ready to help. Book a date and time slot to consult with Dr. Rajendra Shinde or our other ENT experts today.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentTab('book-appointment')}
              className="px-8 py-3 rounded-lg bg-[#2B9CB5] hover:bg-[#20839a] text-white font-bold text-sm shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Book An Appointment Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
