var mongoose = require("mongoose"),
	Schema = mongoose.Schema

var mongoosePaginate = require('mongoose-paginate')
var userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	medias: [{
		cvc: {
			type: String
		},
		expiry: {
			type: String
		},
		focus: {
			type: String
		},
		name: {
			type: String
		},
		number: {
			type: String
		}
	}],
	role: { type: String, enum: ["Admin", "Guest"] },
}, { strict: false, versionKey: false })
// Add { password: String } to schema
userSchema.plugin(require("mongoose-bcrypt"))
userSchema.plugin(mongoosePaginate)

userSchema.methods.toJSON = function () {
	var obj = this.toObject()
	delete obj.password
	obj.id = obj._id
	delete obj._id
	return obj
}
userSchema.path('email').validate(function (email) {
	var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
	return emailRegex.test(email) // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')

module.exports = userSchema

