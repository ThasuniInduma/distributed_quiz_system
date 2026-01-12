import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    const studentEmail = sessionStorage.getItem('studentEmail');
    setCurrentUserEmail(studentEmail);
    
    fetchLeaderboard();
    
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, [quizId]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/student/leaderboard/${quizId}`);
      
      if (response.data.success) {
        setQuizData(response.data.quiz);
        
        const participantsWithScores = response.data.participants.map(participant => {
          let score = 0;
          let correctAnswers = 0;
          
          if (participant.answers && response.data.quiz.questions) {
            response.data.quiz.questions.forEach((question, index) => {
              if (participant.answers[index] === question.correctAnswer) {
                correctAnswers++;
                score++;
              }
            });
          }
          
          return {
            ...participant,
            score,
            correctAnswers,
            totalQuestions: response.data.quiz.questions.length,
            percentage: ((correctAnswers / response.data.quiz.questions.length) * 100).toFixed(1)
          };
        });
        
        participantsWithScores.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(a.completedAt) - new Date(b.completedAt);
        });
        
        setLeaderboard(participantsWithScores);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getCurrentUserRank = () => {
    const index = leaderboard.findIndex(p => p.email === currentUserEmail);
    return index !== -1 ? index + 1 : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const currentUserRank = getCurrentUserRank();
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 shadow-2xl mb-4 animate-bounce">
            <span className="text-5xl">🏆</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-3">Leaderboard</h1>
          <p className="text-2xl text-gray-600 font-semibold">{quizData?.name}</p>
          {currentUserRank && (
            <div className="mt-4 inline-block bg-white rounded-full px-6 py-3 shadow-lg">
              <p className="text-lg font-bold">
                <span className="text-gray-600">Your Rank: </span>
                <span className="text-purple-600 text-2xl">{getMedalEmoji(currentUserRank)}</span>
                <span className="text-purple-600 ml-2">#{currentUserRank}</span>
              </p>
            </div>
          )}
        </div>

        {/* Top 3 Podium */}
        {topThree.length >= 3 && (
          <div className="mb-12">
            <div className="flex justify-center items-end gap-6 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <div className="flex flex-col items-center flex-1" style={{ marginBottom: '40px' }}>
                <div className="bg-gradient-to-br from-gray-300 to-gray-400 w-24 h-24 rounded-full flex items-center justify-center mb-3 shadow-2xl border-4 border-white transform hover:scale-110 transition-transform">
                  <span className="text-5xl">🥈</span>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-xl w-full text-center border-2 border-gray-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">
                    {topThree[1].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-gray-800 text-lg mb-1 truncate">{topThree[1].name}</p>
                  <p className="text-3xl font-bold text-gray-600 mb-1">{topThree[1].score}/{topThree[1].totalQuestions}</p>
                  <p className="text-sm text-gray-500 font-semibold">{topThree[1].percentage}%</p>
                </div>
                <div className="bg-gradient-to-t from-gray-400 to-gray-300 w-full h-32 mt-4 rounded-t-2xl shadow-lg"></div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center flex-1">
                <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 w-32 h-32 rounded-full flex items-center justify-center mb-3 shadow-2xl border-4 border-white animate-pulse">
                  <span className="text-6xl">🥇</span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-2xl w-full text-center border-4 border-yellow-400">
                  <div className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                    CHAMPION
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3 shadow-lg">
                    {topThree[0].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-gray-800 text-xl mb-2 truncate">{topThree[0].name}</p>
                  <p className="text-4xl font-bold text-yellow-600 mb-1">{topThree[0].score}/{topThree[0].totalQuestions}</p>
                  <p className="text-sm text-gray-500 font-semibold">{topThree[0].percentage}%</p>
                </div>
                <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 w-full h-48 mt-4 rounded-t-2xl shadow-lg"></div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center flex-1" style={{ marginBottom: '20px' }}>
                <div className="bg-gradient-to-br from-orange-300 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-2xl border-4 border-white transform hover:scale-110 transition-transform">
                  <span className="text-4xl">🥉</span>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-xl w-full text-center border-2 border-orange-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 shadow-lg">
                    {topThree[2].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-gray-800 mb-1 truncate">{topThree[2].name}</p>
                  <p className="text-2xl font-bold text-orange-600 mb-1">{topThree[2].score}/{topThree[2].totalQuestions}</p>
                  <p className="text-xs text-gray-500 font-semibold">{topThree[2].percentage}%</p>
                </div>
                <div className="bg-gradient-to-t from-orange-500 to-orange-300 w-full h-24 mt-4 rounded-t-2xl shadow-lg"></div>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-8 py-5">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📊</span>
              Complete Rankings ({leaderboard.length} Participants)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Participant</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Score</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Percentage</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((participant, index) => {
                  const isCurrentUser = participant.email === currentUserEmail;
                  const rank = index + 1;
                  
                  return (
                    <tr 
                      key={index} 
                      className={`transition-colors ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getMedalEmoji(rank)}</span>
                          {rank > 3 && <span className="text-lg font-bold text-gray-600">#{rank}</span>}
                          {isCurrentUser && (
                            <span className="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                            rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                            rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-500' :
                            'bg-gradient-to-br from-cyan-400 to-blue-500'
                          }`}>
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-bold text-lg ${isCurrentUser ? 'text-cyan-700' : 'text-gray-800'}`}>
                              {participant.name}
                            </p>
                            <p className="text-xs text-gray-500">{participant.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-2xl font-bold text-gray-800">
                          {participant.score}/{participant.totalQuestions}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-4 py-2 rounded-full font-bold text-lg ${
                          participant.percentage >= 80 ? 'bg-green-100 text-green-700' :
                          participant.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {participant.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {participant.completedAt 
                          ? new Date(participant.completedAt).toLocaleTimeString()
                          : 'In Progress'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate(`/quiz-results/${quizId}`)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            📝 View My Answers
          </button>
          <button
            onClick={() => navigate('/student')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            🎯 Take Another Quiz
          </button>
        </div>

        {/* Auto-refresh indicator */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-md">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Live updates every 5 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;