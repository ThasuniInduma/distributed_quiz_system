// pages/Teacher.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Teacher = () => {
  const navigate = useNavigate();
  const [hasQuizzes, setHasQuizzes] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkQuizzes();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/data', {
        withCredentials: true
      });
      if (response.data.success) {
        setUserName(response.data.userData.name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const checkQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/quizzes', {
        withCredentials: true
      });
      if (response.data.success && response.data.quizzes.length > 0) {
        setHasQuizzes(true);
        navigate('/my-quizzes');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking quizzes:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-500 p-1.5 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />            </svg>
          </div>
          <span className="text-2xl font-semibold text-gray-800">
              Quiz<span className="text-cyan-500">Hub</span>
            </span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={handleAction} className="text-slate-600 font-medium hover:text-cyan-600">Login</button>
          <button onClick={handleAction} className="bg-cyan-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-cyan-600 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block p-8 bg-white rounded-lg shadow-sm">
              <svg className="w-32 h-32 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quizzes await! Make one.
          </h1>
          <p className="text-gray-400 mb-8">
            Click below to begin your journey here...
          </p>
          <button
            onClick={() => navigate('/create-quiz')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teacher;