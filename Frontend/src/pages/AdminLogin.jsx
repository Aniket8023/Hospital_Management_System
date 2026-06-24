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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Both fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.username, password: form.password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data && data.token) {
          localStorage.setItem('token', data.token);
        }
        // store role and user if present
        if (data && data.role) {
          localStorage.setItem('role', data.role);
        }
        if (data && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        // Login successful – set auth flag and proceed
        sessionStorage.setItem('shinde_admin_auth', 'true');
        onLoginSuccess();
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6F9] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-xl p-8 space-y-6">
        
        {/* Brand Logo & Welcome */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo showText={false} className="h-16 w-16" />
          </div>
          <div className="flex flex-col items-center leading-none mt-1">
            <span className="font-extrabold tracking-wide text-2xl text-[#0B2C56] font-sans">
              SHINDE
            </span>
            <span className="font-bold tracking-[0.25em] text-[10px] text-gray-500 leading-none mt-0.5 uppercase">
              — ENT Hospital —
            </span>
          </div>
          <div className="pt-2">
            <h2 className="text-xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-400 text-xs mt-1">Please login to your account</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Username / Email</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin@shindehospital.com"
              autoComplete="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer text-xs"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 text-gray-500 font-semibold cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>Remember Me</span>
            </label>
            <a href="#/admin/login" className="text-blue-600 hover:underline font-bold">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#0B2C56] hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold text-sm rounded-lg shadow transition cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="#/"
            className="text-gray-500 hover:text-[#0B2C56] text-xs font-semibold hover:underline"
          >
            ← Back to Patient Website
          </a>
        </div>

      </div>
    </div>
  );
}

