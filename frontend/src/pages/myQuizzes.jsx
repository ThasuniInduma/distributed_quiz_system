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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h2 className="text-xl font-bold text-cyan-500">QuizApp</h2>
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/create-quiz')} className="text-cyan-500 font-medium hover:text-cyan-600">Create Quiz</button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">{userName.charAt(0).toUpperCase()}</div>
                <span className="text-gray-700 font-medium">{userName}</span>
              </div>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Quizzes */}
      <div className="p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Quizzes</h2>

        {quizzes.length === 0 ? (
          <p className="text-gray-500">You haven't created any quizzes yet.</p>
        ) : (
          <div className="grid gap-6">
            {quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              const countdown = getCountdown(quiz);

              return (
                <div key={quiz._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{quiz.name}</h3>
                    <p className="text-gray-500">Date: {quiz.date} | Time: {quiz.time} | Duration: {quiz.duration} min</p>
                    {status === 'upcoming' && countdown && (
                      <p className="text-yellow-600 font-medium">Starts in: {countdown}</p>
                    )}
                    {status === 'ongoing' && (
                      <p className="text-green-600 font-medium">Live Now!</p>
                    )}
                    {status === 'completed' && (
                      <p className="text-gray-400 font-medium">Finished</p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => navigate(`/quiz-participants/${quiz._id}`)} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded">Participants ({quiz.participants || 0})</button>
                    <button onClick={() => navigate(`/quiz-edit/${quiz._id}`)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">Edit</button>
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
