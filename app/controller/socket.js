module.exports.prepare = function(app, server, mUser, mMessage)
{
        var io = require("socket.io").listen(server);
        io.use(app.sharedsession(app.session,
        {
                autoSave: true
        }));
        io.sockets.on('connection', (socket) =>
        {
                if (isPublic(socket))
                {
                        console.log("@@ public connection @@");
                }
                else
                {
                        console.log("@@ private connection @@");
                        for (var u in app.prConnections)
                        {
                                for (var session in app.prConnections[u])
                                {
                                        if (session == socket.handshake.sessionID)
                                        {
                                                app.prConnections[u][session] = socket.id;
                                        }
                                }
                        }
                }
                socket.on('disconnect', () =>
                {
                        if (isPublic(socket))
                        {
                                console.log("@@ public disconnect @@");
                        }
                        else
                        {
                                console.log("@@ private disconnect @@");
                                // falta eliminar
                        }
                });
                socket.on('sending public message', (text) =>
                {
                        console.log("@@ public message @@");
                        if (isPublic(socket))
                        {
                                var message = mMessage.insertMessage(
                                {
                                        text: text
                                });
                                io.sockets.emit('receiving public message', message);
                        }
                        else
                        {
                                var user_from = undefined;
                                for (var u in app.prConnections)
                                {
                                        for (var session in app.prConnections[u])
                                        {
                                                if (session == socket.handshake.sessionID)
                                                {
                                                        user_from = u;
                                                }
                                        }
                                }
                                if (user_from)
                                {
                                        var message = mMessage.insertMessage(
                                        {
                                                user_from: user_from,
                                                text: text
                                        });
                                        io.sockets.emit('receiving public message', message);
                                }
                                else
                                {
                                        console.log("!! socket desconhecida !!");
                                }
                        }
                });
                socket.on('sending private message', (text, user_to) =>
                {
                        if (!isPublic(socket))
                        {
                                console.log("@@ private message @@");
                                var user_from = undefined;
                                user_to = mUser.findUserByUsername(user_to);
                                for (var u in app.prConnections)
                                {
                                        for (var session in app.prConnections[u])
                                        {
                                                if (session == socket.handshake.sessionID)
                                                {
                                                        user_from = u;
                                                }
                                        }
                                }
                                console.log("from", user_from);
                                console.log("to", user_to);
                                if (user_from && user_to)
                                {
                                        var message = mMessage.insertMessage(
                                        {
                                                user_from: user_from,
                                                user_to: user_to,
                                                text: text
                                        });
                                        for (var session in app.prConnections[user_from])
                                        {
                                                io.to(app.prConnections[user_from][session]).emit('receiving private message', message);
                                        }
                                        for (var session in app.prConnections[user_to])
                                        {
                                                io.to(app.prConnections[user_to][session]).emit('receiving private message', message);
                                        }
                                }
                                else
                                {
                                        console.log("!! socket desconhecida !!");
                                }
                        }
                });
        });
        module.exports = io;
        console.log("_ Socket prepared _");
};

function isPublic(socket)
{
        var cookie = socket.handshake.headers.cookie;
        if (cookie) return cookie.indexOf("connect.sid") === -1;
        else return false;
}

function getCookie(socket)
{
        var cookie = socket.handshake.headers.cookie;
        if (cookie) return cookie.substring(cookie.indexOf("io=") + 3, cookie.indexOf(";"))
        else return -1;
}