const express = require('express');
const router = express.Router();
const users = require('../utils/users');
const fs = require('fs');
const path = require('path');


router.get('/', (req, res) => {
    res.render('admin');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`[INFO] POST /admin/login - Login attempt for username: ${username}`);

    if (users[username] && users[username].password === password) {
        req.session.user = username;
        req.session.role = users[username].role;
        console.log(`[INFO] POST /admin/login - Login successful for username: ${username}, Role: ${users[username].role}`);

        if (users[username].role === "admin") {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/user/dashboard');
        }
    } else {
        console.error(`[ERROR] POST /admin/login - Invalid credentials for username: ${username}`);
        res.send('<h1>Invalid Credentials</h1><p>Please try again.</p><p><a href="/admin">Back to Login</a></p>');
    }
});

router.get('/dashboard', (req, res) => {
    if (!req.session.user || req.session.role !== 'admin') {
        console.error(`[ERROR] GET /admin/dashboard - Unauthorized access attempt by ${req.session.user}`);
        return res.status(403).send('<h1>Forbidden</h1><p>You do not have access to this page.</p>');
    }

    const flagPath = path.join(__dirname, '../flag.txt');
    fs.readFile(flagPath, 'utf-8', (err, flagContent) => {
        if (err) {
            console.error(`[ERROR] Unable to read flag.txt: ${err}`);
            return res.status(500).send('<h1>Error</h1><p>Unable to display the flag.</p>');
        }

        res.render('dashboard', {
            username: req.session.user,
            role: req.session.role,
            flag: flagContent
        });
    });
});

module.exports = router;
