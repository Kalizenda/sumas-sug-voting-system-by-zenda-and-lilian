require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Import routes
const voterRoutes = require('./routes/voter');
const candidateRoutes = require('./routes/candidate');
const authRoutes = require('./routes/auth');
const electionRoutes = require('./routes/election');
const positionRoutes = require('./routes/position');
const voteRoutes = require('./routes/vote');
const auditLogRoutes = require('./routes/auditLog');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection with proper options
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biometric_evoting';

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current data when client connects
  socket.emit('connected', { message: 'Connected to voting system' });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Listen for vote updates and broadcast to all clients
  socket.on('voteUpdate', (data) => {
    io.emit('voteUpdate', data);
  });

  // Request for current vote results
  socket.on('requestResults', async () => {
    try {
      const Candidate = require('./models/Candidate');
      const candidates = await Candidate.find();
      socket.emit('currentResults', { candidates });
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api', authRoutes);
app.use('/api', voterRoutes);
app.use('/api', candidateRoutes);
app.use('/api', electionRoutes);
app.use('/api', positionRoutes);
app.use('/api', voteRoutes);
app.use('/api', auditLogRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Online Voting System API Server' });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});