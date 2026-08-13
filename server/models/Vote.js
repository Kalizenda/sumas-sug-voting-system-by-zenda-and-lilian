const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  biometricVerified: {
    type: Boolean,
    default: true
  }
});

// Compound index to prevent duplicate votes
voteSchema.index({ voterId: 1, positionId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);