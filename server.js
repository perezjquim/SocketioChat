const db = require("./database/database");

const passport = require('./app/passport');
passport.prepare(db);

const app = require("./app/app");
app.prepare(passport);

const router = require("./app/router");
router.prepare(app, passport);

const server = require('http').createServer(app);
const PORT = 1234;

const io = require("./app/sockets");
io.prepare(server);

server.listen(PORT);
console.log('Server is running');