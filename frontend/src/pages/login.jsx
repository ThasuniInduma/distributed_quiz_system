import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Gateway URL - connects to API Gateway instead of single server
const backendUrl = 'http://localhost:3000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        'http://localhost:4000/api/auth/login',
        { email, password },
        { withCredentials: true } // ✅ REQUIRED for cookie auth
      );

      if (!res.data.success) {
        alert(res.data.message || 'Login failed');
        return;
      }

      // ✅ Save user info (NO token)
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // ✅ Role based navigation
      const role = res.data.user.role;

      if (role === 'student') {
        navigate('/student');
      } else if (role === 'teacher') {
        navigate('/teacher');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        alert('Invalid user role');
      }

    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" id="login">
      {/* LEFT SIDE */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-gray-800">
              Quiz<span className="text-cyan-500">Hub</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="you@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white py-3 rounded-lg font-medium"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center mt-6 text-gray-600">
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-cyan-500 font-medium"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-gradient-to-br from-slate-800 via-slate-700 to-cyan-900 flex items-center justify-center p-8">
        <div className="text-white text-center max-w-lg">
          <div className="bg-cyan-500 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 mx-auto">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4">Distributed Quiz Platform</h2>
          <p className="text-cyan-100 text-lg">
            High availability • Secure • Real-time assessments
          </p>
        </div>
      </div>
    </div>
  );
}
