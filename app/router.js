module.exports = 
{
    prepare: function(app,everyauth,db)
    {
      app.get('/', (req, res) => {
          const auth = req.session.auth;
          var prMessages = [];
          if(auth)
          {
              const userId = auth.userId || auth.facebook.userId;
              prMessages = db.getPrivateMessages(userId);
          }
          const pubMessages = db.getPublicMessages();
          res.render('home',{ pubMessages: pubMessages, prMessages: prMessages });
      });
    }
};