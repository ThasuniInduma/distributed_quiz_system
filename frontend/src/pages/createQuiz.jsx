// pages/CreateQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [quizName, setQuizName] = useState('');
  const [quizDate, setQuizDate] = useState('');
  const [quizTime, setQuizTime] = useState('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      choices: ['', ''],
      correctAnswerIndex: null
    }
  ]);

  useEffect(() => {
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

  const addChoice = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices.push('');
    setQuestions(newQuestions);
  };

  const updateQuestion = (questionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].question = value;
    setQuestions(newQuestions);
  };

  const updateChoice = (questionIndex, choiceIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[choiceIndex] = value;
    setQuestions(newQuestions);
  };

  const selectCorrectAnswer = (questionIndex, choiceIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswerIndex = choiceIndex;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: '',
        choices: ['', ''],
        correctAnswerIndex: null
      }
    ]);
  };

  const saveQuiz = async () => {
    if (!quizName || !quizDate || !quizTime || !duration) {
      alert('Please fill in all quiz details');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question) {
        alert(`Please fill in question ${i + 1}`);
        return;
      }
      if (questions[i].choices.some(c => !c)) {
        alert(`Please fill in all choices for question ${i + 1}`);
        return;
      }
      if (questions[i].correctAnswerIndex === null) {
        alert(`Please select the correct answer for question ${i + 1}`);
        return;
      }
    }

    const quizData = {
      name: quizName,
      date: quizDate,
      time: quizTime,
      duration: parseInt(duration),
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        choices: q.choices,
        correctAnswer: q.choices[q.correctAnswerIndex]
      }))
    };

    try {
      const response = await axios.post('http://localhost:4000/api/quizzes', quizData, {
        withCredentials: true
      });

      if (response.data.success) {
        alert('Quiz created successfully! Quiz ID: ' + response.data.quiz.quizId);
        navigate('/my-quizzes');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      if (error.response?.status === 401) {
        alert('You must be logged in as a teacher to create a quiz');
        navigate('/login');
      } else {
        alert('Error creating quiz: ' + (error.response?.data?.message || error.message));
      }
    }
  };

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
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-500 text-white w-8 h-8 rounded flex items-center justify-center font-bold">
                1
              </div>
              <input
                type="text"
                placeholder="Enter the Name Of The Quiz..."
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className="flex-1 border-0 focus:outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Date</label>
                <input
                  type="date"
                  value={quizDate}
                  onChange={(e) => setQuizDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Time</label>
                <input
                  type="time"
                  value={quizTime}
                  onChange={(e) => setQuizTime(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-cyan-500 text-white w-8 h-8 rounded flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-lg font-semibold">Quiz Questions :</h2>
            </div>

            {questions.map((q, qIndex) => (
              <div key={q.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question {qIndex + 1}
                  </label>
                  <input
                    type="text"
                    placeholder="Your Question Here..."
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Choices</label>
                  {q.choices.map((choice, cIndex) => (
                    <div key={cIndex} className="flex items-center gap-4 mb-3">
                      <span className="text-gray-600 font-medium min-w-[30px]">
                        {String.fromCharCode(65 + cIndex)}:
                      </span>
                      <input
                        type="text"
                        placeholder={`Add Your ${cIndex === 0 ? 'First' : cIndex === 1 ? 'Second' : 'Next'} Choice`}
                        value={choice}
                        onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addChoice(qIndex)}
                    className="bg-cyan-500 hover:bg-cyan-800 text-white px-6 py-2 rounded mt-2 transition-colors"
                  >
                    Add a New Choice
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Correct Answer
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {q.choices.map((choice, cIndex) => (
                      choice && (
                        <button
                          key={cIndex}
                          onClick={() => selectCorrectAnswer(qIndex, cIndex)}
                          className={`p-3 rounded border-2 text-left transition-all ${
                            q.correctAnswerIndex === cIndex
                              ? 'border-cyan-700 bg-cyan-50 text-cyan-700 font-medium'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-cyan-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              q.correctAnswerIndex === cIndex
                                ? 'border-cyan-700 bg-cyan-700'
                                : 'border-gray-300'
                            }`}>
                              {q.correctAnswerIndex === cIndex && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm">{String.fromCharCode(65 + cIndex)}: {choice}</span>
                          </div>
                        </button>
                      )
                    ))}
                  </div>
                  {!q.choices.some(c => c) && (
                    <p className="text-gray-400 text-sm mt-2">Add choices above to select the correct answer</p>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="bg-cyan-500 hover:bg-cyan-800 text-white px-6 py-3 rounded mb-6 transition-colors"
            >
              Add a New Question
            </button>

            <div className="flex gap-4">
              <button
                onClick={saveQuiz}
                className="bg-cyan-500 hover:bg-cyan-800 text-white px-8 py-3 rounded transition-colors"
              >
                Save Quiz
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-3 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;