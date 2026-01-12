import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'
import Student from './pages/student'
import Teacher from './pages/teacher'
import Admin from './pages/admin'
import CreateQuiz from './pages/createQuiz'
import MyQuizzes from './pages/myQuizzes'
import QuizEdit from './pages/quizEdit'
import QuizParticipants from './pages/quizParticipants'
import { QuizLobby } from './pages/quizlobby'
import TakeQuiz from './pages/takeQuiz'
import QuizResults from './pages/quizResults'
import Leaderboard from './pages/leaderboard'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/student' element={<Student/>}/>
        <Route path='/teacher' element={<Teacher/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/my-quizzes" element={<MyQuizzes />} />
        <Route path="/quiz-edit/:quizId" element={<QuizEdit />} />
        <Route path="/quiz-participants/:quizId" element={<QuizParticipants />} />
        <Route path="/quiz-lobby/:quizId" element={<QuizLobby />} />
        <Route path="/take-quiz/:quizId" element={<TakeQuiz />} />
        <Route path="/quiz-results/:quizId" element={<QuizResults />} />
        <Route path="/leaderboard/:quizId" element={<Leaderboard />} />
      </Routes>
    </>
  )
}

export default App
