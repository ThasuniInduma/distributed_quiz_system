import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  answers: {
    type: [String],
    default: []
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to prevent duplicate entries
participantSchema.index({ quizId: 1, email: 1 }, { unique: true });

const Participant = mongoose.model('Participant', participantSchema);
export default Participant;