const sqlite = require('sqlite-sync');

module.exports =
{
	query: function(_sql)
	{
		console.log("> Executing query '"+_sql+"'");
		return sqlite.run(_sql);
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
			const sql = "SELECT * FROM 'users' WHERE id='@id@'";
			var user = self.query(sql
				.replace("@id@",id));
			
			if(user.length > 0)
			{
				return cb(null, user[0]);
			}
			else
			{
				cb(new Error('User ' + id + ' does not exist'));
				return cb(null, null);
			}
		});
	},

	insertUser: function(username, password, cb)
	{
		const self = this;

		process.nextTick(function() 
		{
			const sql_insert = "INSERT INTO 'users' ('username','password') VALUES('@username@','@password@')";
			self.query(sql_insert
				.replace("@username@",username)
				.replace("@password@",password));

			const sql_get_id = "SELECT max(id) as id FROM 'users'";
			var id = self.query(sql_get_id)[0].id;
			
			return cb(null, { id: id, username: username, password: password });
		});
	}
};

sqlite.connect("./database/database.db");
module.exports.query("CREATE TABLE IF NOT EXISTS 'users' ( 'id' INTEGER NOT NULL PRIMARY KEY , 'username' VARCHAR(45), 'password' VARCHAR(45))");