const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = (passport) => {
  try {
    passport.use(
      new LocalStrategy({ usernameField: 'login' }, async (login, password, done) => {
        const user = await User.findOne({ where: { login: login } });
        if (!user) {
          return done(null, false, { message: 'That login is not registered' });
        }
        const verification = await bcrypt.compare(password, user.password);
        if (verification) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      }));

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      const user = await User.findByPk(id);
      done(null, user);
    });
  } catch(e) {
    console.log(e);
  }
};