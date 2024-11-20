const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/admin');
const { getAllUsers, deleteUser, addNotification, getUser, getStats, addAnnouncement, getAnnouncements, deleteAnnouncement } = require('../database');
const pterodactyl = require('../services/pterodactyl');

router.get('/login', (req, res) => {
  res.render('admin/login', { error: req.flash('error') });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect('/admin/dashboard');
  } else {
    req.flash('error', 'Invalid credentials');
    res.redirect('/admin/login');
  }
});

router.get('/dashboard', isAdmin, async (req, res) => {
  const users = await getAllUsers();
  const stats = await getStats();
  const announcements = await getAnnouncements();
  res.render('admin/dashboard', { 
    users: Object.values(users),
    stats,
    announcements
  });
});

router.post('/users/:id/delete', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUser(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      await pterodactyl.deleteUser(user.pterodactylId);
    } catch (pterodactylError) {
      console.error('Pterodactyl deletion error:', pterodactylError);
      return res.status(500).json({ error: 'Failed to delete Pterodactyl account' });
    }
    
    await deleteUser(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.post('/notifications/send', isAdmin, async (req, res) => {
  try {
    const { userId, message } = req.body;
    await addNotification(userId, message);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

router.post('/announcements', isAdmin, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const announcement = await addAnnouncement({ title, message, type });
    res.json({ success: true, announcement });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

router.delete('/announcements/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteAnnouncement(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

router.get('/logout', (req, res) => {
  req.session.isAdmin = false;
  res.redirect('/admin/login');
});

module.exports = router;