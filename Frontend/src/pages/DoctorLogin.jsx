import React, { useState } from 'react';
import Logo from '../components/Logo';

// Each doctor has a PIN — in production this would be hashed + server-verified
const DOCTOR_PINS = {
  1: '1234',
  2: '2345',
  3: '3456',
  4: '4567'
};

export default function DoctorLogin({ doctors, onLoginSuccess }) {
  const [step, setStep] = useState('select'); // 'select' | 'pin'
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleDoctorSelect = (doc) => {
    setSelectedDoc(doc);
    setStep('pin');
    setPin('');
    setError('');
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (!pin) {
      setError('Please enter your 4-digit PIN.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const correctPin = DOCTOR_PINS[selectedDoc.id];
      if (pin === correctPin) {
        sessionStorage.setItem('shinde_doctor_auth', 'true');
        sessionStorage.setItem('shinde_doctor_id', selectedDoc.id);
        onLoginSuccess(selectedDoc.id);
      } else {
        setError('Incorrect PIN. Please try again.');
        setPin('');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Top brand strip */}
          <div className="bg-[#065f46] px-8 py-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded-xl shadow-md inline-block">
                <Logo showText={false} />
              </div>
            </div>
            <div>
              <h1 className="text-white font-extrabold text-xl tracking-wide">SHINDE HOSPITAL</h1>
              <p className="text-emerald-200 text-xs font-semibold tracking-widest uppercase mt-0.5">Clinical Workspace</p>
            </div>
          </div>

          <div className="px-8 py-8 space-y-6">

            {step === 'select' ? (
              // Step 1: Choose doctor profile
              <>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl border border-emerald-100 mb-3">
                    <span className="text-2xl">🩺</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">Select Your Profile</h2>
                  <p className="text-gray-400 text-xs mt-1">Choose your doctor account to continue</p>
                </div>

                <div className="space-y-3">
                  {doctors.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleDoctorSelect(doc)}
                      className="w-full flex items-center gap-4 p-4 border border-gray-150 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/30 text-left transition-all duration-200 group cursor-pointer"
                    >
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100 group-hover:border-emerald-200 transition"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-gray-900 text-sm truncate">{doc.name}</p>
                        <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mt-0.5">{doc.department}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              // Step 2: Enter PIN
              <>
                <div className="text-center">
                  <img
                    src={selectedDoc.image}
                    alt={selectedDoc.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-emerald-100 mx-auto mb-3 shadow-sm"
                  />
                  <h2 className="text-lg font-extrabold text-gray-900">{selectedDoc.name}</h2>
                  <p className="text-gray-400 text-xs mt-0.5 uppercase font-bold tracking-wide">{selectedDoc.role}</p>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3.5 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Enter Your 4-Digit PIN</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      <input
                        type={showPin ? 'text' : 'password'}
                        value={pin}
                        onChange={(e) => {
                          // Only allow digits, max 4
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setPin(val);
                          if (error) setError('');
                        }}
                        placeholder="• • • •"
                        maxLength={4}
                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white text-center tracking-[0.5em] font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                        autoFocus
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(p => !p)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPin ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || pin.length !== 4}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>🔓</span>
                        <span>Enter Workspace</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep('select'); setError(''); setPin(''); }}
                    className="w-full py-2.5 border border-gray-200 text-gray-500 font-semibold text-sm rounded-xl hover:bg-gray-50 transition cursor-pointer"
                  >
                    ← Change Doctor
                  </button>
                </form>

                {/* PIN hint */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-center">
                  <p className="text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">Demo PIN for {selectedDoc.name.split(' ')[1]}</p>
                  <p className="text-amber-700 text-sm font-mono font-bold mt-0.5">{DOCTOR_PINS[selectedDoc.id]}</p>
                </div>
              </>
            )}
          </div>

          <div className="border-t border-gray-100 px-8 py-4 bg-gray-50 text-center">
            <a
              href="#/"
              className="text-gray-600 text-xs font-semibold hover:underline flex items-center justify-center gap-1"
            >
              ← Back to Patient Website
            </a>
          </div>
        </div>

        <p className="text-center text-white/40 text-[10px] mt-5 font-medium">
          © 2026 Shinde Hospital. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
