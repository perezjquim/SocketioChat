module.exports = 
{
    prepare: function(app,everyauth,db)
    {
      app.get('/', (req, res) => {
          const auth = req.session.auth;
          var prMessages = [];  
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
          }
          else
          {           
                res.clearCookie("connect.sid");
          }
          const pubMessages = db.getPublicMessages();
          res.render('home',{ pubMessages: pubMessages, prMessages: prMessages });
      });
    }
};