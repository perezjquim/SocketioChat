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

	findUserById: function(id,type,cb)
	{
		const self = this;

		const sql = "SELECT * FROM '@type@users' WHERE id='@id@'";
		var user = self.query(sql
			.replace("@id@",id || "")
			.replace("@type@",type));
		
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

	insertUser: function(type,user,cb)
	{
		const self = this;

		const sql_check = "SELECT id FROM '@type@users' WHERE username='@username@'";
		var id = self.query(sql_check
			.replace("@username@",user.username || "")
			.replace("@type@",type));

		var notExists = !id.length;
		
		if(notExists)
		{
			const sql_insert = "INSERT INTO '@type@users' ('username','password','name') VALUES('@username@','@password@','@name@')";
			self.query(sql_insert
				.replace("@username@",user.username || "")
				.replace("@password@",user.password || "")
				.replace("@name@",user.name || "")
				.replace("@type@",type));

			const sql_get_id = "SELECT max(id) as id FROM 'users'";
			id = self.query(sql_get_id)[0].id;
		}
		else
		{
			id = id[0].id;
		}	
		user.id = id;
		return user;
	}
};

sqlite.connect("./database/database.db");
module.exports.query(
	"CREATE TABLE IF NOT EXISTS 'users' "+
	"("+
	"'id' INTEGER NOT NULL PRIMARY KEY,"+ 
	"'username' VARCHAR(45),"+
	"'password' VARCHAR(45),"+
	"'name' VARCHAR(45)"+
	");"+
	"CREATE TABLE IF NOT EXISTS 'fbusers' "+
	"("+
	"'id' INTEGER NOT NULL PRIMARY KEY,"+ 
	"'username' VARCHAR(45),"+
	"'password' VARCHAR(45),"+
	"'name' VARCHAR(45)"+
	");"	);