const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');

// Create audit log entry
router.post('/auditLog', async (req, res) => {
  try {
    const { userId, action, details, ipAddress, userAgent, status } = req.body;
    
    const auditLog = new AuditLog({
      userId,
      action,
      details,
      ipAddress,
      userAgent,
      status: status || 'success'
    });
    
    await auditLog.save();
    res.json({ success: true, auditLog });
  } catch (error) {
    console.error('Create audit log error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all audit logs
router.get('/auditLogs', async (req, res) => {
  try {
    const { userId, action, status, startDate, endDate, limit = 100 } = req.query;
    
    const filter = {};
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    const auditLogs = await AuditLog.find(filter)
      .populate('userId', 'fullName email matricNumber')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, auditLogs });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get audit log by ID
router.get('/auditLog/:id', async (req, res) => {
  try {
    const auditLog = await AuditLog.findById(req.params.id)
      .populate('userId', 'fullName email matricNumber');
    
    if (!auditLog) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }
    
    res.json({ success: true, auditLog });
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get audit logs by user
router.get('/auditLogs/user/:userId', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const auditLogs = await AuditLog.find({ userId: req.params.userId })
      .populate('userId', 'fullName email matricNumber')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, auditLogs });
  } catch (error) {
    console.error('Get user audit logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get audit statistics
router.get('/auditLogs/statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    const totalLogs = await AuditLog.countDocuments(filter);
    const successLogs = await AuditLog.countDocuments({ ...filter, status: 'success' });
    const failureLogs = await AuditLog.countDocuments({ ...filter, status: 'failure' });
    
    // Activity by action type
    const actionStats = await AuditLog.aggregate([
      { $match: filter },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent activity
    const recentActivity = await AuditLog.find(filter)
      .populate('userId', 'fullName email')
      .sort({ timestamp: -1 })
      .limit(10);
    
    res.json({
      success: true,
      statistics: {
        totalLogs,
        successLogs,
        failureLogs,
        successRate: totalLogs > 0 ? ((successLogs / totalLogs) * 100).toFixed(2) : 0,
        actionStats,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get audit statistics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete audit log (admin only)
router.delete('/auditLog/:id', async (req, res) => {
  try {
    const auditLog = await AuditLog.findByIdAndDelete(req.params.id);
    
    if (!auditLog) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }
    
    res.json({ success: true, message: 'Audit log deleted successfully' });
  } catch (error) {
    console.error('Delete audit log error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clear old audit logs (admin only)
router.delete('/auditLogs/clear', async (req, res) => {
  try {
    const { days = 90 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    const result = await AuditLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });
    
    res.json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} audit logs older than ${days} days` 
    });
  } catch (error) {
    console.error('Clear audit logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;