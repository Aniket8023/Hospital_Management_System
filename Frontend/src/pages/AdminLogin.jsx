import React, { useState } from 'react';
import Logo from '../components/Logo';

// Admin credentials (in a real app these would be environment secrets / backend-verified)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin@123'
};

export default function AdminLogin({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Both fields are required.');
      return;
    }

    setLoading(true);
    // Simulate brief auth delay
    setTimeout(() => {
      if (
        form.username === ADMIN_CREDENTIALS.username &&
        form.password === ADMIN_CREDENTIALS.password
      ) {
        sessionStorage.setItem('shinde_admin_auth', 'true');
        onLoginSuccess();
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2C56] via-[#1a4b87] to-[#0e3a6d] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#2B9CB5]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Top brand strip */}
          <div className="bg-[#0B2C56] px-8 py-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded-xl shadow-md inline-block">
                <Logo showText={false} />
              </div>
            </div>
            <div>
              <h1 className="text-white font-extrabold text-xl tracking-wide">SHINDE HOSPITAL</h1>
              <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mt-0.5">Administrative Portal</p>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-8 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl border border-blue-100 mb-3">
                <span className="text-2xl">🔑</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#0B2C56]">Admin Sign In</h2>
              <p className="text-gray-400 text-xs mt-1">Enter your administrator credentials to continue</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3.5 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter admin username"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0B2C56] focus:ring-1 focus:ring-[#0B2C56]/30 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0B2C56] focus:ring-1 focus:ring-[#0B2C56]/30 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0B2C56] hover:bg-[#154175] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>🔓</span>
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1 text-center">
              <p className="text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">Demo Credentials</p>
              <p className="text-amber-700 text-xs font-mono">
                Username: <strong>admin</strong> &nbsp;|&nbsp; Password: <strong>admin@123</strong>
              </p>
            </div>
          </div>

          {/* Back to main site link */}
          <div className="border-t border-gray-100 px-8 py-4 bg-gray-50 text-center">
            <a
              href="#/"
              className="text-[#0B2C56] text-xs font-semibold hover:underline flex items-center justify-center gap-1"
            >
              ← Back to Patient Website
            </a>
          </div>

        </div>

        {/* Copyright */}
        <p className="text-center text-white/40 text-[10px] mt-5 font-medium">
          © 2026 Shinde Hospital. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
