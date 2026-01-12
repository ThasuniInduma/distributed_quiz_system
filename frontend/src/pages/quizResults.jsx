import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const QuizResults = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentEmail = sessionStorage.getItem('studentEmail');
    
    if (!studentEmail) {
      navigate('/student');
      return;
    }

    fetchResults();
  }, [quizId]);

  const fetchResults = async () => {
    try {
      const studentEmail = sessionStorage.getItem('studentEmail');
      
      const response = await axios.get(
        `http://localhost:4000/api/student/results/${quizId}/${studentEmail}`
      );

      if (response.data.success) {
        setQuizData(response.data.quiz);
        setUserAnswers(response.data.userAnswers);
        
        let correctCount = 0;
        response.data.quiz.questions.forEach((question, index) => {
          if (response.data.userAnswers[index] === question.correctAnswer) {
            correctCount++;
          }
        });
        setScore(correctCount);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('Error loading results');
      navigate('/student');
    }
  };

  const getPercentage = () => {
    if (!quizData) return 0;
    return ((score / quizData.questions.length) * 100).toFixed(1);
  };

  const getGrade = () => {
    const percentage = getPercentage();
    if (percentage >= 90) return { grade: 'A+', color: 'from-green-500 to-emerald-500', text: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'from-green-400 to-green-500', text: 'text-green-500' };
    if (percentage >= 70) return { grade: 'B', color: 'from-blue-400 to-blue-500', text: 'text-blue-500' };
    if (percentage >= 60) return { grade: 'C', color: 'from-yellow-400 to-yellow-500', text: 'text-yellow-600' };
    if (percentage >= 50) return { grade: 'D', color: 'from-orange-400 to-orange-500', text: 'text-orange-500' };
    return { grade: 'F', color: 'from-red-400 to-red-500', text: 'text-red-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading results...</p>
        </div>
      </div>
    );
  }

  const gradeInfo = getGrade();
  const percentage = getPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
          
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Completed! 🎉</h1>
            <p className="text-xl text-gray-600">{quizData.name}</p>
          </div>
          
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            <div className="text-center">
              <div className="text-6xl font-bold text-cyan-600 mb-2">{score}/{quizData.questions.length}</div>
              <div className="text-gray-600 font-semibold">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className={`text-6xl font-bold ${gradeInfo.text} mb-2`}>{percentage}%</div>
              <div className="text-gray-600 font-semibold">Score</div>
            </div>
            <div className="text-center">
              <div className={`text-6xl font-bold bg-gradient-to-r ${gradeInfo.color} bg-clip-text text-transparent mb-2`}>
                {gradeInfo.grade}
              </div>
              <div className="text-gray-600 font-semibold">Grade</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate(`/leaderboard/${quizId}`)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span>🏆</span>
              View Leaderboard
            </button>
            <button
              onClick={() => navigate('/student')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              Take Another Quiz
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📝</span>
            Answer Review
          </h2>
          
          {quizData.questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const wasAnswered = userAnswer && userAnswer.trim() !== '';
            
            return (
              <div key={index} className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                isCorrect ? 'border-green-500' : wasAnswered ? 'border-red-500' : 'border-gray-300'
              }`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${
                    isCorrect ? 'bg-green-500 text-white' : wasAnswered ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCorrect ? '✓' : wasAnswered ? '✗' : '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 flex-1">
                        Question {index + 1}: {question.question}
                      </h3>
                      {isCorrect && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                          Correct ✓
                        </span>
                      )}
                      {!isCorrect && wasAnswered && (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                          Incorrect ✗
                        </span>
                      )}
                      {!wasAnswered && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                          Not Answered
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      {question.choices.map((choice, choiceIndex) => {
                        const isUserAnswer = choice === userAnswer;
                        const isCorrectAnswer = choice === question.correctAnswer;
                        
                        let bgColor = 'bg-gray-50';
                        let borderColor = 'border-gray-200';
                        let textColor = 'text-gray-700';
                        let icon = null;
                        
                        if (isCorrectAnswer) {
                          bgColor = 'bg-green-50';
                          borderColor = 'border-green-500';
                          textColor = 'text-green-800';
                          icon = (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          );
                        } else if (isUserAnswer && !isCorrect) {
                          bgColor = 'bg-red-50';
                          borderColor = 'border-red-500';
                          textColor = 'text-red-800';
                          icon = (
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          );
                        }
                        
                        return (
                          <div
                            key={choiceIndex}
                            className={`p-4 rounded-xl border-2 ${bgColor} ${borderColor} ${textColor} transition-all`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1">
                                {icon}
                                <span className="font-semibold">{String.fromCharCode(65 + choiceIndex)}.</span>
                                <span className="flex-1">{choice}</span>
                              </div>
                              <div className="flex gap-2">
                                {isCorrectAnswer && (
                                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    ✓ Correct
                                  </span>
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                    Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/leaderboard/${quizId}`)}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all"
          >
            🏆 View Leaderboard & Compare Your Score
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;