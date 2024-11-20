const fs = require('fs').promises;
const path = require('path');
const pterodactyl = require('./services/pterodactyl');

const DB_PATH = path.join(__dirname, '../data/users.json');
const NOTIFICATIONS_PATH = path.join(__dirname, '../data/notifications.json');
const ANNOUNCEMENTS_PATH = path.join(__dirname, '../data/announcements.json');

async function ensureDbExists() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, '{}');
    }
    try {
      await fs.access(NOTIFICATIONS_PATH);
    } catch {
      await fs.writeFile(NOTIFICATIONS_PATH, '[]');
    }
    try {
      await fs.access(ANNOUNCEMENTS_PATH);
    } catch {
      await fs.writeFile(ANNOUNCEMENTS_PATH, '[]');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function readDb() {
  await ensureDbExists();
  const data = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(data);
}

async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

async function readNotifications() {
  await ensureDbExists();
  const data = await fs.readFile(NOTIFICATIONS_PATH, 'utf8');
  return JSON.parse(data);
}

async function writeNotifications(notifications) {
  await fs.writeFile(NOTIFICATIONS_PATH, JSON.stringify(notifications, null, 2));
}

async function readAnnouncements() {
  await ensureDbExists();
  const data = await fs.readFile(ANNOUNCEMENTS_PATH, 'utf8');
  return JSON.parse(data);
}

async function writeAnnouncements(announcements) {
  await fs.writeFile(ANNOUNCEMENTS_PATH, JSON.stringify(announcements, null, 2));
}

async function getStats() {
  const users = await readDb();
  const notifications = await readNotifications();
  const announcements = await readAnnouncements();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

  return {
    totalUsers: Object.keys(users).length,
    newUsersThisMonth: Object.values(users).filter(user => 
      new Date(user.createdAt) > thirtyDaysAgo
    ).length,
    activeNotifications: notifications.filter(n => !n.read).length,
    totalAnnouncements: announcements.length
  };
}

async function getAllUsers() {
  return await readDb();
}

async function getUser(id) {
  const users = await readDb();
  return users[id];
}

async function saveUser(user) {
  const users = await readDb();
  users[user.id] = user;
  await writeDb(users);
  return user;
}

async function deleteUser(id) {
  const users = await readDb();
  delete users[id];
  await writeDb(users);
}

async function addNotification(userId, message) {
  const notifications = await readNotifications();
  notifications.push({
    id: Date.now().toString(),
    userId,
    message,
    timestamp: new Date().toISOString(),
    read: false
  });
  await writeNotifications(notifications);
}

async function getUserNotifications(userId) {
  const notifications = await readNotifications();
  return notifications.filter(n => n.userId === userId);
}

async function markNotificationAsRead(notificationId) {
  const notifications = await readNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    await writeNotifications(notifications);
  }
}

async function addAnnouncement({ title, message, type }) {
  const announcements = await readAnnouncements();
  const newAnnouncement = {
    id: Date.now().toString(),
    title,
    message,
    type,
    timestamp: new Date().toISOString()
  };
  announcements.push(newAnnouncement);
  await writeAnnouncements(announcements);
  return newAnnouncement;
}

async function getAnnouncements() {
  return await readAnnouncements();
}

async function deleteAnnouncement(id) {
  const announcements = await readAnnouncements();
  const filteredAnnouncements = announcements.filter(a => a.id !== id);
  await writeAnnouncements(filteredAnnouncements);
}

module.exports = {
  getUser,
  saveUser,
  getAllUsers,
  deleteUser,
  addNotification,
  getUserNotifications,
  markNotificationAsRead,
  getStats,
  addAnnouncement,
  getAnnouncements,
  deleteAnnouncement
};