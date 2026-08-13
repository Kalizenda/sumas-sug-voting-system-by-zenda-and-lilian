# Online Voting System - Backend Server

This is the backend server for the Online Voting System, built with Node.js, Express, and MongoDB.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables**
   The `.env` file is already configured with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://chekwubechukwu989_db_user:09074176102Aa@zenda.bli2dpe.mongodb.net/online-voting-system
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   NODE_ENV=development
   ```

3. **Start the Server**
   ```bash
   # For development with auto-reload
   npm run dev

   # For production
   npm start
   ```

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Admin Authentication**: Separate admin login system
- **Voter Management**: CRUD operations for voter accounts
- **Candidate Management**: CRUD operations for candidates with image uploads
- **Voting System**: Real-time vote counting with Socket.io
- **File Uploads**: Support for profile images and candidate symbols
- **Dashboard Statistics**: Real-time statistics for admin dashboard

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/adminlogin` - Admin login  
- `POST /api/createVoter` - User registration

### Voters
- `GET /api/getVoter` - Get all voters
- `GET /api/getVoterbyID/:id` - Get specific voter
- `PATCH /api/updateVoter/:id` - Update voter
- `DELETE /api/deleteVoter/:id` - Delete voter
- `GET /api/getDashboardData` - Get dashboard statistics

### Candidates
- `GET /api/getCandidate` - Get all candidates
- `POST /api/createCandidate` - Create new candidate
- `PATCH /api/getCandidate/:id` - Update candidate votes
- `DELETE /api/deleteCandidate/:id` - Delete candidate

## Database Models

### Voter
- firstName, lastName, age, city, state
- date of birth, voter ID, phone number
- email, password (hashed), profile image
- voteStatus (boolean)

### Candidate
- fullName, age, party, bio
- photo, party symbol
- vote count

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- File uploads restricted to uploads directory
- MongoDB connection with authentication
- CORS enabled for development

## Frontend Integration

The frontend is configured to connect to this backend at:
- Local: `http://localhost:5000`
- The helper.js file in the frontend has been updated to use the local server

## Deployment

For production deployment:
1. Change `NODE_ENV` to `production` in .env
2. Update `JWT_SECRET` to a secure random string
3. Use a production MongoDB instance
4. Configure proper CORS settings
5. Set up proper file storage (e.g., AWS S3)