const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get all candidates
router.get('/getCandidate', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json({ candidate: candidates });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get election results
router.get('/getResults', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votes: -1 });
    const results = candidates.map(candidate => ({
      name: candidate.fullName,
      position: candidate.position,
      votes: candidate.votes,
      party: candidate.party || 'Independent'
    }));
    
    // Group by position
    const resultsByPosition = {};
    results.forEach(result => {
      if (!resultsByPosition[result.position]) {
        resultsByPosition[result.position] = [];
      }
      resultsByPosition[result.position].push(result);
    });
    
    res.json({ 
      success: true, 
      results: resultsByPosition,
      totalVotes: candidates.reduce((sum, c) => sum + c.votes, 0)
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create candidate
router.post('/createCandidate', upload.single('photo'), async (req, res) => {
  try {
    const candidateData = req.body;
    
    // Handle file upload
    if (req.file) {
      candidateData.photo = `/uploads/${req.file.filename}`;
    }

    console.log('Creating candidate with data:', {
      fullName: candidateData.fullName,
      matricNumber: candidateData.matricNumber,
      position: candidateData.position,
      hasPhoto: !!candidateData.photo
    });

    // Handle both old and new field names for backward compatibility
    const cleanCandidateData = {};
    for (const key in candidateData) {
      if (candidateData[key] !== '' && candidateData[key] !== undefined) {
        // Map new field names
        if (key === 'matricNumber') {
          cleanCandidateData.matricNumber = candidateData[key].toUpperCase();
        } else if (key === 'position') {
          cleanCandidateData.position = candidateData[key];
        } else if (key === 'manifesto') {
          cleanCandidateData.manifesto = candidateData[key];
        } else if (key === 'campaignSlogan') {
          cleanCandidateData.campaignSlogan = candidateData[key];
        } else {
          cleanCandidateData[key] = candidateData[key];
        }
      }
    }
    
    // Set default values for new fields
    cleanCandidateData.votes = cleanCandidateData.votes || 0;
    cleanCandidateData.isApproved = cleanCandidateData.isApproved || false;
    
    // Generate candidateId if not provided
    if (!cleanCandidateData.candidateId) {
      cleanCandidateData.candidateId = 'CAND-' + Date.now().toString();
    }

    const newCandidate = new Candidate(cleanCandidateData);
    await newCandidate.save();
    console.log('Candidate saved successfully with ID:', newCandidate._id);

    res.json({ success: true, candidate: newCandidate });
  } catch (error) {
    console.error('Create candidate error:', error);
    if (error.code === 11000) {
      res.json({ success: false, message: 'Candidate with this matric number already exists' });
    } else if (error.name === 'ValidationError') {
      res.json({ success: false, message: 'Validation error: ' + error.message });
    } else {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});

// Update candidate votes
router.patch('/getCandidate/:id', async (req, res) => {
  try {
    const io = req.app.get('io');
    const { voterId, position } = req.body;
    
    console.log('Vote attempt:', { candidateId: req.params.id, voterId, position });
    
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id, 
      { $inc: { votes: 1 } },
      { new: true }
    );
    
    if (!candidate) {
      console.error('Candidate not found:', req.params.id);
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    console.log('Candidate found and votes updated:', candidate.fullName, candidate.votes);

    // Update voter if voterId is provided
    if (voterId) {
      const Voter = require('../models/Voter');
      console.log('Updating voter:', voterId);
      
      const updatedVoter = await Voter.findByIdAndUpdate(
        voterId,
        { 
          voteStatus: true,
          hasVoted: true,
          $addToSet: { votedPositions: position || candidate.position }
        },
        { new: true }
      );
      
      if (!updatedVoter) {
        console.error('Voter not found:', voterId);
      } else {
        console.log('Voter updated successfully');
      }
    }

    // Emit real-time update to all connected clients
    io.emit('voteUpdate', { 
      candidateId: candidate._id, 
      votes: candidate.votes,
      candidateName: candidate.fullName,
      position: candidate.position,
      party: candidate.party
    });

    // Also broadcast current results
    const allCandidates = await Candidate.find();
    io.emit('currentResults', { candidates: allCandidates });

    console.log('Vote successful');
    res.json({ success: true, candidate, votes: candidate.votes });
  } catch (error) {
    console.error('Update candidate votes error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Delete candidate
router.delete('/deleteCandidate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ID is valid
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid candidate ID' });
    }
    
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;