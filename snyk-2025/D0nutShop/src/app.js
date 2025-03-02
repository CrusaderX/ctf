const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 9000;

// Routes
const indexRoutes = require('./routes/index');
const resetRoutes = require('./routes/reset');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'donutshopsecret', resave: false, saveUninitialized: true }));

// Serve static files like CSS and images
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', indexRoutes);
app.use('/reset', resetRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`D0nutShop running on http://localhost:${PORT}`);
});
