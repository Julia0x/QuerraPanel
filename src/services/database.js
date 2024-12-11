const fs = require('fs').promises;
const path = require('path');
const { DB_PATH, NOTIFICATIONS_PATH, ANNOUNCEMENTS_PATH } = require('../config/database');

async function ensureDbExists() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    for (const dbPath of [DB_PATH, NOTIFICATIONS_PATH, ANNOUNCEMENTS_PATH]) {
      try {
        await fs.access(dbPath);
      } catch {
        await fs.writeFile(dbPath, dbPath === DB_PATH ? '{}' : '[]');
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Database operations for users
const userOperations = {
  async getUser(id) {
    const users = await readDb();
    return users[id];
  },

  async saveUser(user) {
    const users = await readDb();
    users[user.id] = user;
    await writeDb(users);
    return user;
  },

  async getAllUsers() {
    return await readDb();
  },

  async deleteUser(id) {
    const users = await readDb();
    delete users[id];
    await writeDb(users);
  }
};

// Database operations for notifications
const notificationOperations = {
  async addNotification(userId, message) {
    const notifications = await readNotifications();
    notifications.push({
      id: Date.now().toString(),
      userId,
      message,
      timestamp: new Date().toISOString(),
      read: false
    });
    await writeNotifications(notifications);
  },

  async getUserNotifications(userId) {
    const notifications = await readNotifications();
    return notifications.filter(n => n.userId === userId);
  },

  async markNotificationAsRead(notificationId) {
    const notifications = await readNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      await writeNotifications(notifications);
    }
  }
};

// Database operations for announcements
const announcementOperations = {
  async addAnnouncement({ title, message, type }) {
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
  },

  async getAnnouncements() {
    return await readAnnouncements();
  },

  async deleteAnnouncement(id) {
    const announcements = await readAnnouncements();
    const filteredAnnouncements = announcements.filter(a => a.id !== id);
    await writeAnnouncements(filteredAnnouncements);
  }
};

// Stats operations
const statsOperations = {
  async getStats() {
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
};

// Helper functions
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

module.exports = {
  ...userOperations,
  ...notificationOperations,
  ...announcementOperations,
  ...statsOperations
};