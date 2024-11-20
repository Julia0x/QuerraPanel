require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const flash = require('connect-flash');
const path = require('path');
const { saveUser, getUser, createPterodactylUser, getUserNotifications, markNotificationAsRead, getAnnouncements } = require('./database');
const { generatePassword } = require('./utils');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await getUser(profile.id);
    const isFirstLogin = !user;

    if (isFirstLogin) {
      const pterodactylPassword = generatePassword();
      
      const pterodactylUser = await createPterodactylUser({
        email: profile.email,
        username: profile.username,
        password: pterodactylPassword
      });

      user = {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        avatar: profile.avatar,
        pterodactylId: pterodactylUser.id,
        pterodactylUuid: pterodactylUser.uuid,
        pterodactylUsername: pterodactylUser.username,
        pterodactylPassword: pterodactylPassword,
        createdAt: new Date().toISOString()
      };

      await saveUser(user);
    } else {
      user.avatar = profile.avatar;
      await saveUser(user);
    }

    return done(null, user);
  } catch (error) {
    console.error('Authentication Error:', error);
    return done(error, null);
  }
}));

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
};

app.use('/admin', adminRoutes);

app.get('/', async (req, res) => {
  const announcements = await getAnnouncements();
  res.render('home', { 
    user: req.user,
    error: req.flash('error'),
    announcements
  });
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', 
  passport.authenticate('discord', {
    failureRedirect: '/',
    failureFlash: true,
    successRedirect: '/dashboard'
  })
);

app.get('/dashboard', isAuthenticated, async (req, res) => {
  const notifications = await getUserNotifications(req.user.id);
  const announcements = await getAnnouncements();
  res.render('dashboard', { 
    user: req.user,
    notifications,
    announcements,
    panelUrl: process.env.PTERODACTYL_API_URL.replace('/api', '')
  });
});

app.post('/notifications/:id/read', isAuthenticated, async (req, res) => {
  try {
    await markNotificationAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});