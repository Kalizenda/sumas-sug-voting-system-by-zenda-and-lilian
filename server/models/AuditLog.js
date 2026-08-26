const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'vote_cast',
      'candidate_registered',
      'candidate_approved',
      'candidate_rejected',
      'voter_registered',
      'voter_approved',
      'voter_rejected',
      'election_created',
      'election_started',
      'election_ended',
      'position_created',
      'position_updated',
      'position_deleted',
      'settings_updated',
      'results_published',
      'biometric_verification',
      'system_access'
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'pending'],
    default: 'success'
  }
});

// Index for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);