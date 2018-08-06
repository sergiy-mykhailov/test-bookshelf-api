
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./../models/user');
const config = require('../config/jwt');

const jwtStrategy = (passport) => {
  const options = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromHeader(),
    ignoreExpiration: false,
  };

  passport.use(new JWTStrategy(options, (JWTPayload, done) => {
    console.log('jwtStrategy', JWTPayload);
    User.findOne({ where: { id: JWTPayload.id } }).then(
      (user) => {
        console.log('findOne', user);
        if(!user) {
          return done(null, false);
        }

        return done(null, user);
      },
      (err) => (done(err, false)));
  }));
};

module.exports = jwtStrategy;
