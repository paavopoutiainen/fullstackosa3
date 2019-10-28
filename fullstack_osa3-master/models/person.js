//use mongoose library
const mongoose = require('mongoose')
const uniqueValidator = require("mongoose-unique-validator");

//get the url for database
let url = process.env.MONGODB_URI

//connect to the database
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        console.log("connected to mongoDb")
    })
    .catch(error => {
        console.log("error happened:", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
})    

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Person", personSchema)







