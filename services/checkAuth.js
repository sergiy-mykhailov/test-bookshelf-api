
const checkAuth = (passport) => {
  return (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (info) {
        const err = new Error(info.message);
        err.name = info.name;
        err.status = 401;
        return next(err);
      }

      if (!user) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
      }

      req.user = user;
      return next();
    })(req, res, next);
  };
};

module.exports = checkAuth;
