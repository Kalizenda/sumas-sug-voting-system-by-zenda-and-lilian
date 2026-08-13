const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const Vote = require('../models/Vote');
const Voter = require('../models/Voter');

// Create new election
router.post('/election', async (req, res) => {
  try {
    const { title, description, startDate, endDate, createdBy } = req.body;
    
    console.log('Creating election with data:', { title, description, startDate, endDate });
    
    const election = new Election({
      title,
      description,
      startDate,
      endDate,
      createdBy,
      status: 'draft'
    });
    
    await election.save();
    console.log('Election saved successfully with ID:', election._id);
    res.json({ success: true, election });
  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all elections
router.get('/elections', async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('positions')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, elections });
  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get active election
router.get('/election/active', async (req, res) => {
  try {
    let election = await Election.findOne({ status: 'active' })
      .populate('positions')
      .populate('createdBy', 'fullName email');
    
    // If no active election, create and activate one automatically
    if (!election) {
      console.log('No active election found, creating default election...');
      const newElection = new Election({
        title: 'Nigerian Student Union Government Elections 2026',
        description: 'Student Union Government Elections for Nigerian Universities - 2026/2027 Academic Session',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active',
        isActive: true
      });
      
      await newElection.save();
      console.log('Default election created and activated:', newElection._id);
      election = newElection;
    }
    
    res.json({ success: true, election });
  } catch (error) {
    console.error('Get active election error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get election by ID
router.get('/election/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('positions')
      .populate('createdBy', 'fullName email');
    
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }
    
    res.json({ success: true, election });
  } catch (error) {
    console.error('Get election error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update election
router.put('/election/:id', async (req, res) => {
  try {
    const { title, description, startDate, endDate, status } = req.body;
    
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { title, description, startDate, endDate, status },
      { new: true }
    );
    
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }
    
    res.json({ success: true, election });
  } catch (error) {
    console.error('Update election error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Activate election
router.put('/election/:id/activate', async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { status: 'active', isActive: true },
      { new: true }
    );
    
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }
    
    res.json({ success: true, election });
  } catch (error) {
    console.error('Activate election error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// End election
router.put('/election/:id/end', async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { status: 'ended', isActive: false },
      { new: true }
    );
    
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }
    
    res.json({ success: true, election });
  } catch (error) {
    console.error('End election error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete election
router.delete('/election/:id', async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }
    
    // Also delete related positions and votes
    await Position.deleteMany({ electionId: req.params.id });
    await Vote.deleteMany({ electionId: req.params.id });
    
    res.json({ success: true, message: 'Election deleted successfully' });
  } catch (error) {
    console.error('Delete election error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get election statistics
router.get('/election/:id/statistics', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }
    
    const totalVoters = await Voter.countDocuments({ isApproved: true });
    const totalCandidates = await Candidate.countDocuments({ isApproved: true });
    const totalVotes = await Vote.countDocuments({ electionId: req.params.id });
    const voterTurnout = totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(2) : 0;
    
    res.json({
      success: true,
      statistics: {
        totalVoters,
        totalCandidates,
        totalVotes,
        voterTurnout: parseFloat(voterTurnout),
        electionStatus: election.status
      }
    });
  } catch (error) {
    console.error('Get election statistics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;