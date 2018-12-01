module.exports =
{
    prepare: function(db)
    {
        this.db = db;
    },

    insertMessage: function(message)
	{
		const sql = "INSERT INTO 'messages' "+
					"('user_from','user_to','text','timestamp') "+
					"VALUES "+
					"('@user_from@','@user_to@','@text@',CURRENT_TIMESTAMP)";
		var id = this.db.query(sql
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

		return this.db.query(sql
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
		return this.db.query(sql);
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

		return this.db.query(sql
			.replace(/@userId@/g,userId));
	}
};

