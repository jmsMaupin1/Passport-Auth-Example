const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user.js');

module.exports = (passport) => {
	// Passport Session setup
	// Required for persistent login sessions
	// Passport needs ability to serialize and unserialize users of sessions
	passport.serializeUser((user, done) => {
		done(null, user.id);
	})

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		})
	})

	// Local signup
	// we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
    	usernameField: 'email',
    	passwordField: 'password',
    	passReqToCallback: true
    }, (req, email, password, done) => {
    	process.nextTicks(() => {
    		// Find a user whose email is the same as the forms email
    		User.findOne({ 'local.email' : email }, (err, user) => {
    			if (err) return done(err);

    			if (user) return done(null, false, req.flash('signupMessage', 'That email is already taken'));
				// Create the user if there is no email
				const newUser = new User();

				// Set users local credentials
				newUser.local.email    = email;
				newUser.local.password = newUser.generateHash(password);

				// Save user
				newUser.save( (err) => {
					if (err) throw err;
					return done(null, newUser);
				})
    		})
    	})
    }));

    passport.use('local-login', new LocalStrategy({
    	usernameField: 'email',
    	passwordField: 'password',
    	passReqToCallback: true
    }, (req, email, password, done) => {
    	User.findOne( { 'local.email' : email }, (err, user) => {
    		if (err) throw err;

    		// User not found
    		if (!user) 
    			return done(null, false, req.flash('loginMessage', 'no user found'));

    		// Password is invalid
    		if (!user.validPassword(password))
    			return done(null, false, req.flash('loginMessage', 'Oops! wrong password'));

    		// Login success
    		return done(null, user);
    	})
    }))
}