//use mongoose library
const mongoose = require('mongoose')

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
    name: String,
    number: String
})    

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)







