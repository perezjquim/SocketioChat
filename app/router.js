module.exports = 
{
    prepare: function(app,everyauth,db)
    {
      app.get('/', (req, res) => {
          const auth = req.session.auth;
          var prMessages = [];
          var users = [];  
          if(auth)
          {
                const socketId = req.cookies["io"];                      
                const userId = auth.userId || auth.facebook.userId;
                if(!app.prConnections[userId])
                {
                    app.prConnections[userId] = [];
                } 
                app.prConnections[userId].push(socketId);
                prMessages = db.getPrivateMessages(userId);
                users = db.getUsers(userId);
          }
          else
          {           
                res.clearCookie("connect.sid");
          }
          const pubMessages = db.getPublicMessages();
          res.render('home',{ pubMessages: pubMessages, prMessages: prMessages, users: users });
      });
    }
};