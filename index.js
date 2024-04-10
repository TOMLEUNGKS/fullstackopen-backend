const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('req-body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :req-body'));

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let persons = require('./data.json')

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

//GET requests
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
    if (!request.body.name || !request.body.number) {
        response.status(400).end()
    } else {
        const newPerson = {
            id: generateId(),
            name: request.body.name,
            number: request.body.number
        }
        persons = persons.concat(newPerson)
        response.status(200).json(newPerson)
    }
})

// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     if (!body.name && !body.number) {
//         return response.status(400).json({
//             error: 'Name and number missing'
//         })
//     }

//     if (!body.name) {
//         return response.status(400).json({
//             error: 'Name missing'
//         })
//     }

//     if (!body.number) {
//         return response.status(400).json({
//             error: 'Number missing'
//         })
//     }

//     if (persons.filter(person => person.name === body.name)) {
//         return response.status(400).json({
//             error: 'name must be unique'
//         })
//     }

// 	const person = {
//         id: Math.floor(Math.random() * 1000000),
//         name: body.name,
//         number: body.number
//     }  
// 	console.log(persons)

//     persons = persons.concat(person)
// 	response.json(persons)
// })


//DELETE requests
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.status(200).send(person)
    } else {
        response.status(204).end()
    }
})

//UPDATE requests
app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    if (!request.body.name || !request.body.number) {
        response.status(400).end()
    } else {
        const updatedPerson = {
            id: id,
            name: request.body.name,
            number: request.body.number
        }
        persons = persons.map(p => p.id !== id? p : updatedPerson)
        response.status(200).json(updatedPerson)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
