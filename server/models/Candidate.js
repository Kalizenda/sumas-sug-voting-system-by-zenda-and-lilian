const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  candidateId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voter'
  },
  fullName: {
    type: String,
    required: true
  },
  matricNumber: {
    type: String,
    required: true,
    uppercase: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: [
      'President',
      'Vice President',
      'Secretary General',
      'Assistant Secretary General',
      'Treasurer',
      'Financial Secretary',
      'Director of Socials',
      'Director of Sports',
      'Director of Welfare',
      'Public Relations Officer',
      'Women Affairs Commissioner',
      'Student Senate Representative'
    ]
  },
  manifesto: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  campaignSlogan: {
    type: String
  },
  votes: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);