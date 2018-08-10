
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const models = require('./../models');
const config = require('../config/jwt');
const headers = require('../config/headers');

// TODO: refactor to Bearer JWT

const jwtStrategy = (passport) => {
  const options = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromHeader(headers.req.authorization.key.toLowerCase()),
  };

  passport.use(new JWTStrategy(options, function (jwtPayload, done) {
    console.log('new JWTStrategy', jwtPayload);

    models.User.findOne({ where: { id: jwtPayload.sub } }).then(
      (user) => {

        if(!user) {
          return done(null, false);
        }

        return done(null, user.get());
      },
      (err) => {
        console.log('jwtStrategy - err', err);
        return (done(err, false));
      });
  }));
};

module.exports = jwtStrategy;
