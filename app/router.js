module.exports = 
{
    prepare: function(app,everyauth)
    {
      app.get('/', (req, res) => {
          res.render('home');
      });
    }
};