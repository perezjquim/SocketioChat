module.exports.prepare = function(app,server,db)
{   
    var io = require("socket.io").listen(server);

    io.sockets.on('connection',(socket) => {
        if(isPublic(socket))
        {
           console.log("@@ public connection @@");
           app.pubConnections.push(socket);
        }
        else
        {
           console.log("@@ private connection @@");
        }

        socket.on('disconnect', () => 
        {
           console.log(socket.id);
            if(isPublic(socket))
            {
               console.log("@@ public disconnect @@");
               app.pubConnections.splice(app.pubConnections.indexOf(socket),1);
            }   
            else
            {
               console.log("@@ private disconnect @@");
               Object.entries(app.prConnections).forEach(([userId, userSockets]) =>
               {
                  console.log("sockets de "+userId);
                  console.log(userSockets);
                  var index = userSockets.indexOf(socket.id);                 
                  if(index != -1) 
                  {
                     app.prConnections[userId].splice(index, 1);
                  }
                  console.log("sockets de "+userId);
                  console.log(app.prConnections[userId]);                  
               });           
            }        
        });
     
        socket.on('sending message', (text) => 
        {
            if(isPublic(socket))
            {
               console.log("@@ public message @@");
               var message = db.insertMessage({ text: text });     
               io.sockets.emit('public message', message);                         
            }   
            else
            {
               console.log("@@ private message @@");
               var user_from = -1;
               Object.entries(app.prConnections).forEach((userId, userSockets) =>
               {
                  var index = userSockets.indexOf(socket);
                  if(index != -1) user_from = userId;
               });
               var message = db.insertMessage({ user_from: user_from, text: text });               
            }
        });
    });  
     
    module.exports = io;
};

function isPublic(socket)
{
   return socket.handshake.headers.cookie.indexOf("connect.sid") === -1;
}