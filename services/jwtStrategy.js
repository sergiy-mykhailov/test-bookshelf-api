
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const models = require('./../models');
const config = require('../config/jwt');

const jwtStrategy = (passport) => {
  const options = {
    secretOrKey: config.secret,
    // jwtFromRequest: ExtractJwt.fromHeader(headers.req.authorization.key.toLowerCase()),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  passport.use(new JWTStrategy(options, function (jwtPayload, done) {
    models.User.findOne({ where: { id: jwtPayload.sub } }).then(
      (user) => {

        if(!user) {
          return done(null, false);
        }

        return done(null, user.get());
      },
      (err) => (done(err, false)));
  }));
};

module.exports = jwtStrategy;
