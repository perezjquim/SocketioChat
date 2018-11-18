const passport = require('passport');
const Strategy = require('passport-local').Strategy;

module.exports = passport;
module.exports.prepare = function(db)
{
    passport.use(new Strategy(
        function(username, password, cb) {
           db.findUser(username, password, function(err, user) {
              if (err) { return cb(err); }
              if (!user) { return cb(null, false); }
              return cb(null, user);
           });
        }));
    passport.serializeUser(function(user, cb) {
            cb(null, user.id);
        });
    passport.deserializeUser(function(id, cb) {
        db.findUserById(id, function (err, user) {
            if (err) { return cb(err); }
            cb(null, user);
        });
    });
};