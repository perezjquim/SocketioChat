module.exports = {
        prepare: function(app, mUser, mMessage)
        {
                app.get('/', (req, res) =>
                {
                        const auth = req.session.auth;
                        const sessionID = res.req.sessionID;
                        var prMessages = [];
                        var users = [];
                        if (auth)
                        {
                                const userId = auth.userId || auth.facebook.userId;
                                if (!app.prConnections[userId])
                                {
                                        app.prConnections[userId] = {};
                                }
                                app.prConnections[userId][sessionID] = null;
                                prMessages = mMessage.getPrivateMessages(userId);
                                users = mUser.getUsers(userId);
                        }
                        else
                        {
                                res.clearCookie("connect.sid");
                        }
                        const pubMessages = mMessage.getPublicMessages();
                        res.render('home',
                        {
                                pubMessages: pubMessages,
                                prMessages: prMessages,
                                users: users
                        });
                });
                console.log("_ Routes prepared _");
        }
};