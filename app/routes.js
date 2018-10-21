const path = require('path');

module.exports = (app, passport) => {
	// Home page
	app.get('/', (req, res) => {
		res.render('index.ejs')
	});

	// Login
	app.get('/login', (req, res) => {
		res.render('login.ejs', { message: req.flash('loginMessagae') });
	});

	// Process Login Form
	// app.post('/login', pass port stuff);

	// Signup
	app.get('/signup', (req, res) => {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	})

	// Process Signup form
	// app.post('/signup', pass port stuff)

	// Profile - Protected, require authentication
	app.get('/profile', isLoggedIn, (req, res) => {
		res.sendFile('profile.ejs', { user: req.user });
	})

	// Logout
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	})
}

// Is Logged In Middleware to check if a user is logged in
function isLoggedIn (req, res, next) {
	if(req.isAuthenticated())
		return next();

	res.redirect('/');
}