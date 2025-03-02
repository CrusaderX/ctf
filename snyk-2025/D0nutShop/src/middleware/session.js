
const session = require('express-session');

module.exports = session({
    secret: 'change_me',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        httpOnly: true, 
        maxAge: 60000 
    }
});
