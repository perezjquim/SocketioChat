import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const PORT = 1234;
server.listen(PORT);
console.log('Server is running');

const db = require("./database/database");
db.init();

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const users = [];
const connections = [];

io.sockets.on('connection',(socket) => {
   connections.push(socket);
   console.log(' %s sockets is connected', connections.length);

   socket.on('disconnect', () => {
      connections.splice(connections.indexOf(socket), 1);
   });

   socket.on('sending message', (message) => {
      console.log('Message is received :', message);

      io.sockets.emit('new message', {message: message});
   });
});

app.get('/', (req, res) => {
   res.render('home', { user: req.user });
});

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });  