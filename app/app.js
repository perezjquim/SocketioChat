const express = require('express');
const app = express();
const session = require('express-session')(
{
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
});
const sharedsession = require("express-socket.io-session");
const prConnections = {};
const pubConnections = [];
module.exports = app;
module.exports.prepare = function(cAuth)
{
        app.set('views', __dirname + '/view');
        app.set('view engine', 'ejs');
        app.use(require('morgan')('combined'));
        app.use(require('cookie-parser')());
        app.use(require('body-parser').urlencoded(
        {
                extended: true
        }));
        app.use(express.static('public'));
        app.use(session);
        app.use(cAuth.middleware(app));
        app.session = session;
        app.sharedsession = sharedsession;
        app.prConnections = prConnections;
        app.pubConnections = pubConnections;
        console.log("_ App prepared _");
};