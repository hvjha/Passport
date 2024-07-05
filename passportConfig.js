const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./database');

exports.initializingPassport = (passport) => {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'Incorrect username' });
      if (user.password !== password) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await User.findById(_id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

