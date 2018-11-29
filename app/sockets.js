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
                  var index = userSockets.indexOf(getCookie(socket));                 
                  if(index != -1) 
                  {
                     app.prConnections[userId].splice(index, 1);
                  }            
               });           
            }        
        });
     
        socket.on('sending public message', (text) => 
        {
            if(isPublic(socket))
            {
               console.log("@@ public message @@");
               var message = db.insertMessage({ text: text });     
               io.sockets.emit('receiving public message', message);                         
            }   
            else
            {
               console.log("@@ private message @@");
               var user_from = undefined;
               Object.keys(app.prConnections).forEach(function(key) 
               {
                  if(app.prConnections[key].includes(getCookie(socket)))
                  {
                     user_from = key;
                  }
               });            
               if(user_from)
               {
                  var message = db.insertMessage({ user_from: user_from, text: text }); 
                  io.sockets.emit('receiving public message', message);                           
               }
               else
               {
                  console.log("!! socket desconhecida !!");
               }           
            }
        });
    });  
     
    module.exports = io;
};

function isPublic(socket)
{
   var cookie = socket.handshake.headers.cookie; 
   return cookie.indexOf("connect.sid") === -1;
}

function getCookie(socket)
{
   var cookie = socket.handshake.headers.cookie;
   return cookie.substring(cookie.indexOf("io=")+3,cookie.indexOf(";"))
}