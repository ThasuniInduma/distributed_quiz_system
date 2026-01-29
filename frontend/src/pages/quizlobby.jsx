import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Timer, FileQuestion, Users, Trophy, Play, Home, AlertCircle } from 'lucide-react';

export const QuizLobby = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const studentName = sessionStorage.getItem('studentName');
    const studentEmail = sessionStorage.getItem('studentEmail');

    if (!studentName || !studentEmail) {
      navigate('/student');
      return;
    }

    fetchQuizData();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const participantsInterval = setInterval(() => {
      fetchParticipants();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(participantsInterval);
    };
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/student/quiz/${quizId}`);
      if (response.data.success) {
        setQuizData(response.data.quiz);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Quiz not found');
      navigate('/student');
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/quizzes/${quizId}/participants`);
      if (response.data.success) {
        setParticipants(response.data.participants || []);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const getQuizStatus = () => {
    if (!quizData) return 'loading';

    const startTime = new Date(`${quizData.date}T${quizData.time}`);
    const endTime = new Date(startTime.getTime() + quizData.duration * 60000);

    if (currentTime < startTime) return 'upcoming';
    if (currentTime >= startTime && currentTime <= endTime) return 'live';
    return 'ended';
  };

  const getCountdown = () => {
    if (!quizData) return '';

    const startTime = new Date(`${quizData.date}T${quizData.time}`);
    const diff = startTime - currentTime;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const handleStartQuiz = () => {
    navigate(`/take-quiz/${quizId}`);
  };

  const status = getQuizStatus();
  const countdown = getCountdown();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{quizData.name}</h1>
            <p className="text-gray-600 mb-4">
              Quiz ID: <span className="font-mono font-bold text-cyan-600 text-xl">{quizData.quizId}</span>
            </p>

            <div className="flex justify-center gap-6 text-sm text-gray-600 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span>{quizData.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>{quizData.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-red-500" />
                <span>{quizData.duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-blue-500" />
                <span>{quizData.questions.length} questions</span>
              </div>
            </div>

            {status === 'upcoming' && countdown && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-8">
                <div className="text-yellow-800 font-semibold text-lg mb-3">Quiz starts in</div>
                <div className="text-5xl font-bold text-yellow-600 mb-4 font-mono">{countdown}</div>
                <div className="flex justify-center gap-2 mb-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                </div>
                <p className="text-sm text-yellow-700">Get ready! The quiz will start automatically</p>
              </div>
            )}

            {status === 'live' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8">
                <div className="flex items-center justify-center gap-2 text-green-800 font-semibold text-xl mb-4">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                  </span>
                  Quiz is LIVE NOW!
                </div>
                <button
                  onClick={handleStartQuiz}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto"
                >
                  <span>Start Quiz Now</span>
                  <Play className="w-5 h-5" fill="currentColor" />
                </button>
              </div>
            )}

            {status === 'ended' && (
              <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-8">
                <div className="flex items-center justify-center gap-2 text-gray-800 font-semibold text-xl mb-2">
                  <AlertCircle className="w-6 h-6 text-gray-500" />
                  Quiz has ended
                </div>
                <p className="text-gray-600 mb-4">This quiz is no longer accepting responses</p>
                <button
                  onClick={() => navigate('/student')}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 mx-auto"
                >
                  <Home className="w-4 h-4" />
                  Join Another Quiz
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-600" />
            <span>Participants ({participants.length})</span>
          </h2>

          {participants.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Waiting for participants...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3 border border-cyan-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">{participant.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};