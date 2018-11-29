const sqlite = require('sqlite-sync');

module.exports =
{
	query: function(_sql)
	{
		console.log(">>>>> Executing query '"+_sql+"'");
		return sqlite.run(_sql);
	},

	getUsers: function(userId)
	{
		const sql = "SELECT name,username "+
					"FROM users "+
					"WHERE id != '@userId@' "
					"ORDER BY name ASC";
		return this.query(sql
			.replace("@userId@",userId));
	},

	findUser: function(username,password)
	{
		const sql = "SELECT * FROM 'users' "+
					"WHERE username='@username@' "+
					"AND password='@password@' "+
					"LIMIT 1";
		const user = this.query(sql
			.replace("@username@",username)
			.replace("@password@",password));

		if(user.length > 0) return user[0];
	},

	findUserByUsername: function(username)
	{
		const sql = "SELECT id FROM 'users' "+
					"WHERE username='@username@' "+
					"LIMIT 1";
		const user = this.query(sql
			.replace("@username@",username));
		if(user.length > 0) return user[0].id;			
	},

	findUserById: function(id,cb)
	{
		const self = this;

		const sql = "SELECT * "+
					"FROM 'users' "+
					"WHERE id='@id@' "+
					"LIMIT 1";
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

		const sql_check = 	"SELECT id "+
							"FROM 'users' "+
							"WHERE username='@username@' "+
							"LIMIT 1";
		var id = self.query(sql_check
			.replace("@username@",user.username || ""));

		var notExists = !id.length;
		
		if(notExists)
		{
			if(!user.id)
			{
				var sql_insert = 	"INSERT INTO 'users' "+
									"('username','password','name') "+
									"VALUES "+
									"('@username@','@password@','@name@')";
			}
			else
			{
				var sql_insert = 	"INSERT INTO 'users' "+
									"('id','username','password','name') "+
									"VALUES "+
									"('@id@','@username@','@password@','@name@')";
			}
			
			user.id = self.query(sql_insert
				.replace("@username@",user.username || "")
				.replace("@password@",user.password || "")
				.replace("@name@",user.name || "")
				.replace("@id@",user.id || ""));
		}
		else
		{
			id = id[0].id;
		}	
		if(!user.id) user.id = id;
		return user;
	},	

	insertMessage: function(message)
	{
		const sql = "INSERT INTO 'messages' "+
					"('user_from','user_to','text','timestamp') "+
					"VALUES "+
					"('@user_from@','@user_to@','@text@',CURRENT_TIMESTAMP)";
		var id = this.query(sql
			.replace("@user_from@",message.user_from || "")
			.replace("@user_to@",message.user_to || "")
			.replace("@text@",message.text || ""));

		return this.getMessage(id);
	},

	getMessage: function(id)
	{
		const sql =  	"SELECT sender.name as sender, receiver.name as receiver, text, timestamp "+
						"FROM messages "+
						"LEFT JOIN users as sender "+
						"ON ( messages.user_from = sender.id ) "+
						"LEFT JOIN users as receiver "+
						"ON ( messages.user_to = receiver.id ) "+
						"WHERE messages.id = '@id@' "+
						"ORDER BY timestamp DESC";

		return this.query(sql
			.replace("@id@",id))[0];
	},

	getPublicMessages: function()
	{
		const sql = "SELECT "+
					"users.name,text,timestamp "+
					"FROM messages "+
					"LEFT JOIN users ON messages.user_from=users.id "+
					"WHERE user_to ='' "+
					"ORDER BY timestamp DESC";				
		return this.query(sql);
	},

	getPrivateMessages: function(userId)
	{
		const sql = "SELECT * FROM"+
					"("+
						"SELECT sender.name as sender, receiver.name as receiver, text, timestamp "+
						"FROM messages "+
						"INNER JOIN users as sender "+
						"ON ( messages.user_from = sender.id ) "+
						"INNER JOIN users as receiver "+
						"ON ( messages.user_to = receiver.id ) "+
						"WHERE user_from = '@userId@' "+
					") "+
					"UNION "+
					"SELECT * FROM "+
					"("+
						"SELECT sender.name as sender, receiver.name as receiver, text, timestamp "+
						"FROM messages "+
						"INNER JOIN users as sender "+
						"ON ( messages.user_from = sender.id ) "+
						"INNER JOIN users as receiver "+
						"ON ( messages.user_to = receiver.id ) "+
						"WHERE user_to = '@userId@' "+				
					") "+
					"ORDER BY timestamp DESC, sender ASC, receiver ASC ";

		return this.query(sql
			.replace(/@userId@/g,userId));
	}
};

sqlite.connect("./database/database.db");
module.exports.query(
	"PRAGMA foreign_keys = ON; "+
	"CREATE TABLE IF NOT EXISTS 'users' "+
	"("+
	"'id' INTEGER NOT NULL PRIMARY KEY UNIQUE,"+ 
	"'username' VARCHAR(45) UNIQUE,"+
	"'password' VARCHAR(45),"+
	"'name' VARCHAR(45)"+
	");"+
	"CREATE TABLE IF NOT EXISTS 'messages' "+
	"("+
	"'id' INTEGER NOT NULL PRIMARY KEY UNIQUE,"+
	"'user_from' INTEGER NOT NULL,"+
	"'user_to' INTEGER,"+
	"'text' VARCHART(45) NOT NULL,"+
	"'timestamp' TEXT NOT NULL "+
	"FOREIGN KEY(`user_from`) REFERENCES users ( id ),"+
	"FOREIGN KEY(`user_to`) REFERENCES users ( id )"+
	");");