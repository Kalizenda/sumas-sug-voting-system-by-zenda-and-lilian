const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Voter = require('../models/Voter');
const Position = require('../models/Position');
const Election = require('../models/Election');

// Cast vote
router.post('/vote', async (req, res) => {
  try {
    const io = req.app.get('io');
    const { voterId, candidateId, electionId, positionId, ipAddress } = req.body;
    
    // Check if voter has already voted for this position
    const existingVote = await Vote.findOne({
      voterId,
      positionId,
      electionId
    });
    
    if (existingVote) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already voted for this position' 
      });
    }
    
    // Check if election is active
    const election = await Election.findById(electionId);
    if (!election || election.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Election is not active' 
      });
    }
    
    // Create vote record
    const vote = new Vote({
      voterId,
      candidateId,
      electionId,
      positionId,
      ipAddress,
      biometricVerified: true
    });
    
    await vote.save();
    
    // Update candidate vote count
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votes: 1 } },
      { new: true }
    );
    
    // Update voter status
    await Voter.findByIdAndUpdate(
      voterId,
      { 
        $addToSet: { votedPositions: positionId },
        hasVoted: true
      }
    );
    
    // Emit real-time update
    io.emit('voteUpdate', { 
      candidateId, 
      votes: candidate.votes,
      positionId,
      electionId
    });
    
    // Broadcast current results
    const allCandidates = await Candidate.find();
    io.emit('currentResults', { candidates: allCandidates });
    
    res.json({ 
      success: true, 
      message: 'Vote cast successfully',
      vote,
      candidate
    });
  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get votes by election
router.get('/votes/election/:electionId', async (req, res) => {
  try {
    const votes = await Vote.find({ electionId: req.params.electionId })
      .populate('voterId', 'fullName matricNumber')
      .populate('candidateId', 'fullName position')
      .populate('positionId', 'title')
      .sort({ timestamp: -1 });
    
    res.json({ success: true, votes });
  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get votes by position
router.get('/votes/position/:positionId', async (req, res) => {
  try {
    const votes = await Vote.find({ positionId: req.params.positionId })
      .populate('voterId', 'fullName matricNumber')
      .populate('candidateId', 'fullName')
      .sort({ timestamp: -1 });
    
    res.json({ success: true, votes });
  } catch (error) {
    console.error('Get votes by position error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get voter's votes
router.get('/votes/voter/:voterId', async (req, res) => {
  try {
    const votes = await Vote.find({ voterId: req.params.voterId })
      .populate('candidateId', 'fullName position')
      .populate('positionId', 'title')
      .sort({ timestamp: -1 });
    
    res.json({ success: true, votes });
  } catch (error) {
    console.error('Get voter votes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get vote statistics by position
router.get('/votes/statistics/position/:positionId', async (req, res) => {
  try {
    const candidates = await Candidate.find({ position: req.params.positionId });
    const totalVotes = await Vote.countDocuments({ positionId: req.params.positionId });
    
    const candidateStats = await Promise.all(
      candidates.map(async (candidate) => {
        const voteCount = await Vote.countDocuments({ 
          candidateId: candidate._id,
          positionId: req.params.positionId 
        });
        const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(2) : 0;
        
        return {
          candidateId: candidate._id,
          candidateName: candidate.fullName,
          votes: voteCount,
          percentage: parseFloat(percentage)
        };
      })
    );
    
    // Sort by votes descending
    candidateStats.sort((a, b) => b.votes - a.votes);
    
    res.json({ 
      success: true, 
      statistics: {
        totalVotes,
        positionId: req.params.positionId,
        candidates: candidateStats
      }
    });
  } catch (error) {
    console.error('Get vote statistics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete vote (admin only)
router.delete('/vote/:id', async (req, res) => {
  try {
    const io = req.app.get('io');
    const vote = await Vote.findByIdAndDelete(req.params.id);
    
    if (!vote) {
      return res.status(404).json({ success: false, message: 'Vote not found' });
    }
    
    // Decrement candidate vote count
    await Candidate.findByIdAndUpdate(
      vote.candidateId,
      { $inc: { votes: -1 } }
    );
    
    // Update voter status
    const voter = await Voter.findById(vote.voterId);
    if (voter) {
      voter.votedPositions = voter.votedPositions.filter(
        pos => !pos.equals(vote.positionId)
      );
      voter.hasVoted = voter.votedPositions.length > 0;
      await voter.save();
    }
    
    // Emit update
    io.emit('voteUpdate', { 
      candidateId: vote.candidateId,
      positionId: vote.positionId,
      action: 'deleted'
    });
    
    res.json({ success: true, message: 'Vote deleted successfully' });
  } catch (error) {
    console.error('Delete vote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;