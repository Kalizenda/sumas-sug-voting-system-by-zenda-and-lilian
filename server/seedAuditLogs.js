const mongoose = require('mongoose');
const AuditLog = require('./models/AuditLog');

require('dotenv').config();

const sampleAuditLogs = [
  {
    action: 'login',
    status: 'success',
    details: { message: 'Admin logged in successfully' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'vote_cast',
    status: 'success',
    details: { message: 'Vote cast for President position', candidateId: 'candidate_001' },
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'candidate_registered',
    status: 'success',
    details: { message: 'New candidate registered for Vice President', candidateName: 'John Doe' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'voter_registered',
    status: 'success',
    details: { message: 'New voter registered', matricNumber: 'UMAS/2024/001' },
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    action: 'election_created',
    status: 'success',
    details: { message: 'New election created for 2026 SUG Elections' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'biometric_verification',
    status: 'success',
    details: { message: 'Biometric verification passed', voterId: 'voter_001' },
    ipAddress: '192.168.1.115',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'logout',
    status: 'success',
    details: { message: 'User logged out' },
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'candidate_approved',
    status: 'success',
    details: { message: 'Candidate approved by electoral commission', candidateName: 'Jane Smith' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'position_created',
    status: 'success',
    details: { message: 'New position created: Student Senate Representative' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'settings_updated',
    status: 'success',
    details: { message: 'System settings updated by admin' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'vote_cast',
    status: 'success',
    details: { message: 'Vote cast for Secretary General position', candidateId: 'candidate_002' },
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    action: 'voter_approved',
    status: 'success',
    details: { message: 'Voter approved by admin', matricNumber: 'UMAS/2024/002' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'election_started',
    status: 'success',
    details: { message: 'Election started successfully' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'candidate_rejected',
    status: 'failure',
    details: { message: 'Candidate rejected due to incomplete documentation', candidateName: 'Test User' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'biometric_verification',
    status: 'failure',
    details: { message: 'Biometric verification failed - fingerprint mismatch', voterId: 'voter_003' },
    ipAddress: '192.168.1.125',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'results_published',
    status: 'success',
    details: { message: 'Election results published to public portal' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'position_updated',
    status: 'success',
    details: { message: 'Position description updated: President' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    action: 'login',
    status: 'success',
    details: { message: 'Electoral commission member logged in' },
    ipAddress: '192.168.1.130',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    action: 'vote_cast',
    status: 'success',
    details: { message: 'Vote cast for Financial Secretary position', candidateId: 'candidate_003' },
    ipAddress: '192.168.1.135',
    userAgent: 'Mozilla/5.0 (Android 10; Mobile) AppleWebKit/537.36'
  },
  {
    action: 'system_access',
    status: 'success',
    details: { message: 'System accessed by admin for maintenance' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

async function seedAuditLogs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/online-voting');
    console.log('Connected to MongoDB');

    // Clear existing audit logs
    await AuditLog.deleteMany({});
    console.log('Cleared existing audit logs');

    // Insert sample audit logs with timestamps spread over the last 7 days
    const now = new Date();
    const logsToInsert = sampleAuditLogs.map((log, index) => {
      const timestamp = new Date(now.getTime() - (index * 3600000)); // Spread over hours
      return {
        ...log,
        timestamp: timestamp
      };
    });

    await AuditLog.insertMany(logsToInsert);
    console.log(`Inserted ${logsToInsert.length} audit logs`);

    console.log('Audit logs seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding audit logs:', error);
    process.exit(1);
  }
}

seedAuditLogs();
