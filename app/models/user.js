const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

// Defining mongoose schema for users
const userSchema = mongoose.Schema({
	local: {
		email:    "string",
		password: "string"
	},
})

// Schema Methods

// Generating a Hash
userSchema.methods.generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// Checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}

// Compile model and export it
module.exports = mongoose.model('User', userSchema);