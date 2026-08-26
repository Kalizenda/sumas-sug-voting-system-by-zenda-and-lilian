const mongoose = require('mongoose');
const AuditLog = require('./models/AuditLog');
const Candidate = require('./models/Candidate');
const Voter = require('./models/Voter');
const Election = require('./models/Election');
const Position = require('./models/Position');
const Vote = require('./models/Vote');

require('dotenv').config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/online-voting');
    console.log('Connected to MongoDB\n');

    // Check candidates
    const candidates = await Candidate.find({});
    console.log(`Candidates: ${candidates.length}`);
    candidates.forEach(c => console.log(`  - ${c.fullName} (${c.position}) - ${c.votes || 0} votes`));

    // Check voters
    const voters = await Voter.find({});
    console.log(`\nVoters: ${voters.length}`);
    voters.forEach(v => console.log(`  - ${v.fullName} (${v.matricNumber}) - ${v.hasVoted ? 'Voted' : 'Not Voted'}`));

    // Check elections
    const elections = await Election.find({});
    console.log(`\nElections: ${elections.length}`);
    elections.forEach(e => console.log(`  - ${e.name} (${e.status})`));

    // Check positions
    const positions = await Position.find({});
    console.log(`\nPositions: ${positions.length}`);
    positions.forEach(p => console.log(`  - ${p.name}`));

    // Check votes
    const votes = await Vote.find({});
    console.log(`\nVotes: ${votes.length}`);

    // Check existing audit logs
    const auditLogs = await AuditLog.find({});
    console.log(`\nExisting Audit Logs: ${auditLogs.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
