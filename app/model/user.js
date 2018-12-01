module.exports =
{
    prepare: function(db)
    {
        this.db = db;
    },

    getUsers: function(userId)
	{
		const sql = "SELECT name,username "+
					"FROM users "+
					"WHERE id != '@userId@' "
					"ORDER BY name ASC";
		return this.db.query(sql
			.replace("@userId@",userId));
	},

	findUser: function(username,password)
	{
		const sql = "SELECT * FROM 'users' "+
					"WHERE username='@username@' "+
					"AND password='@password@' "+
					"LIMIT 1";
		const user = this.db.query(sql
			.replace("@username@",username)
			.replace("@password@",password));

		if(user.length > 0) return user[0];
	},

	findUserByUsername: function(username)
	{
		const sql = "SELECT id FROM 'users' "+
					"WHERE username='@username@' "+
					"LIMIT 1";
		const user = this.db.query(sql
			.replace("@username@",username));
		if(user.length > 0) return user[0].id;			
	},

	findUserById: function(id,cb)
	{
		const sql = "SELECT * "+
					"FROM 'users' "+
					"WHERE id='@id@' "+
					"LIMIT 1";
		var user = this.db.query(sql
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
		const sql_check = 	"SELECT id "+
							"FROM 'users' "+
							"WHERE username='@username@' "+
							"LIMIT 1";
		var id = this.db.query(sql_check
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
			
			user.id = this.db.query(sql_insert
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
	}
};