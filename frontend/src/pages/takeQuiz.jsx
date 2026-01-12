// pages/TakeQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TakeQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const studentName = sessionStorage.getItem('studentName');
    const studentEmail = sessionStorage.getItem('studentEmail');
    
    if (!studentName || !studentEmail) {
      navigate('/student');
      return;
    }

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (!quizData) return;

    const startTime = new Date(`${quizData.date}T${quizData.time}`);
    const endTime = new Date(startTime.getTime() + quizData.duration * 60000);
    const now = new Date();
    
    const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
    setTimeRemaining(remaining);

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizData]);

  const fetchQuizData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/student/quiz/${quizId}`);
      if (response.data.success) {
        const quiz = response.data.quiz;
        
        const startTime = new Date(`${quiz.date}T${quiz.time}`);
        const endTime = new Date(startTime.getTime() + quiz.duration * 60000);
        const now = new Date();
        
        if (now < startTime) {
          alert('Quiz has not started yet');
          navigate(`/quiz-lobby/${quizId}`);
          return;
        }
        
        if (now > endTime) {
          alert('Quiz has already ended');
          navigate(`/quiz-lobby/${quizId}`);
          return;
        }
        
        setQuizData(quiz);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Error loading quiz');
      navigate('/student');
    }
  };

  const handleAnswerSelect = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAutoSubmit = () => {
    submitQuiz(true);
  };

  const handleManualSubmit = () => {
    const unanswered = quizData.questions.length - Object.keys(answers).filter(key => answers[key]).length;
    
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered question(s). Do you want to submit anyway?`)) {
        return;
      }
    } else {
      if (!window.confirm('Are you sure you want to submit your quiz?')) {
        return;
      }
    }
    
    submitQuiz(false);
  };

  const submitQuiz = async (isAutoSubmit) => {
    if (submitting) return;
    
    setSubmitting(true);

    const studentName = sessionStorage.getItem('studentName');
    const studentEmail = sessionStorage.getItem('studentEmail');

    try {
      const answersArray = quizData.questions.map((_, index) => answers[index] || '');

      const response = await axios.post('http://localhost:4000/api/student/submit-quiz', {
        quizId: quizData.quizId,
        studentName,
        studentEmail,
        answers: answersArray
      });

      if (response.data.success) {
        if (isAutoSubmit) {
          alert('Time is up! Your quiz has been submitted automatically.');
        }
        navigate(`/quiz-results/${quizId}`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz: ' + (error.response?.data?.message || error.message));
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(key => answers[key]).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold text-xl">Submitting your quiz...</p>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const isTimeRunningOut = timeRemaining < 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{quizData.name}</h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </p>
            </div>
            <div className={`text-3xl font-bold font-mono ${isTimeRunningOut ? 'text-red-600 animate-pulse' : 'text-cyan-600'}`}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          </div>
          
          {isTimeRunningOut && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Less than 1 minute remaining!
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-md p-3">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {getAnsweredCount()} / {quizData.questions.length} answered</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                {currentQuestion + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed break-words">{question.question}</h3>
                {!answers[currentQuestion] && (
                  <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Not answered yet
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {question.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(choice)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                  answers[currentQuestion] === choice
                    ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-800 font-semibold shadow-md'
                    : 'border-gray-200 hover:border-cyan-300 bg-white text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    answers[currentQuestion] === choice
                      ? 'border-cyan-500 bg-cyan-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === choice && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-semibold text-gray-600 min-w-[20px]">{String.fromCharCode(65 + index)}.</span>
                  <span className="flex-1 break-words">{choice}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Jump to Question:</p>
          <div className="flex flex-wrap gap-2">
            {quizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg font-bold text-sm transition-all ${
                  index === currentQuestion
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg scale-110'
                    : answers[index]
                    ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                }`}
                title={answers[index] ? 'Answered' : 'Not answered'}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 md:px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex gap-3 flex-wrap">
            {currentQuestion === quizData.questions.length - 1 ? (
              <button
                onClick={handleManualSubmit}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 md:px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-4 md:px-6 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;