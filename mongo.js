const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://tomleungks:${password}@cluster0.bn0dc4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const generateId = async () => {
    const maxId = await Person.findOne().sort({id: -1}).select('id').lean()
    return maxId? maxId.id + 1 : 1
}

(async () => {
    const newId = await generateId()

    const newPerson = new Person({
        id: newId,
        name: name,
        number: number
    })

    if (name && number) {
        newPerson.save().then(result => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })
    }

    if (!name && !number) {
        Person.find({}).then(result => {
            console.log("phonebook:");
            result.forEach(p => {
              console.log(`${p.name} ${p.number}`)
            })
            mongoose.connection.close()
          })
    }
})();

