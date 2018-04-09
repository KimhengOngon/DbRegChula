const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../db');

exports.configPassport = function () {
  passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
      let sql = 'SELECT * FROM user where id="' + username + '"';
      var inserts;
      db.query(sql, inserts,
        (err, rows) => {
          if (err)
            return done(err);
          if (!rows.length) {
            return done(null, false);
          }

          if (!(rows[0].password == password))
            return done(null, false); // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          return done(null, rows[0]);
        }
      );
    }
  ))

  passport.serializeUser(function (user, done) {
    console.log('serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function (username, done) {
    let sql = 'SELECT * FROM user where id="' + username + '"';
    var inserts
    db.query(sql, inserts,
      (err, rows) => {
        done(err, rows[0]);
      }
    );
  });
}
