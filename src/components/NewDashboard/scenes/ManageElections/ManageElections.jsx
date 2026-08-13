import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Switch } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, PlayArrow as PlayIcon, Stop as StopIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { BASE_URL } from '../../../../helper';

const ManageElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/elections`);
      setElections(response.data.elections || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching elections:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedElection(null);
    setFormData({
      title: 'Nigerian Student Union Government Elections 2026',
      description: 'Student Union Government Elections for Nigerian Universities - 2026/2027 Academic Session',
      startDate: '',
      endDate: ''
    });
    setDialogOpen(true);
  };

  const handleEdit = (election) => {
    setSelectedElection(election);
    setFormData({
      title: election.title,
      description: election.description,
      startDate: election.startDate ? new Date(election.startDate).toISOString().slice(0, 16) : '',
      endDate: election.endDate ? new Date(election.endDate).toISOString().slice(0, 16) : ''
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedElection) {
        await axios.put(`${BASE_URL}/election/${selectedElection._id}`, formData);
      } else {
        await axios.post(`${BASE_URL}/election`, formData);
      }
      setDialogOpen(false);
      fetchElections();
    } catch (error) {
      console.error('Error saving election:', error);
    }
  };

  const handleActivate = async (electionId) => {
    try {
      await axios.put(`${BASE_URL}/election/${electionId}/activate`);
      fetchElections();
    } catch (error) {
      console.error('Error activating election:', error);
    }
  };

  const handleEnd = async (electionId) => {
    if (window.confirm('Are you sure you want to end this election?')) {
      try {
        await axios.put(`${BASE_URL}/election/${electionId}/end`);
        fetchElections();
      } catch (error) {
        console.error('Error ending election:', error);
      }
    }
  };

  const handleDelete = async (electionId) => {
    if (window.confirm('Are you sure you want to delete this election? This will also delete all related data.')) {
      try {
        await axios.delete(`${BASE_URL}/election/${electionId}`);
        fetchElections();
      } catch (error) {
        console.error('Error deleting election:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'ended': return 'error';
      default: return 'warning';
    }
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>Loading elections...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Manage Elections</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Create Election
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {elections.map((election) => (
              <TableRow key={election._id}>
                <TableCell>{election.title}</TableCell>
                <TableCell>{election.description}</TableCell>
                <TableCell>
                  {election.startDate ? new Date(election.startDate).toLocaleString() : 'Not set'}
                </TableCell>
                <TableCell>
                  {election.endDate ? new Date(election.endDate).toLocaleString() : 'Not set'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={election.status.toUpperCase()}
                    color={getStatusColor(election.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(election)} size="small">
                    <EditIcon />
                  </IconButton>
                  {election.status === 'draft' && (
                    <IconButton onClick={() => handleActivate(election._id)} size="small" color="success">
                      <PlayIcon />
                    </IconButton>
                  )}
                  {election.status === 'active' && (
                    <IconButton onClick={() => handleEnd(election._id)} size="small" color="error">
                      <StopIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(election._id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedElection ? 'Edit Election' : 'Create New Election'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Election Title"
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
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
            label="Start Date"
            type="datetime-local"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
          />
          <TextField
            fullWidth
            label="End Date"
            type="datetime-local"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedElection ? 'Update Election' : 'Create Election'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageElections;