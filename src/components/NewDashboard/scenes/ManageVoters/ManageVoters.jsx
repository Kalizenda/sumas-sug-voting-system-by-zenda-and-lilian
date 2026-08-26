import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, MenuItem } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Check as CheckIcon, Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import { BASE_URL } from '../../../../helper';
import ThemeSwitcher from '../../../ThemeSwitcher/ThemeSwitcher';

const ManageVoters = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const departments = [
    'Department of Computer Science',
    'Department of Information Technology',
    'Department of Medical Sciences',
    'Department of Applied Sciences',
    'Department of Mathematics and Statistics',
    'Department of Biological Sciences',
    'Department of Physical Sciences'
  ];

  const levels = ['100', '200', '300', '400', '500'];

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getVoter`);
      console.log('Voters response:', response.data);
      setVoters(response.data.voter || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching voters:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (voterId) => {
    try {
      await axios.put(`${BASE_URL}/approveVoter/${voterId}`);
      fetchVoters();
    } catch (error) {
      console.error('Error approving voter:', error);
    }
  };

  const handleReject = async (voterId) => {
    try {
      await axios.put(`${BASE_URL}/rejectVoter/${voterId}`);
      fetchVoters();
    } catch (error) {
      console.error('Error rejecting voter:', error);
    }
  };

  const handleDelete = async (voterId) => {
    if (window.confirm('Are you sure you want to delete this voter?')) {
      try {
        await axios.delete(`${BASE_URL}/deleteVoter/${voterId}`);
        fetchVoters();
      } catch (error) {
        console.error('Error deleting voter:', error);
      }
    }
  };

  const handleEdit = (voter) => {
    setSelectedVoter(voter);
    setDialogOpen(true);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Full Name,Email,Matric Number,Department,Level,Status\n"
      + voters.map(v => `${v.fullName},${v.email},${v.matricNumber},${v.department},${v.level},${v.isApproved ? 'Approved' : 'Pending'}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "voters_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVoters = voters.filter(voter => {
    const matchesSearch = voter.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voter.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voter.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'approved' && voter.isApproved) ||
                         (filterStatus === 'pending' && !voter.isApproved);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>Loading voters...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }} className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }} className="fade-in-down">
        <Typography variant="h4">Manage Voters</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ThemeSwitcher position="inline" />
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export Voters
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }} className="fade-in-up stagger-1">
        <TextField
          label="Search voters..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          select
          label="Filter by Status"
          variant="outlined"
          size="small"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} className="fade-in-up stagger-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Matric Number</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVoters.map((voter) => (
              <TableRow key={voter._id} className="hover-lift">
                <TableCell>{voter.fullName}</TableCell>
                <TableCell>{voter.email}</TableCell>
                <TableCell>{voter.matricNumber}</TableCell>
                <TableCell>{voter.department}</TableCell>
                <TableCell>{voter.level}</TableCell>
                <TableCell>
                  <Chip 
                    label={voter.isApproved ? 'Approved' : 'Pending'}
                    color={voter.isApproved ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(voter)} size="small">
                    <EditIcon />
                  </IconButton>
                  {!voter.isApproved && (
                    <>
                      <IconButton onClick={() => handleApprove(voter._id)} size="small" color="success">
                        <CheckIcon />
                      </IconButton>
                      <IconButton onClick={() => handleReject(voter._id)} size="small" color="error">
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
                  <IconButton onClick={() => handleDelete(voter._id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Voter</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            defaultValue={selectedVoter?.fullName}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            defaultValue={selectedVoter?.email}
          />
          <TextField
            fullWidth
            label="Matric Number"
            margin="normal"
            defaultValue={selectedVoter?.matricNumber}
          />
          <TextField
            fullWidth
            select
            label="Department"
            margin="normal"
            defaultValue={selectedVoter?.department}
          >
            {departments.map(dept => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Level"
            margin="normal"
            defaultValue={selectedVoter?.level}
          >
            {levels.map(level => (
              <MenuItem key={level} value={level}>{level} Level</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageVoters;