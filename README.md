# PhoenixHost - Game Server Management Platform

![PhoenixHost](https://camo.githubusercontent.com/f6ecddabe41e811c0992efcfbe5897c5feab845ba6d5b78160ad49d7ce902f28/68747470733a2f2f692e6962622e636f2f314776306862442f62643536356463633061353536616464306230613065643662323664363836652e676966)

A powerful, real-time game server management platform with Discord integration, notifications, and announcements system.

## 🚀 Features

- **Discord Authentication** - Secure login using Discord credentials
- **Real-time Notifications** - Instant updates for users and administrators
- **Announcement System** - Broadcast important messages to all users
- **Admin Dashboard** - Comprehensive admin panel for user management
- **Pterodactyl Integration** - Seamless game server deployment
- **Real-time Statistics** - Live monitoring of platform metrics

## 📋 Prerequisites

- Node.js 16.x or higher
- Discord Application credentials
- Pterodactyl Panel access
- MongoDB (for user data storage)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/phoenixhost.git
cd phoenixhost
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your credentials:
```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
SESSION_SECRET=your_session_secret
PTERODACTYL_API_URL=your_panel_url
PTERODACTYL_API_KEY=your_api_key
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
phoenixhost/
├── src/
│   ├── index.js          # Application entry point
│   ├── database.js       # Database operations
│   ├── middleware/       # Express middlewares
│   ├── routes/          # Route handlers
│   ├── services/        # External service integrations
│   └── views/           # EJS templates
├── data/                # JSON data storage
├── public/             # Static assets
└── package.json
```

## 🔒 Security Features

- Session-based authentication
- Discord OAuth2 integration
- Secure password handling
- Rate limiting
- XSS protection

## 💡 Admin Features

- User Management
  - View all users
  - Delete users
  - Send individual notifications
- Announcement System
  - Create announcements
  - Different announcement types (Info, Warning, Error)
  - Real-time broadcasting
- Statistics Dashboard
  - Total users count
  - New users (30 days)
  - Active notifications
  - Total announcements

## 🎮 User Features

- Discord Login
- Real-time Notifications
- Server Management
- Account Settings
- Announcement Viewing

## 🔄 Real-time Features

- Live notifications
- Instant announcements
- Real-time user updates
- Live statistics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) for Discord integration
- [Socket.IO](https://socket.io/) for real-time features
- [Express](https://expressjs.com/) for the web framework
- [Pterodactyl](https://pterodactyl.io/) for game server management

## 📧 Contact
- Discord: [Join our server](https://discord.gg/kvQabEsMh6)
- Email: notatouchpad@gmail.com

## 🔮 Roadmap

- [ ] Multi-factor authentication
- [ ] Payment integration
- [ ] Server templates
- [ ] API documentation
- [ ] Mobile app
- [ ] Server backups
