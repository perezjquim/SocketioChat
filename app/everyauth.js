const everyauth = require('everyauth');

module.exports = everyauth;
module.exports.prepare = function(db)
{
    everyauth.everymodule.findUserById(function(userId, callback)
    {
        process.nextTick(function()
        {
            db.findUserById(userId, "", function (err, user) {
                if (!err) return callback(null,user);
                else return callback(null,null);
            });
            
        });
    });
    everyauth.facebook
        .appId('260979154590417')
        .appSecret('a22426ef9885a904b2f25c793af823fd')
        .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {

            var promise = this.Promise();
            db.findUserById(fbUserMetadata.id, "fb", function(err, user) {
                if (err) return promise.fulfill([err]);

                if(user) {

                    // user found, life is good
                    promise.fulfill(user);

                } else {

                    db.insertUser("fb",{ username: fbUserMetadata.id, name: fbUserMetadata.name });

                }


            });

            return promise;
        })
        .redirectPath('/');    

    everyauth
        .password
          .loginWith('login')
          .getLoginPath('/login')
          .postLoginPath('/login')
          .loginView('login.ejs')
          .loginLocals( function (req, res, done) {
            setTimeout( function () {
              done(null, {
                title: 'Async login'
              });
            }, 200);
          })
          .authenticate( function (login, password) {
            var errors = [];
            if (!login) errors.push('Missing login');
            if (!password) errors.push('Missing password');
            if (errors.length) return errors;
            var user = db.findUser(login,password);
            if (!user) return ['Login failed'];
            if (user.password !== password) return ['Login failed'];
            return user;
          })
      
          .getRegisterPath('/register')
          .postRegisterPath('/register')
          .registerView('register.ejs')
          .registerLocals( function (req, res, done) {
            setTimeout( function () {
              done(null, {
                title: 'Async Register'
              });
            }, 200);
          })
          .validateRegistration( function (newUserAttrs, errors) {
            if (db.findUser(newUserAttrs.login,newUserAttrs.password)) errors.push('Login already taken');
            return errors;
          })
          .registerUser( function (newUserAttrs) {
            return db.insertUser("", { username: newUserAttrs.login, password: newUserAttrs.password });
          })      
          .loginSuccessRedirect('/')
          .registerSuccessRedirect('/');        
        
};