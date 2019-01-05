module.exports = 
{
    prepare: function(app,mUser,mMessage)
    {
        app.get('/', (req, res) => {
            const pubMessages = mMessage.getPublicMessages();
            res.render('publicChat',{ pubMessages: pubMessages});
        });
        app.get('/chatPrivado',function(req,res){
            const auth = req.session.auth;
            var prMessages = [];
            var users = [];  
            if(auth)
            {
                const socketId = req.cookies["io"];                      
                const userId = auth.userId || auth.facebook.userId;
                if(!app.prConnections[userId])
                {
                    app.prConnections[userId] = [];
                } 
                app.prConnections[userId].push(socketId);
                prMessages = mMessage.getPrivateMessages(userId);
                console.log(prMessages);
                users = mUser.getUsers(userId);
            }
            else
            {           
                res.clearCookie("connect.sid");
            }
            res.render('privateChat',{prMessages:prMessages, users:users});
        });
        console.log("_ Routes prepared _");
    }
};