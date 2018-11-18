const sqlite = require('sqlite-sync');

module.exports =
{
	connect: function()
	{
		sqlite.connect("./database/database.db");
		console.log("> Connected to database!");
	},

	query: function(_sql)
	{
		console.log("> Executing query '"+_sql+"'");
		return sqlite.run(_sql);
	},
	
	init: function()
	{
		this.connect();
		this.query("CREATE TABLE IF NOT EXISTS 'users' ( 'id' INTEGER NOT NULL PRIMARY KEY , 'username' VARCHAR(45), 'password' VARCHAR(45), 'name' VARCHAR(45) )");
	},

	getUsers: function()
	{
		return this.query("SELECT * FROM 'users'");
	},

	findUser: function(username,password,cb)
	{
		const self = this;

		process.nextTick(function() 
		{
			var users = self.getUsers();
			for (var i = 0, len = users.length; i < len; i++) 
			{
				var user = users[i];
				if (user.username === username && user.password === password) 
				{
					return cb(null, user);
				}
			}
			return cb(null, null);
		});
	},

	findUserById: function(id,cb)
	{
		const self = this;

		process.nextTick(function() 
		{
			var users = self.getUsers();
			users = users.filter((user) => { return user.id === id; });
			if(users.length > 0)
			{
				return cb(null, users[0]);
			}
			else
			{
				cb(new Error('User ' + id + ' does not exist'));
				return cb(null, null);
			}
		});
	}
};