const path = require('path');

module.exports = {
  DB_PATH: path.join(__dirname, '../../data/users.json'),
  NOTIFICATIONS_PATH: path.join(__dirname, '../../data/notifications.json'),
  ANNOUNCEMENTS_PATH: path.join(__dirname, '../../data/announcements.json')
};