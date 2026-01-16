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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-800 text-xl font-semibold">Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  const currentUserRank = getCurrentUserRank();
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-white p-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-6xl">🏆</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-3">Leaderboard</h1>
          <p className="text-xl md:text-2xl text-cyan-600 font-semibold">{quizData?.name}</p>
          
          {currentUserRank && (
            <div className="mt-6 inline-block bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl px-8 py-4 shadow-lg">
              <p className="text-lg font-bold">
                <span className="text-gray-600">Your Rank: </span>
                <span className="text-3xl ml-2">{getMedalEmoji(currentUserRank)}</span>
                <span className="text-cyan-600 text-2xl font-bold ml-2">#{currentUserRank}</span>
              </p>
            </div>
          )}
        </div>

        {/* Top 3 Podium - Simplified and Clean */}
        {topThree.length >= 3 && (
          <div className="mb-10">
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
              
              {/* 2nd Place */}
              <div className="flex flex-col items-center pt-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mb-4 shadow-xl">
                  <span className="text-5xl">🥈</span>
                </div>
                <div className="bg-white rounded-2xl p-6 w-full text-center shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">
                    {topThree[1].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-gray-800 text-lg mb-2 truncate">{topThree[1].name}</p>
                  <p className="text-3xl font-bold text-gray-600">{topThree[1].score}/{topThree[1].totalQuestions}</p>
                  <p className="text-sm text-gray-500 font-semibold mt-1">{topThree[1].percentage}%</p>
                </div>
                <div className="bg-gradient-to-t from-gray-400 to-gray-300 w-full h-28 mt-4 rounded-t-2xl shadow-lg"></div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-2xl animate-pulse">
                  <span className="text-7xl">🥇</span>
                </div>
                <div className="bg-white rounded-2xl p-6 w-full text-center shadow-2xl border-4 border-yellow-400">
                  <div className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                    CHAMPION
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3 shadow-lg">
                    {topThree[0].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-gray-800 text-xl mb-2 truncate">{topThree[0].name}</p>
                  <p className="text-4xl font-bold text-yellow-600">{topThree[0].score}/{topThree[0].totalQuestions}</p>
                  <p className="text-sm text-gray-500 font-semibold mt-1">{topThree[0].percentage}%</p>
                </div>
                <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 w-full h-40 mt-4 rounded-t-2xl shadow-lg"></div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center pt-16">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-xl">
                  <span className="text-4xl">🥉</span>
                </div>
                <div className="bg-white rounded-2xl p-5 w-full text-center shadow-xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg">
                    {topThree[2].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-gray-800 mb-2 truncate">{topThree[2].name}</p>
                  <p className="text-2xl font-bold text-orange-600">{topThree[2].score}/{topThree[2].totalQuestions}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">{topThree[2].percentage}%</p>
                </div>
                <div className="bg-gradient-to-t from-orange-500 to-orange-400 w-full h-20 mt-4 rounded-t-2xl shadow-lg"></div>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl"></span>
              Complete Rankings
              <span className="text-cyan-100 text-lg font-normal">({leaderboard.length} Participants)</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase">Rank</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase">Participant</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-gray-700 uppercase">Score</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-gray-700 uppercase">Percentage</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-gray-700 uppercase">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((participant, index) => {
                  const isCurrentUser = participant.email === currentUserEmail;
                  const rank = index + 1;
                  
                  return (
                    <tr 
                      key={index} 
                      className={`transition-all ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{getMedalEmoji(rank)}</span>
                          {rank > 3 && <span className="text-xl font-bold text-gray-600">#{rank}</span>}
                          {isCurrentUser && (
                            <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                            rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                            rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                            'bg-gradient-to-br from-cyan-500 to-blue-600'
                          }`}>
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-bold text-lg ${isCurrentUser ? 'text-cyan-700' : 'text-gray-800'}`}>
                              {participant.name}
                            </p>
                            <p className="text-sm text-gray-500">{participant.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-2xl font-bold text-gray-800">
                          {participant.score}/{participant.totalQuestions}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex px-5 py-2 rounded-xl font-bold text-lg ${
                          participant.percentage >= 80 ? 'bg-green-100 text-green-700' :
                          participant.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {participant.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center text-sm text-gray-600 font-medium">
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
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate(`/quiz-results/${quizId}`)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
          >
             View My Answers
          </button>
          <button
            onClick={() => navigate('/student')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
          >
             Take Another Quiz
          </button>
        </div>

        {/* Auto-refresh indicator */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-gray-100 rounded-full px-6 py-3 shadow-md border border-gray-200">
            <p className="text-sm text-gray-700 flex items-center gap-2 font-semibold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
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