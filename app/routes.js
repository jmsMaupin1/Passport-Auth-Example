const path = require('path');

module.exports = (app, passport) => {
	// Home page
	app.get('/', (req, res) => {
		res.render('index.ejs')
	});


	// Signup
	app.get('/signup', (req, res) => {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	})

	// Process Signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/signup',  // redirect back to the signup page if there is an error
		failureFlash: true           // allow flash messages
	}))

	// Login
	app.get('/login', (req, res) => {
		res.render('login.ejs', { message: req.flash('loginMessagae') });
	});

	// Process Login Form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// Profile - Protected, require authentication
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile.ejs', { user: req.user });
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