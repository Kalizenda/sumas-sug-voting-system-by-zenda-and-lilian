import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Chip } from '@mui/material';
import { Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
import { BASE_URL } from '../../../../helper';
import ThemeSwitcher from '../../../ThemeSwitcher/ThemeSwitcher';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({
    action: '',
    status: '',
    limit: 100
  });

  const actions = [
    'login', 'logout', 'vote_cast', 'candidate_registered', 'candidate_approved',
    'candidate_rejected', 'voter_registered', 'voter_approved', 'voter_rejected',
    'election_created', 'election_started', 'election_ended', 'position_created',
    'position_updated', 'position_deleted', 'settings_updated', 'results_published',
    'biometric_verification', 'system_access'
  ];

  useEffect(() => {
    fetchLogs();
    fetchStatistics();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auditLogs`, { params: filters });
      setLogs(response.data.auditLogs || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auditLogs/statistics`);
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,User,Action,Status,Details\n"
      + logs.map(log => 
        `${new Date(log.timestamp).toLocaleString()},${log.userId?.fullName || 'System'},${log.action},${log.status},${JSON.stringify(log.details)}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionColor = (action) => {
    const criticalActions = ['vote_cast', 'election_started', 'election_ended', 'results_published'];
    const warningActions = ['candidate_rejected', 'voter_rejected', 'position_deleted'];
    
    if (criticalActions.includes(action)) return 'error';
    if (warningActions.includes(action)) return 'warning';
    return 'success';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'failure': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>Loading audit logs...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }} className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }} className="fade-in-down">
        <Typography variant="h4">Audit Logs</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ThemeSwitcher position="inline" />
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchLogs}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export Logs
          </Button>
        </Box>
      </Box>

      {statistics && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }} className="fade-in-up stagger-1">
          <Paper sx={{ p: 2, textAlign: 'center' }} className="hover-lift">
            <Typography variant="h6" color="primary">{statistics.totalLogs}</Typography>
            <Typography variant="body2">Total Logs</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }} className="hover-lift">
            <Typography variant="h6" color="success">{statistics.successLogs}</Typography>
            <Typography variant="body2">Successful</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }} className="hover-lift">
            <Typography variant="h6" color="error">{statistics.failureLogs}</Typography>
            <Typography variant="body2">Failed</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }} className="hover-lift">
            <Typography variant="h6" color="primary">{statistics.successRate}%</Typography>
            <Typography variant="body2">Success Rate</Typography>
          </Paper>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }} className="fade-in-up stagger-2">
        <TextField
          select
          label="Filter by Action"
          variant="outlined"
          size="small"
          value={filters.action}
          onChange={(e) => setFilters({...filters, action: e.target.value})}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Actions</MenuItem>
          {actions.map(action => (
            <MenuItem key={action} value={action}>{action.replace(/_/g, ' ').toUpperCase()}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filter by Status"
          variant="outlined"
          size="small"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="success">Success</MenuItem>
          <MenuItem value="failure">Failure</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>
        <TextField
          select
          label="Limit"
          variant="outlined"
          size="small"
          value={filters.limit}
          onChange={(e) => setFilters({...filters, limit: e.target.value})}
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="50">50</MenuItem>
          <MenuItem value="100">100</MenuItem>
          <MenuItem value="500">500</MenuItem>
          <MenuItem value="1000">1000</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} className="fade-in-up stagger-3">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id} className="hover-lift">
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell>{log.userName || log.userId?.fullName || 'System'}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.action.replace(/_/g, ' ').toUpperCase()}
                    color={getActionColor(log.action)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={log.status.toUpperCase()}
                    color={getStatusColor(log.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {typeof log.details === 'object' 
                    ? (log.details?.message || JSON.stringify(log.details).substring(0, 50) + '...')
                    : String(log.details).substring(0, 50)}
                </TableCell>
                <TableCell>{log.ipAddress || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditLogs;