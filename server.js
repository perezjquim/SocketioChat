/* MODELS */
const   db = require("./database/database"),
        mUser = require("./app/model/user"),
        mMessage = require("./app/model/message");
mUser.prepare(db);
mMessage.prepare(db);
/* ***** */

/* CONTROLLERS */
const   cAuth = require('./app/controller/auth'),
        app = require("./app/app"),
        cRoute = require("./app/controller/route");
cAuth.prepare(mUser);
app.prepare(cAuth);
cRoute.prepare(app,mUser,mMessage);
/* *********** */

/* SERVER AND COMMUNICATION */
const   server = require('http').createServer(app),
        PORT = 1234,
        cSocket = require("./app/controller/socket");        
cSocket.prepare(app,server,mUser,mMessage);
server.listen(PORT);
console.log('---------- Server is running ----------');
/***************************************/