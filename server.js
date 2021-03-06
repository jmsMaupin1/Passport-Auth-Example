// Import express and middleware dependencies 
const express      = require('express');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

// Import the rest of the tools
const mongoose     = require('mongoose');
const passport     = require('passport');
const flash        = require('connect-flash');

// Get Configurations
const configDB = require('./config/database');

// Set up express 
const app          = express();
const port         = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

// Required for passport
app.use(session({ secret: 'd003994a-3b03-4909-8e61-13b9534c8d85'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Configuration
mongoose.connect(configDB.url);
require('./config/passport')(passport);

// Routes
require('./app/routes.js')(app, passport);

// Launch
app.listen(port, (err, res) => {
	if(err) throw err;

	console.log(`Listening on port: ${port}`)
});