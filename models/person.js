const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
	id: Number,
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		required: true,
		validate: {
			validator(value) {
				return /^\d{2,3}-\d{7,}$/.test(value);
			},
		},
		message: props => `${props.value} is not a valid phone number.`,
	},
});

personSchema.set('toJSON', {
	transform(document, returnedObject) {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);
