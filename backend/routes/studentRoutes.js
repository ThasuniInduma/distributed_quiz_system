import express from 'express';
import Quiz from '../models/quizModel.js';
import Participant from '../models/participantsModel.js';

const studentRouter = express.Router();

// ======================
// JOIN QUIZ - Student enters Quiz ID
// ======================
studentRouter.post('/join-quiz', async (req, res) => {
  try {
    const { quizId, studentName, studentEmail } = req.body;

    if (!quizId || !studentName || !studentEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz ID, name, and email are required' 
      });
    }

    // Find quiz by quizId
    const quiz = await Quiz.findOne({ quizId: quizId.toUpperCase() });
    
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found. Please check the Quiz ID.' 
      });
    }

    // Check if student already joined
    let participant = await Participant.findOne({
      quizId: quiz.quizId,
      email: studentEmail
    });

    if (!participant) {
      // Create new participant entry
      participant = await Participant.create({
        quizId: quiz.quizId,
        name: studentName,
        email: studentEmail,
        answers: [],
        completed: false
      });
    }

    res.json({ 
      success: true, 
      message: 'Successfully joined quiz',
      quiz: {
        quizId: quiz.quizId,
        name: quiz.name
      }
    });
  } catch (error) {
    console.error('Join quiz error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ======================
// GET QUIZ - For students (without correct answers)
// ======================
studentRouter.get('/quiz/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizId: req.params.quizId.toUpperCase() });
    
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }

    // Return quiz data without correct answers (students shouldn't see them yet)
    const quizData = {
      _id: quiz._id,
      quizId: quiz.quizId,
      name: quiz.name,
      date: quiz.date,
      time: quiz.time,
      duration: quiz.duration,
      questions: quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        choices: q.choices
        // Note: correctAnswer is NOT included
      }))
    };

    res.json({ success: true, quiz: quizData });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ======================
// SUBMIT QUIZ - Student submits answers
// ======================
studentRouter.post('/submit-quiz', async (req, res) => {
  try {
    const { quizId, studentName, studentEmail, answers } = req.body;

    if (!quizId || !studentEmail || !answers) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz ID, email, and answers are required' 
      });
    }

    // Find the quiz
    const quiz = await Quiz.findOne({ quizId: quizId.toUpperCase() });
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }

    // Check if already submitted
    const existingParticipant = await Participant.findOne({ 
      quizId: quiz.quizId, 
      email: studentEmail,
      completed: true 
    });

    if (existingParticipant) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already submitted this quiz' 
      });
    }

    // Update or create participant with answers
    const participant = await Participant.findOneAndUpdate(
      { quizId: quiz.quizId, email: studentEmail },
      {
        name: studentName,
        email: studentEmail,
        answers: answers,
        completed: true,
        completedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Update quiz participant count
    const participantCount = await Participant.countDocuments({ 
      quizId: quiz.quizId,
      completed: true 
    });
    
    quiz.participants = participantCount;
    await quiz.save();

    res.json({ 
      success: true, 
      message: 'Quiz submitted successfully',
      participantId: participant._id
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ======================
// GET RESULTS - Student views their results
// ======================
studentRouter.get('/results/:quizId/:email', async (req, res) => {
  try {
    const { quizId, email } = req.params;

    // Find the quiz with correct answers
    const quiz = await Quiz.findOne({ quizId: quizId.toUpperCase() });
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }

    // Find the participant's submission
    const participant = await Participant.findOne({ 
      quizId: quiz.quizId, 
      email: email 
    });
    
    if (!participant) {
      return res.status(404).json({ 
        success: false, 
        message: 'No submission found for this email' 
      });
    }

    if (!participant.completed) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz not completed yet' 
      });
    }

    // Return quiz with correct answers and user's answers
    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        quizId: quiz.quizId,
        name: quiz.name,
        date: quiz.date,
        time: quiz.time,
        duration: quiz.duration,
        questions: quiz.questions // Include correct answers for results
      },
      userAnswers: participant.answers,
      completedAt: participant.completedAt
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ======================
// GET LEADERBOARD - View rankings
// ======================
studentRouter.get('/leaderboard/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find the quiz
    const quiz = await Quiz.findOne({ quizId: quizId.toUpperCase() });
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }

    // Get all completed participants
    const participants = await Participant.find({ 
      quizId: quiz.quizId,
      completed: true 
    }).sort({ completedAt: 1 }); // Sort by completion time

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        quizId: quiz.quizId,
        name: quiz.name,
        questions: quiz.questions // Include for score calculation
      },
      participants: participants
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default studentRouter;