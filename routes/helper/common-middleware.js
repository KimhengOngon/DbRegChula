const requireLogin = (req, res, next) => {
  if (req.isUnauthenticated()) {
    return res.redirect('/login?err=loginFirst');
  }
  next();
};

const requireAdvisorRole = (req, res, next) => {
  if (req.user.type !== 'A') {
    return next(new Error('Not authorized.'));
  }
  next();
};

const requireManagerRole = (req, res, next) => {
  if (req.user.type !== 'M') {
    return next(new Error('Not authorized.'));
  }
  next();
};

const requireLoginNoWarning = (req, res, next) => {
  if (req.isUnauthenticated()) {
    return res.redirect('/login?err=loginFirst');
  }
  next();
};

const requireLogout = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/logout');
  }
  next();
};

module.exports = {
  requireLogin,
  requireLoginNoWarning,
  requireAdvisorRole,
  requireManagerRole,
  requireLogout
};
