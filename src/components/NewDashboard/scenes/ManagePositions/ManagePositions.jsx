import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, MenuItem } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { BASE_URL } from '../../../../helper';

const sugPositions = [
    "President",
    "Vice President",
    "Secretary General",
    "Assistant Secretary General",
    "Treasurer",
    "Financial Secretary",
    "Director of Socials",
    "Director of Sports",
    "Director of Welfare",
    "Public Relations Officer",
    "Women Affairs Commissioner",
    "Student Senate Representative"
];

const ManagePositions = () => {
  const [positions, setPositions] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    electionId: '',
    voteOrder: 0
  });

  useEffect(() => {
    fetchPositions();
    fetchElections();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/positions`);
      setPositions(response.data.positions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching positions:', error);
      setLoading(false);
    }
  };

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/elections`);
      setElections(response.data.elections || []);
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const handleCreate = () => {
    setSelectedPosition(null);
    setFormData({
      title: '',
      description: '',
      electionId: '',
      voteOrder: 0
    });
    setDialogOpen(true);
  };

  const handleEdit = (position) => {
    setSelectedPosition(position);
    setFormData({
      title: position.title,
      description: position.description,
      electionId: position.electionId?._id || position.electionId,
      voteOrder: position.voteOrder || 0
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedPosition) {
        await axios.put(`${BASE_URL}/position/${selectedPosition._id}`, formData);
      } else {
        await axios.post(`${BASE_URL}/position`, formData);
      }
      setDialogOpen(false);
      fetchPositions();
    } catch (error) {
      console.error('Error saving position:', error);
    }
  };

  const handleDelete = async (positionId) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      try {
        await axios.delete(`${BASE_URL}/position/${positionId}`);
        fetchPositions();
      } catch (error) {
        console.error('Error deleting position:', error);
      }
    }
  };

  const handleQuickAdd = (positionTitle) => {
    const activeElection = elections.find(e => e.status === 'active');
    if (!activeElection) {
      alert('Please create and activate an election first');
      return;
    }
    
    setFormData({
      title: positionTitle,
      description: `Position for ${positionTitle} in the Student Union Government`,
      electionId: activeElection._id,
      voteOrder: sugPositions.indexOf(positionTitle)
    });
    setDialogOpen(true);
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>Loading positions...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Manage Positions</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Create Position
        </Button>
      </Box>

      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Quick Add SUG Positions</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sugPositions.map(position => (
            <Button
              key={position}
              variant="outlined"
              size="small"
              onClick={() => handleQuickAdd(position)}
              disabled={!positions.find(p => p.title === position)}
            >
              {positions.find(p => p.title === position) ? '✓ ' : '+ '}{position}
            </Button>
          ))}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Position Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Election</TableCell>
              <TableCell>Vote Order</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position._id}>
                <TableCell>{position.title}</TableCell>
                <TableCell>{position.description}</TableCell>
                <TableCell>
                  {position.electionId?.title || 'Not assigned'}
                </TableCell>
                <TableCell>{position.voteOrder}</TableCell>
                <TableCell>
                  <Chip 
                    label={position.isActive ? 'Active' : 'Inactive'}
                    color={position.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(position)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(position._id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedPosition ? 'Edit Position' : 'Create New Position'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Position Title"
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            select={!selectedPosition}
          >
            {!selectedPosition && sugPositions.map(pos => (
              <MenuItem key={pos} value={pos}>{pos}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <TextField
            fullWidth
            select
            label="Election"
            margin="normal"
            value={formData.electionId}
            onChange={(e) => setFormData({...formData, electionId: e.target.value})}
          >
            {elections.map(election => (
              <MenuItem key={election._id} value={election._id}>
                {election.title} ({election.status})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Vote Order"
            type="number"
            margin="normal"
            value={formData.voteOrder}
            onChange={(e) => setFormData({...formData, voteOrder: parseInt(e.target.value)})}
            helperText="Lower numbers appear first on the ballot"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedPosition ? 'Update Position' : 'Create Position'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagePositions;