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
    type: Number,
    required: false // Make optional
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
    type: Number,
    required: false // Make optional to avoid validation errors
  },
  phone: {
    type: Number,
    required: false, // Make optional to avoid validation errors
    validate: {
      validator: function(v) {
        // If value is null, undefined, or NaN, it's valid (optional field)
        if (v === null || v === undefined || isNaN(v)) return true;
        // Otherwise, must be a positive number
        return v > 0;
      },
      message: 'Phone number must be a valid positive number'
    }
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