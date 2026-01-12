// pages/MyQuizzes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [userName, setUserName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchUserData();
    fetchQuizzes();

    // Update currentTime every second for live countdown
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/user/data', { withCredentials: true });
      if (res.data.success) setUserName(res.data.userData.name);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) navigate('/login');
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/quizzes', { withCredentials: true });
      if (res.data.success) setQuizzes(res.data.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      if (error.response?.status === 401) navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get quiz status: upcoming, ongoing, completed
  const getQuizStatus = (quiz) => {
    const startTime = new Date(`${quiz.date}T${quiz.time}`);
    const endTime = new Date(startTime.getTime() + quiz.duration * 60000);

    if (currentTime < startTime) return 'upcoming';
    if (currentTime >= startTime && currentTime <= endTime) return 'ongoing';
    return 'completed';
  };

  // Get countdown string
  const getCountdown = (quiz) => {
    const startTime = new Date(`${quiz.date}T${quiz.time}`);
    const diff = startTime - currentTime;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  // Copy Quiz ID to clipboard
  const copyQuizId = (quizId) => {
    navigator.clipboard.writeText(quizId);
    alert(`Quiz ID "${quizId}" copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500 p-1.5 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-semibold text-gray-800">
                Quiz<span className="text-cyan-500">Hub</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              
              <button onClick={handleLogout} className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Quizzes */}
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Quizzes</h2>
          <button
            onClick={() => navigate('/create-quiz')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create a new Quiz
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-block p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-full mb-6">
              <svg className="w-24 h-24 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No quizzes yet</h3>
            <p className="text-gray-500 mb-8 text-lg">Create your first quiz to get started</p>
            <button
              onClick={() => navigate('/create-quiz')}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold px-10 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Quiz
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              const countdown = getCountdown(quiz);

              return (
                <div key={quiz._id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{quiz.name}</h3>
                          {quiz.quizId && (
                            <button
                              onClick={() => copyQuizId(quiz.quizId)}
                              className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-mono font-semibold transition-colors cursor-pointer mt-1 inline-flex items-center gap-1"
                              title="Click to copy Quiz ID"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              ID: {quiz.quizId}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{quiz.date}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{quiz.time}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="font-medium">{quiz.duration} min</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-medium">{quiz.participants || 0} participants</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {status === 'upcoming' && countdown && (
                          <span className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Starts in {countdown}
                          </span>
                        )}
                        {status === 'ongoing' && (
                          <span className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                            Live Now!
                          </span>
                        )}
                        {status === 'completed' && (
                          <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 ml-6">
                      <button
                        onClick={() => navigate(`/quiz-participants/${quiz._id}`)}
                        className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Participants
                      </button>
                      <button
                        onClick={() => navigate(`/quiz-edit/${quiz._id}`)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;