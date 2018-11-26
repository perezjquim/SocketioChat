const db = require("./database/database");

const everyauth = require('./app/everyauth');
everyauth.prepare(db);

const app = require("./app/app");
app.prepare(everyauth);

const router = require("./app/router");
router.prepare(app,everyauth,db);

const server = require('http').createServer(app);
const PORT = 1234;

const io = require("./app/sockets");
io.prepare(server,db);

server.listen(PORT);
console.log('Server is running');