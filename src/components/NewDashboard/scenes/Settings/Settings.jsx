import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider, Switch, FormControlLabel, Alert } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import ThemeSwitcher from '../../../ThemeSwitcher/ThemeSwitcher';

const Settings = () => {
  const [settings, setSettings] = useState({
    universityName: 'University of Medical and Applied Sciences, Igbo-Eno',
    universityShort: 'UMAS',
    schoolYear: '2025/2026',
    electionStartDate: '',
    electionEndDate: '',
    biometricThreshold: 0.6,
    sessionTimeout: 30,
    enableBiometricVerification: true,
    requireEmailVerification: false,
    allowVoterRegistration: true,
    allowCandidateRegistration: true,
    adminEmail: 'admin@sumas.edu.ng'
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    // In production, this would save to the backend
    console.log('Saving settings:', settings);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }} className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }} className="fade-in-down">
        <Typography variant="h4">System Settings</Typography>
        <ThemeSwitcher position="inline" />
      </Box>
      
      {saveStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }} className="fade-in-up">
          Settings saved successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }} className="fade-in-up stagger-1 hover-lift">
        <Typography variant="h6" gutterBottom>University Information</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <TextField
          fullWidth
          label="University Name"
          name="universityName"
          value={settings.universityName}
          onChange={handleChange}
          margin="normal"
        />
        
        <TextField
          fullWidth
          label="University Short Name"
          name="universityShort"
          value={settings.universityShort}
          onChange={handleChange}
          margin="normal"
        />
        
        <TextField
          fullWidth
          label="School Year"
          name="schoolYear"
          value={settings.schoolYear}
          onChange={handleChange}
          margin="normal"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }} className="fade-in-up stagger-2 hover-lift">
        <Typography variant="h6" gutterBottom>Election Settings</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <TextField
          fullWidth
          label="Election Start Date"
          type="datetime-local"
          name="electionStartDate"
          value={settings.electionStartDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        
        <TextField
          fullWidth
          label="Election End Date"
          type="datetime-local"
          name="electionEndDate"
          value={settings.electionEndDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }} className="fade-in-up stagger-3 hover-lift">
        <Typography variant="h6" gutterBottom>Biometric Settings</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableBiometricVerification}
              onChange={handleChange}
              name="enableBiometricVerification"
            />
          }
          label="Enable Biometric Verification"
        />
        
        <TextField
          fullWidth
          label="Biometric Threshold (0.0 - 1.0)"
          type="number"
          name="biometricThreshold"
          value={settings.biometricThreshold}
          onChange={handleChange}
          margin="normal"
          inputProps={{ min: 0, max: 1, step: 0.1 }}
          helperText="Higher values = stricter matching (recommended: 0.6)"
          disabled={!settings.enableBiometricVerification}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }} className="fade-in-up stagger-4 hover-lift">
        <Typography variant="h6" gutterBottom>Security Settings</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <TextField
          fullWidth
          label="Session Timeout (minutes)"
          type="number"
          name="sessionTimeout"
          value={settings.sessionTimeout}
          onChange={handleChange}
          margin="normal"
          inputProps={{ min: 5, max: 120 }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.requireEmailVerification}
              onChange={handleChange}
              name="requireEmailVerification"
            />
          }
          label="Require Email Verification for Registration"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }} className="fade-in-up stagger-5 hover-lift">
        <Typography variant="h6" gutterBottom>Registration Settings</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.allowVoterRegistration}
              onChange={handleChange}
              name="allowVoterRegistration"
            />
          }
          label="Allow Voter Registration"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.allowCandidateRegistration}
              onChange={handleChange}
              name="allowCandidateRegistration"
            />
          }
          label="Allow Candidate Registration"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }} className="fade-in-up stagger-6 hover-lift">
        <Typography variant="h6" gutterBottom>Admin Settings</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <TextField
          fullWidth
          label="Admin Email"
          type="email"
          name="adminEmail"
          value={settings.adminEmail}
          onChange={handleChange}
          margin="normal"
        />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} className="fade-in-up">
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          size="large"
          className="hover-scale"
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;