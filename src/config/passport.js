const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');
const { getUser } = require('../services/database');
const config = require('./auth');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new DiscordStrategy(
  config.discord,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOrCreate(profile);
      return done(null, user);
    } catch (error) {
      console.error('Authentication Error:', error);
      return done(error, null);
    }
  }
));

module.exports = passport;