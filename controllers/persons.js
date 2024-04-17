const personsRouter = require('express').Router();
const Person = require('../models/person');

// GET requests
personsRouter.get('/api/persons', (request, response, next) => {
	Person.find({})
		.then(people => {
			response.status(200).json(people);
		})
		.catch(error => next(error));
});

personsRouter.get('/info', (request, response, next) => {
	const time = (new Date()).toString();
	Person.countDocuments({})
		.then(count => {
			response.status(200).send(`
        <div>
            <p>Phonebook has info for ${count} people</p>
            <p>${time}</p>
        </div>
        `);
		})
		.catch(error => next(error));
});

personsRouter.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => {
			next(error);
			response.status(400).send({error: 'malformatted id'});
		});
});

// POST requests
personsRouter.post('/api/persons', (request, response, next) => {
	if (!request.body.name || !request.body.number) {
		response.status(400).end();
	} else {
		const id = Math.floor(Math.random() * 100);
		const newPerson = new Person({
			id,
			name: request.body.name,
			number: request.body.number,
		});
		newPerson.save()
			.then(_result => {
				console.log('new person saved!');
				response.status(200).json(newPerson);
			})
			.catch(error => next(error));
	}
});

// DELETE requests
personsRouter.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(person => {
			console.log('person', person);
			response.status(200).send(person);
		})
		.catch(error => next(error));
});

// UPDATE requests
personsRouter.put('/api/persons/:id', (request, response, next) => {
	const {name} = request.body;
	const {number} = request.body;
	const person = {
		name,
		number,
	};
	if (name && number) {
		Person.findByIdAndUpdate(request.params.id, person, {new: true})
			.then(updatedPerson => {
				response.status(200).json(updatedPerson);
			})
			.catch(error => next(error));
	} else {
		response.status(400).end();
	}
});

module.exports = personsRouter;
