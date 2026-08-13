const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const Candidate = require('../models/Candidate');

// Create new position
router.post('/position', async (req, res) => {
  try {
    const { title, description, electionId, voteOrder } = req.body;
    
    const position = new Position({
      title,
      description,
      electionId,
      voteOrder: voteOrder || 0
    });
    
    await position.save();
    res.json({ success: true, position });
  } catch (error) {
    console.error('Create position error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all positions
router.get('/positions', async (req, res) => {
  try {
    const { electionId } = req.query;
    const filter = electionId ? { electionId } : {};
    
    const positions = await Position.find(filter)
      .populate('candidates')
      .populate('electionId', 'title')
      .sort({ voteOrder: 1, title: 1 });
    
    res.json({ success: true, positions });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get position by ID
router.get('/position/:id', async (req, res) => {
  try {
    const position = await Position.findById(req.params.id)
      .populate('candidates')
      .populate('electionId', 'title');
    
    if (!position) {
      return res.status(404).json({ success: false, message: 'Position not found' });
    }
    
    res.json({ success: true, position });
  } catch (error) {
    console.error('Get position error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update position
router.put('/position/:id', async (req, res) => {
  try {
    const { title, description, voteOrder, isActive } = req.body;
    
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { title, description, voteOrder, isActive },
      { new: true }
    );
    
    if (!position) {
      return res.status(404).json({ success: false, message: 'Position not found' });
    }
    
    res.json({ success: true, position });
  } catch (error) {
    console.error('Update position error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete position
router.delete('/position/:id', async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    
    if (!position) {
      return res.status(404).json({ success: false, message: 'Position not found' });
    }
    
    res.json({ success: true, message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Delete position error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add candidate to position
router.put('/position/:id/candidate/:candidateId', async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { candidates: req.params.candidateId } },
      { new: true }
    );
    
    if (!position) {
      return res.status(404).json({ success: false, message: 'Position not found' });
    }
    
    res.json({ success: true, position });
  } catch (error) {
    console.error('Add candidate to position error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove candidate from position
router.delete('/position/:id/candidate/:candidateId', async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { $pull: { candidates: req.params.candidateId } },
      { new: true }
    );
    
    if (!position) {
      return res.status(404).json({ success: false, message: 'Position not found' });
    }
    
    res.json({ success: true, position });
  } catch (error) {
    console.error('Remove candidate from position error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;