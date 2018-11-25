const sqlite = require('sqlite-sync');

module.exports =
{
	query: function(_sql)
	{
		console.log(">>>>> Executing query '"+_sql+"'");
		return sqlite.run(_sql);
	},

	getUsers: function()
	{
		return this.query("SELECT * FROM 'users'");
	},

	findUser: function(username,password)
	{
		var users = this.getUsers();
		for (var i = 0, len = users.length; i < len; i++) 
		{
			var user = users[i];
			if (user.username === username && user.password === password) 
			{
				return user;
			}
		}
	},

	findUserById: function(id,cb)
	{
		const self = this;

		const sql = "SELECT * FROM 'users' WHERE id='@id@' LIMIT 1";
		var user = self.query(sql
			.replace("@id@",id || ""));
		
		if(user.length > 0)
		{
			return cb(null, user[0]);
		}
		else
		{
			cb(new Error('User ' + id + ' does not exist'));
			return cb(null, null);
		}
	},

	insertUser: function(user)
	{
		const self = this;

		const sql_check = "SELECT id FROM 'users' WHERE username='@username@' LIMIT 1";
		var id = self.query(sql_check
			.replace("@username@",user.username || ""));

		var notExists = !id.length;
		
		if(notExists)
		{
			if(!user.id)
			{
				var sql_insert = "INSERT INTO 'users' ('username','password','name') VALUES('@username@','@password@','@name@')";
			}
			else
			{
				var sql_insert = "INSERT INTO 'users' ('id',username','password','name') VALUES('@id@','@username@','@password@','@name@')";
			}
			
			self.query(sql_insert
				.replace("@username@",user.username || "")
				.replace("@password@",user.password || "")
				.replace("@name@",user.name || "")
				.replace("@id@",user.id || ""));

			if(!user.id)
			{
				const sql_get_id = "SELECT max(id) as id FROM 'users'";
				id = self.query(sql_get_id)[0].id;
			}
		}
		else
		{
			id = id[0].id;
		}	
		if(!user.id) user.id = id;
		return user;
	}
};

sqlite.connect("./database/database.db");
module.exports.query(
	"CREATE TABLE IF NOT EXISTS 'users' "+
	"("+
	"'id' INTEGER NOT NULL PRIMARY KEY UNIQUE,"+ 
	"'username' VARCHAR(45) UNIQUE,"+
	"'password' VARCHAR(45),"+
	"'name' VARCHAR(45)"+
	");");