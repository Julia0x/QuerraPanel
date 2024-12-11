require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const config = require('./config/auth');
const passport = require('./config/passport');

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', async (req, res) => {
  const announcements = await require('./services/database').getAnnouncements();
  res.render('home', { 
    user: req.user,
    error: req.flash('error'),
    announcements
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});