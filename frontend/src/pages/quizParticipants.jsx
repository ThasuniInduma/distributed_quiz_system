// pages/QuizParticipants.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const QuizParticipants = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [userName, setUserName] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchQuizAndParticipants();
  }, [quizId]);

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

  const fetchQuizAndParticipants = async () => {
    try {
      // Fetch quiz details
      const quizResponse = await axios.get(`http://localhost:4000/api/quizzes/${quizId}`, {
        withCredentials: true
      });

      if (quizResponse.data.success) {
        setQuizData(quizResponse.data.quiz);
      }

      // Fetch participants
      const participantsResponse = await axios.get(`http://localhost:4000/api/quizzes/${quizId}/participants`, {
        withCredentials: true
      });

      if (participantsResponse.data.success) {
        setParticipants(participantsResponse.data.participants || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      if (error.response?.status === 401) {
        navigate('/login');
      }
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

  const calculateScore = (participant) => {
    if (!participant.answers || !quizData) return 0;
    
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      if (participant.answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScorePercentage = (participant) => {
    if (!quizData || !quizData.questions.length) return 0;
    const score = calculateScore(participant);
    return ((score / quizData.questions.length) * 100).toFixed(1);
  };

  const exportToCSV = () => {
    if (!participants.length || !quizData) {
      alert('No data to export');
      return;
    }

    const headers = ['Name', 'Email', 'Score', 'Percentage', 'Completed At'];
    const rows = participants.map(p => [
      p.name,
      p.email,
      `${calculateScore(p)}/${quizData.questions.length}`,
      `${getScorePercentage(p)}%`,
      p.completedAt ? new Date(p.completedAt).toLocaleString() : 'Not completed'
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizData.name}_participants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading participants...</div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Quiz not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-cyan-500">QuizApp</h2>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/my-quizzes')}
                className="text-cyan-500 font-medium hover:text-cyan-600"
              >
                My Quizzes
              </button>
              <button
                onClick={() => navigate('/create-quiz')}
                className="text-cyan-500 font-medium hover:text-cyan-600"
              >
                Create Quiz
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium">{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/my-quizzes')}
            className="text-cyan-500 hover:text-cyan-600 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Quizzes
          </button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{quizData.name}</h1>
              <p className="text-gray-600 mt-2">
                Date: {quizData.date} | Time: {quizData.time} | Duration: {quizData.duration} min
              </p>
              <p className="text-gray-600 mt-1">
                Total Questions: {quizData.questions.length}
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Participants ({participants.length})
            </h2>
          </div>

          {participants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No participants have taken this quiz yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant, index) => {
                    const score = calculateScore(participant);
                    const percentage = getScorePercentage(participant);
                    
                    return (
                      <tr key={participant._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                              {participant.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {participant.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {score} / {quizData.questions.length}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                            percentage >= 80 ? 'bg-green-100 text-green-800' :
                            percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.completedAt 
                            ? new Date(participant.completedAt).toLocaleString()
                            : 'Not completed'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            participant.completed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {participant.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistics */}
        {participants.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-500 mb-1">Total Participants</div>
              <div className="text-2xl font-bold text-gray-900">{participants.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-500 mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-600">
                {participants.filter(p => p.completed).length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-500 mb-1">Average Score</div>
              <div className="text-2xl font-bold text-cyan-600">
                {participants.length > 0
                  ? (participants.reduce((sum, p) => sum + parseFloat(getScorePercentage(p)), 0) / participants.length).toFixed(1)
                  : 0}%
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-500 mb-1">Pass Rate (≥60%)</div>
              <div className="text-2xl font-bold text-purple-600">
                {participants.length > 0
                  ? ((participants.filter(p => parseFloat(getScorePercentage(p)) >= 60).length / participants.length) * 100).toFixed(1)
                  : 0}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizParticipants;