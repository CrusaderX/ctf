const express = require('express');
const { generateOtp } = require('../utils/otpStore');
const router = express.Router();
const users = require('../utils/users');

const otpStore = {};

router.get('/', (req, res) => {
    res.render('reset/request-otp');
});


router.post('/', (req, res) => {
    const { username } = req.body;
    console.log(`[INFO] POST /reset - OTP request received for username: ${username}`);

    if (!username) {
        console.error(`[ERROR] POST /reset - Username not provided`);
        res.status(400).send('<h1>Error</h1><p>Username is required.</p>');
        return;
    }

    if (!users[username]) {
        console.error(`[ERROR] POST /reset - Invalid username: ${username}`);
        res.status(400).send('<h1>Error</h1><p>Invalid username.</p>');
        return;
    }

    const otp = generateOtp(username);
    otpStore[username] = otp;
    console.log(`[INFO] POST /reset - OTP generated for username: ${username}, OTP: ${otp}`);

    res.render('reset/verify-otp', { username });
});

router.post('/verify', (req, res) => {
    const { username, otp } = req.body;
    console.log(`[INFO] POST /reset/verify - OTP verification request for username: ${username}, OTP: ${otp}`);

    if (!otpStore[username] || otpStore[username] !== parseInt(otp)) {
        console.error(`[ERROR] POST /reset/verify - Invalid OTP for username: ${username}`);
        res.render('reset/invalid-otp');
        return;
    }

    delete otpStore[username];

    req.session.otpVerified = true;
    req.session.username = username;

    console.log(`[DEBUG] Session after OTP verification: ${JSON.stringify(req.session)}`);
    console.log(`[INFO] POST /reset/verify - OTP verified successfully for username: ${username}`);

    res.render('reset/change-password');
});

router.post('/change-password', (req, res) => {
    console.log(`[DEBUG] Session at password reset: ${JSON.stringify(req.session)}`);

    if (!req.session.otpVerified) {
        console.error(`[ERROR] POST /reset/change-password - Unauthorized access`);
        res.status(403).send('<h1>Unauthorized</h1><p>You must verify your OTP before resetting your password.</p>');
        return;
    }

    const username = req.session.username;

    if (!users[username]) {
        console.error(`[ERROR] POST /reset/change-password - Invalid username: ${username}`);
        res.status(400).send('<h1>Error</h1><p>Invalid username.</p>');
        return;
    }

    const { newPassword } = req.body;

    users[username].password = newPassword;
    console.log(`[INFO] POST /reset/change-password - Password changed successfully for username: ${username}`);

    req.session.destroy(err => {
        if (err) {
            console.error(`[ERROR] Failed to clear session after password reset: ${err.message}`);
            res.status(500).send('<h1>Error</h1><p>Failed to reset session. Please log out manually.</p>');
        } else {
            res.render('reset/password-changed');
        }
    });
});

router.post('/api/get-otp', (req, res) => {
    const { username, password } = req.body;
    console.log(`[INFO] POST /reset/api/get-otp - OTP retrieval attempt for username: ${username}`);

    if (!users[username] || users[username].password !== password) {
        console.error(`[ERROR] POST /reset/api/get-otp - Invalid username or password for username: ${username}`);
        res.status(403).json({ error: 'Unauthorized', message: 'Invalid username or password.' });
        return;
    }

    const otp = otpStore[username];
    if (!otp) {
        console.error(`[ERROR] POST /reset/api/get-otp - No OTP found for username: ${username}`);
        res.status(404).json({ error: 'Not Found', message: 'No OTP generated for this user.' });
        return;
    }

    console.log(`[INFO] POST /reset/api/get-otp - OTP retrieved for username: ${username}, OTP: ${otp}`);
    res.json({ username, otp });
});

module.exports = router;
