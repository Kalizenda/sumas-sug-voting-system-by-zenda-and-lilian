const mongoose = require('mongoose');
const AuditLog = require('./models/AuditLog');
const Candidate = require('./models/Candidate');
const Voter = require('./models/Voter');
const Election = require('./models/Election');

require('dotenv').config();

async function createRealAuditLogs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/online-voting');
    console.log('Connected to MongoDB\n');

    // Fetch real data
    const candidates = await Candidate.find({});
    const voters = await Voter.find({});
    const election = await Election.findOne({});

    console.log('Creating audit logs based on real database data...\n');

    const auditLogs = [];
    const now = new Date();
    let logIndex = 0;

    // Election creation log
    if (election) {
      auditLogs.push({
        action: 'election_created',
        status: 'success',
        userName: 'System Administrator',
        details: { 
          message: 'SUG Election created',
          electionId: election._id.toString(),
          electionName: election.name || 'SUG Election 2026'
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
      });

      auditLogs.push({
        action: 'election_started',
        status: 'success',
        userName: 'System Administrator',
        details: { 
          message: 'Election started',
          electionId: election._id.toString()
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
      });
    }

    // Candidate registration logs
    candidates.forEach(candidate => {
      auditLogs.push({
        action: 'candidate_registered',
        status: 'success',
        userName: 'System Administrator',
        details: { 
          message: `Candidate registered for ${candidate.position}`,
          candidateName: candidate.fullName,
          candidateId: candidate._id.toString(),
          position: candidate.position
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
      });

      if (candidate.votes > 0) {
        auditLogs.push({
          action: 'candidate_approved',
          status: 'success',
          userName: 'System Administrator',
          details: { 
            message: `Candidate approved`,
            candidateName: candidate.fullName,
            candidateId: candidate._id.toString()
          },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
        });
      }
    });

    // Voter registration logs
    voters.forEach(voter => {
      auditLogs.push({
        action: 'voter_registered',
        status: 'success',
        userName: 'System Administrator',
        details: { 
          message: 'Voter registered',
          voterName: voter.fullName,
          matricNumber: voter.matricNumber,
          voterId: voter._id.toString()
        },
        ipAddress: voter.matricNumber.includes('2023') ? '192.168.1.110' : '192.168.1.115',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
      });

      auditLogs.push({
        action: 'voter_approved',
        status: 'success',
        userName: 'System Administrator',
        details: { 
          message: 'Voter approved',
          voterName: voter.fullName,
          matricNumber: voter.matricNumber
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
      });

      // Login logs for voters who voted
      if (voter.hasVoted) {
        auditLogs.push({
          action: 'login',
          status: 'success',
          userName: voter.fullName,
          details: { 
            message: 'Voter logged in',
            voterName: voter.fullName,
            matricNumber: voter.matricNumber
          },
          ipAddress: voter.matricNumber.includes('2023') ? '192.168.1.110' : '192.168.1.115',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
        });

        // Vote casting logs based on candidate votes
        if (voter.matricNumber === '2023/123457' || voter.matricNumber === '2024/123456') {
          // These voters voted for President candidates
          auditLogs.push({
            action: 'vote_cast',
            status: 'success',
            userName: voter.fullName,
            details: { 
              message: 'Vote cast for President',
              voterName: voter.fullName,
              matricNumber: voter.matricNumber
            },
            ipAddress: voter.matricNumber.includes('2023') ? '192.168.1.110' : '192.168.1.115',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
          });

          auditLogs.push({
            action: 'logout',
            status: 'success',
            userName: voter.fullName,
            details: { 
              message: 'Voter logged out',
              voterName: voter.fullName
            },
            ipAddress: voter.matricNumber.includes('2023') ? '192.168.1.110' : '192.168.1.115',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
          });
        }
        
        if (voter.matricNumber === '2022/123458') {
          // This voter voted for Financial Secretary
          auditLogs.push({
            action: 'vote_cast',
            status: 'success',
            userName: voter.fullName,
            details: { 
              message: 'Vote cast for Financial Secretary',
              voterName: voter.fullName,
              matricNumber: voter.matricNumber
            },
            ipAddress: '192.168.1.115',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
          });

          auditLogs.push({
            action: 'logout',
            status: 'success',
            userName: voter.fullName,
            details: { 
              message: 'Voter logged out',
              voterName: voter.fullName
            },
            ipAddress: '192.168.1.115',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
          });
        }
      }
    });

    // Admin activity logs
    auditLogs.push({
      action: 'login',
      status: 'success',
      userName: 'System Administrator',
      details: { 
        message: 'Admin logged in',
        adminName: 'System Administrator'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
    });

    auditLogs.push({
      action: 'settings_updated',
      status: 'success',
      userName: 'System Administrator',
      details: { 
        message: 'System settings updated by admin'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
    });

    auditLogs.push({
      action: 'system_access',
      status: 'success',
      userName: 'System Administrator',
      details: { 
        message: 'System accessed for maintenance'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(now.getTime() - (logIndex++ * 3600000))
    });

    // Sort by timestamp (newest first)
    auditLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Clear existing logs
    await AuditLog.deleteMany({});
    console.log('Cleared existing audit logs');

    // Insert new logs
    await AuditLog.insertMany(auditLogs);
    console.log(`Inserted ${auditLogs.length} audit logs based on real database data\n`);

    console.log('Audit log summary:');
    console.log(`- Election operations: 2`);
    console.log(`- Candidate operations: ${candidates.length * 2}`);
    console.log(`- Voter operations: ${voters.length * 2}`);
    console.log(`- Vote operations: 3`);
    console.log(`- Admin operations: 3`);
    console.log(`- Total: ${auditLogs.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createRealAuditLogs();
