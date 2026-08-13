const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Make optional for backward compatibility
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false // Use 'pass' field instead for backward compatibility
  },
  matricNumber: {
    type: String,
    required: false, // Make optional for backward compatibility
    unique: false, // Remove unique constraint for testing
    uppercase: true,
    sparse: true // Allow multiple null/undefined values
  },
  fullName: {
    type: String,
    required: false // Make optional for backward compatibility
  },
  department: {
    type: String,
    required: false // Make optional for backward compatibility
  },
  level: {
    type: String,
    required: false // Make optional for backward compatibility
  },
  faculty: {
    type: String,
    required: false // Make optional for backward compatibility
  },
  phoneNumber: {
    type: String,
    required: false // Make optional for backward compatibility
  },
  role: {
    type: String,
    enum: ['voter', 'candidate', 'admin'],
    default: 'voter'
  },
  facialData: [{
    type: mongoose.Schema.Types.Mixed
  }],
  facialImages: [{
    type: String // Store base64 image strings
  }],
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedPositions: [{
    type: String // Store position names as strings
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  // Legacy fields for compatibility
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  age: {
    type: Number
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  dob: {
    type: Date
  },
  voterid: {
    type: Number
  },
  phone: {
    type: Number
  },
  image: {
    type: String
  },
  pass: {
    type: String,
    required: true // This is the main password field
  },
  voteStatus: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Voter', voterSchema);