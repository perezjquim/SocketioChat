module.exports = 
{
    prepare: function(app,passport)
    {
      app.get('/', (req, res) => {
          res.render('home', { user: req.user });
        });
        
      app.get('/login',
        function(req, res){
          res.render('login');
        });
        
      app.post('/login', 
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
          res.redirect('/');
        });
      
      app.get('/logout',
        function(req, res){
          req.logout();
          res.redirect('/');
        });  
    }
};