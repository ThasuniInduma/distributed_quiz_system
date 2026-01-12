import express from 'express';
import Quiz from '../models/quizModel.js';
import Participant from '../models/participantsModel.js'; // ADD THIS
import userAuth from '../middleware/userAuth.js';

const quizRouter = express.Router();

// Generate unique quiz ID
const generateQuizId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// ======================
// GET all quizzes for logged-in teacher
// ======================
quizRouter.get('/', userAuth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================
// GET single quiz for students to join (no auth needed)
// ======================
quizRouter.get('/join/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizId: req.params.quizId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Hide correct answers from students
    const quizData = {
      _id: quiz._id,
      quizId: quiz.quizId,
      name: quiz.name,
      duration: quiz.duration,
      isActive: quiz.isActive,
      date: quiz.date,
      time: quiz.time,
      questions: quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        choices: q.choices
      }))
    };

    res.json({ success: true, quiz: quizData });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

// ======================
// GET single quiz (teacher only)
// ======================
quizRouter.get('/:id', userAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found or you do not have permission' });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

// ======================
// GET PARTICIPANTS - Teacher views quiz participants (NEW)
// ======================
quizRouter.get('/:id/participants', userAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found or you do not have permission' 
      });
    }

    const participants = await Participant.find({ 
      quizId: quiz.quizId 
    }).sort({ joinedAt: -1 });

    res.json({ 
      success: true, 
      participants,
      quiz: {
        quizId: quiz.quizId,
        name: quiz.name,
        questions: quiz.questions
      }
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ======================
// CREATE quiz (teacher only)
// ======================
quizRouter.post('/', userAuth, async (req, res) => {
  try {
    const quizId = generateQuizId();

    const quizData = {
      ...req.body,
      quizId,
      teacherId: req.user.id
    };

    const quiz = new Quiz(quizData);
    await quiz.save();

    res.status(201).json({ success: true, quiz, message: 'Quiz created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ======================
// UPDATE quiz (teacher only)
// ======================
quizRouter.put('/:id', userAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found or you do not have permission to edit it' });
    }

    Object.assign(quiz, req.body);
    await quiz.save();

    res.json({ success: true, quiz, message: 'Quiz updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ======================
// TOGGLE quiz active status (teacher only)
// ======================
quizRouter.patch('/:id/toggle-active', userAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found or you do not have permission' });
    }

    quiz.isActive = !quiz.isActive;
    await quiz.save();

    res.json({ success: true, quiz, message: `Quiz ${quiz.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ======================
// DELETE quiz (teacher only)
// ======================
quizRouter.delete('/:id', userAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found or you do not have permission to delete it' });
    }

    // Delete all participants for this quiz
    await Participant.deleteMany({ quizId: quiz.quizId });
    
    // Delete the quiz
    await Quiz.findByIdAndDelete(quiz._id);

    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ======================
// JOIN quiz (increment participant count)
// ======================
quizRouter.post('/join/:quizId/participate', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizId: req.params.quizId });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (!quiz.isActive) {
      return res.status(400).json({ success: false, message: 'Quiz is not active' });
    }

    quiz.participants = (quiz.participants || 0) + 1;
    await quiz.save();

    res.json({ success: true, message: 'Successfully joined quiz' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default quizRouter;