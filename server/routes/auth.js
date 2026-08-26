const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find voter by email
    const voter = await Voter.findOne({ email: username });
    if (!voter) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, voter.pass);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    // Create token
    const token = jwt.sign({ id: voter._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      success: true, 
      token, 
      voterObject: voter 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin Login
router.post('/adminlogin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Use environment variables for admin credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';
    
    if (username === adminEmail && password === adminPassword) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ success: true, token });
    }
    
    res.json({ success: false, message: 'Invalid admin credentials' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create Voter (Registration)
router.post('/createVoter', upload.single('image'), async (req, res) => {
  try {
    const voterData = req.body;
    
    // Handle file upload
    if (req.file) {
      voterData.image = `/uploads/${req.file.filename}`;
    }
    
    // Parse facial data if present
    if (voterData.facialData) {
      try {
        voterData.facialData = JSON.parse(voterData.facialData);
        console.log('Parsed facial data:', voterData.facialData.length, 'encodings');
      } catch (e) {
        console.error('Error parsing facial data:', e);
      }
    }
    
    // Parse facial images if present
    if (voterData.facialImages) {
      try {
        voterData.facialImages = JSON.parse(voterData.facialImages);
        console.log('Parsed facial images:', voterData.facialImages.length, 'images');
      } catch (e) {
        console.error('Error parsing facial images:', e);
      }
    }
    
    // Handle both old and new field names for backward compatibility
    const cleanVoterData = {};
    for (const key in voterData) {
      if (voterData[key] !== '' && voterData[key] !== undefined) {
        // Map new field names to old field names for backward compatibility
        if (key === 'password') {
          cleanVoterData.pass = voterData[key];
        } else if (key === 'confirmPassword') {
          // Skip confirm password
          continue;
        } else if (key === 'matricNumber') {
          cleanVoterData.matricNumber = voterData[key].toUpperCase();
        } else if (key === 'fullName') {
          // Split full name into first and last name for compatibility
          const nameParts = voterData[key].split(' ');
          cleanVoterData.firstName = nameParts[0] || '';
          cleanVoterData.lastName = nameParts.slice(1).join(' ') || '';
          cleanVoterData.fullName = voterData[key];
        } else if (key === 'phoneNumber') {
          const phoneNum = Number(voterData[key]);
          // Only set phone if it's a valid number
          if (!isNaN(phoneNum) && voterData[key] !== '') {
            cleanVoterData.phone = phoneNum;
            cleanVoterData.phoneNumber = voterData[key];
          }
        } else {
          cleanVoterData[key] = voterData[key];
        }
      }
    }
    
    // Hash password (handle both 'pass' and 'password' fields)
    const passwordToHash = cleanVoterData.pass || voterData.password;
    if (!passwordToHash) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }
    
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);
    cleanVoterData.pass = hashedPassword;
    
    // Set default values for new fields
    cleanVoterData.role = cleanVoterData.role || 'voter';
    cleanVoterData.isApproved = cleanVoterData.isApproved || false;
    cleanVoterData.hasVoted = cleanVoterData.hasVoted || false;
    cleanVoterData.voteStatus = cleanVoterData.voteStatus || false;
    
    // Generate userId if not provided
    if (!cleanVoterData.userId) {
      cleanVoterData.userId = new mongoose.Types.ObjectId();
    }

    console.log('Attempting to create voter with data:', JSON.stringify(cleanVoterData, null, 2));
    
    const newVoter = new Voter(cleanVoterData);
    console.log('Saving voter with data:', {
      email: cleanVoterData.email,
      matricNumber: cleanVoterData.matricNumber,
      hasFacialData: !!cleanVoterData.facialData,
      facialDataLength: cleanVoterData.facialData?.length,
      facialImagesLength: cleanVoterData.facialImages?.length
    });
    
    await newVoter.save();
    console.log('Voter saved successfully with ID:', newVoter._id);

    res.json({ success: true, voter: newVoter });
  } catch (error) {
    console.error('Create voter error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', JSON.stringify(error.errors, null, 2));
    
    if (error.code === 11000) {
      res.json({ success: false, message: 'Email or Matric Number already exists' });
    } else if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      res.json({ success: false, message: 'Validation error: ' + errorMessages.join(', ') });
    } else {
      res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
  }
});

module.exports = router;