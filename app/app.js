import express from 'express';

const app = express();

module.exports = app;
module.exports.prepare = function(everyauth)
{
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.use(require('morgan')('combined'));
    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({ extended: true }));
    app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
    app.use(everyauth.middleware(app));
};