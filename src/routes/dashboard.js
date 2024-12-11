const express = require('express');
const router = express.Router();
const { getUserNotifications, markNotificationAsRead, getAnnouncements } = require('../services/database');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, async (req, res) => {
  const notifications = await getUserNotifications(req.user.id);
  const announcements = await getAnnouncements();
  res.render('dashboard', { 
    user: req.user,
    notifications,
    announcements,
    panelUrl: process.env.PTERODACTYL_API_URL.replace('/api', '')
  });
});

router.post('/notifications/:id/read', isAuthenticated, async (req, res) => {
  try {
    await markNotificationAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

module.exports = router;