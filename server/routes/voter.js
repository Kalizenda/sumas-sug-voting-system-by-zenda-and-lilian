const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');

// Get all voters
router.get('/getVoters', async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json({ voters });
  } catch (error) {
    console.error('Get voters error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all voters (existing route)
router.get('/getVoter', async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json({ voter: voters });
  } catch (error) {
    console.error('Get voters error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get voter by ID
router.get('/getVoterbyID/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ID is valid
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid voter ID' });
    }
    
    const voter = await Voter.findById(id);
    if (!voter) {
      return res.status(404).json({ success: false, message: 'Voter not found' });
    }
    res.json({ voter });
  } catch (error) {
    console.error('Get voter by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update voter
router.patch('/updateVoter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ID is valid
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid voter ID' });
    }
    
    const voter = await Voter.findByIdAndUpdate(id, req.body, { new: true });
    if (!voter) {
      return res.status(404).json({ success: false, message: 'Voter not found' });
    }
    res.json({ success: true, voter });
  } catch (error) {
    console.error('Update voter error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete voter
router.delete('/deleteVoter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ID is valid
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid voter ID' });
    }
    
    const voter = await Voter.findByIdAndDelete(id);
    if (!voter) {
      return res.status(404).json({ success: false, message: 'Voter not found' });
    }
    res.json({ success: true, message: 'Voter deleted successfully' });
  } catch (error) {
    console.error('Delete voter error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Approve voter
router.put('/approveVoter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid voter ID' });
    }
    
    const voter = await Voter.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!voter) {
      return res.status(404).json({ success: false, message: 'Voter not found' });
    }
    res.json({ success: true, voter });
  } catch (error) {
    console.error('Approve voter error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reject voter
router.put('/rejectVoter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid voter ID' });
    }
    
    const voter = await Voter.findByIdAndUpdate(id, { isApproved: false }, { new: true });
    if (!voter) {
      return res.status(404).json({ success: false, message: 'Voter not found' });
    }
    res.json({ success: true, voter });
  } catch (error) {
    console.error('Reject voter error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get dashboard data
router.get('/getDashboardData', async (req, res) => {
  try {
    const voterCount = await Voter.countDocuments();
    const candidateCount = await Candidate.countDocuments();
    const votersVoted = await Voter.countDocuments({ voteStatus: true });

    res.json({
      DashboardData: {
        voterCount,
        candidateCount,
        votersVoted
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;