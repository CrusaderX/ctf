const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    if (!req.session.user || req.session.role !== 'user') {
        console.error(`[ERROR] GET /user/dashboard - Unauthorized access attempt by ${req.session.user}`);
        return res.status(403).send('<h1>Forbidden</h1><p>You do not have access to this page.</p>');
    }

    res.render('user-dashboard', {
        username: req.session.user
    });
});

module.exports = router;
