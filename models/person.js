const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
console.log('connecting to', url)
mongoose.connect(url)
.then(result => {    
    console.log('connected to MongoDB')  
})  
.catch(error => {    
    console.log('error connecting to MongoDB:', error.message)  
})

const personSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /^\d{2,3}-\d{7,}$/.test(value)
            }
        },
        message: props => `${props.value} is not a valid phone number.`
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
