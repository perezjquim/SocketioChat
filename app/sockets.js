const users = [];
const connections = [];

module.exports.prepare = function(server)
{   
    var io = require("socket.io").listen(server);

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
     
    module.exports = io;
};