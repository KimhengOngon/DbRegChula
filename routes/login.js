const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('login', {
    isInvalidUsernamePassword: req.query.err === 'invalidUser',
    isTakenFromOtherPage: req.query.err === 'loginFirst'
  });
});

router.post('/', function(req, res, next) {
  passport.authenticate('local-login', function(err, user) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login?err=invalidUser'); }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/user', function(req, res) {
  if (req.isAuthenticated())
    res.send(req.user);
  else
    res.redirect('/login')
});

module.exports = router;
