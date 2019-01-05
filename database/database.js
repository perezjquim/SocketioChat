const sqlite = require('sqlite-sync');

module.exports =
{
	query: function(_sql)
	{
		console.log(">>>>> Executing query '"+_sql+"'");
		return sqlite.run(_sql);
	}
};

sqlite.connect("./database/database.db");
module.exports.query(
	"PRAGMA foreign_keys = ON; "+
	//"DELETE FROM messages; "+
	"CREATE TABLE IF NOT EXISTS 'users' "+
	"("+
	"'id' INTEGER NOT NULL PRIMARY KEY UNIQUE,"+ 
	"'username' VARCHAR(45) UNIQUE,"+
	"'password' VARCHAR(45),"+
	"'name' VARCHAR(45)"+
	"); "+
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