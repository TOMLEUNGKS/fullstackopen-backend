const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('req-body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :req-body'));

app.use(express.json())

let persons = require('./data.json')

//GET requests
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const length = persons.length
    const time = (new Date()).toString()
    response.send(`
    <div>
        <p>Phonebook has info for ${length} people</p>
        <p>${time}</p>
    </div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

//POST requests
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'Name and number missing'
        })
    }

    if (!body.name) {
        return response.status(400).json({
            error: 'Name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'Number missing'
        })
    }

    if (persons.filter(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

	const person = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }  
	console.log(persons)

    persons = persons.concat(person)
	response.json(persons)
})

//DELETE requests
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
