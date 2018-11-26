module.exports = 
{
    prepare: function(app,everyauth,db)
    {
      app.get('/', (req, res) => {
          const pMessages = db.getPublicMessages();
          res.render('home',{ pMessages: pMessages });
      });
    }
};