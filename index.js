require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// const mongoose = require('mongoose')

const app = express()
// const password = process.argv[2]
// const url = `mongodb+srv://tomleungks:${password}@cluster0.bn0dc4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

morgan.token('req-body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :req-body'));

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

const generateId = async () => {
    const maxId = await Person.findOne().sort({id: -1}).select('id').lean()
    return maxId? maxId.id + 1 : 1
}

//GET requests
app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(people => {
        response.status(200).json(people)
      })
    .catch(error => next(error))
})

// app.get('/info', (request, response) => {
//     const length = persons.length
//     const time = (new Date()).toString()
//     response.send(`
//     <div>
//         <p>Phonebook has info for ${length} people</p>
//         <p>${time}</p>
//     </div>
//     `)
// })

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        next(error)
        console.log(error)      
        response.status(400).send({ error: 'malformatted id' })     
    })
})

//POST requests
app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        response.status(400).end()
    } else {
        (async() => {
            const id = await generateId()
            const newPerson = new Person({
                id: id,
                name: request.body.name,
                number: request.body.number
            })
            newPerson.save().then(result => {
                console.log('new person saved!')
                mongoose.connection.close()
            })
            response.status(200).json(newPerson)
        })()
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


// DELETE requests
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(person => {
        console.log("person", person)
        response.status(200).send(person)
    })
    .catch(error => next(error))
})

//UPDATE requests
app.put('/api/persons/:id', (request, response) => {
    const name = request.body.name
    const number = request.body.number
    const person = {
        name: name,
        number: number
    }
    if (name && number) {
        Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.status(200).json(updatedPerson)
        })
        .catch(error => next(error))
    } else {
        response.status(400).end()
    }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
