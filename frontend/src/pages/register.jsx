import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Gateway URL - connects to API Gateway instead of single server
const backendUrl = 'http://localhost:3000';

export default function Register() {
  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        'http://localhost:4000/api/auth/register',
        {
          name: fullName,
          email,
          password,
          role,
        }
      );

      // save user (keep token logic as-is, since you said not to change code)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // ✅ ROLE BASED REDIRECT
      const userRole = res.data.user.role;

      if (userRole === 'student') {
        navigate('/student');
      } else if (userRole === 'teacher') {
        navigate('/teacher');
      } else if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-800 via-slate-700 to-cyan-900 items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <div className="bg-cyan-500 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 mx-auto">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-center">Join QuizHub Today</h1>
          <p className="text-slate-200 text-center text-lg leading-relaxed mb-8">
            Create your account and access our distributed quiz platform. Take assessments, create quizzes, or manage the system.
          </p>
          
          <div className="space-y-4 mt-12">
            <div className="bg-slate-600 bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-slate-500">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Student</h3>
                  <p className="text-slate-300 text-sm">Take quizzes and track your progress</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-600 bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-slate-500">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Teacher</h3>
                  <p className="text-slate-300 text-sm">Create quizzes and monitor students</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-600 bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-slate-500">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Admin</h3>
                  <p className="text-slate-300 text-sm">Manage system and users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Quiz<span className="text-cyan-500">Hub</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-500 mb-8">Start your journey with QuizHub</p>

          <form onSubmit={handleRegister}>
            {/* ROLE SELECTION */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">I am a</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center justify-center py-4 px-3 rounded-xl border-2 transition-all ${
                    role === 'student'
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <svg 
                    className={`w-6 h-6 mb-2 ${role === 'student' ? 'text-cyan-500' : 'text-gray-400'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <span className={`text-sm font-medium ${role === 'student' ? 'text-cyan-600' : 'text-gray-600'}`}>
                    Student
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex flex-col items-center justify-center py-4 px-3 rounded-xl border-2 transition-all ${
                    role === 'teacher'
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <svg 
                    className={`w-6 h-6 mb-2 ${role === 'teacher' ? 'text-cyan-500' : 'text-gray-400'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className={`text-sm font-medium ${role === 'teacher' ? 'text-cyan-600' : 'text-gray-600'}`}>
                    Teacher
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center justify-center py-4 px-3 rounded-xl border-2 transition-all ${
                    role === 'admin'
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <svg 
                    className={`w-6 h-6 mb-2 ${role === 'admin' ? 'text-cyan-500' : 'text-gray-400'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className={`text-sm font-medium ${role === 'admin' ? 'text-cyan-600' : 'text-gray-600'}`}>
                    Admin
                  </span>
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition bg-white"
                placeholder="John Doe"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition bg-white"
                placeholder="you@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition bg-white pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition bg-white pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Creating account...' : (
                <>
                  Create Account
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}