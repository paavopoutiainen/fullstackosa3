require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const Person = require("./models/person.js")

app.use(bodyParser.json())

morgan.token("postData", function(req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms :postData'))


let persons = [
    {
        name: "Paavo",
        number: "9057846954",
        id: 1  
    },
    {
        name: "Mikko",
        number: "093459043",
        id: 2
    }
]


//apin info
app.get("/info", (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`)
})

//GET all
app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons =>{
        res.json(persons.map(person => person.toJSON()))
    })
})
//GET one
app.get("/api/persons/:id", (req, res) => {
    //finding the person from the mongodb using the id in the request.params and findByID method
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

//adding a connection
app.post("/api/persons", (req, res) => {
    
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({
            error: "Content miiiissing"
        })
    } 
   
    const person = new Person({
        name: body.name,
        number: body.number
    })
    let found = false
    //let's see if there is a person in the database with the same name as the new person
    Person.find({name: body.name}).then(result => {
        if(result.length > 0){
            console.log("nimi löytyy jo kannasta")
            return res.status(400).json({
            error: "name must be unique"
                })
        } else {
            person.save().then(savedPerson => {
                res.json(savedPerson.toJSON())
            })
        } 
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next)=> {
    const body = req.body

    const update = {number: body.number}

    Person.findByIdAndUpdate(req.params.id, update, {new: true})
    .then(result => {
        res.json(result.toJSON())
    })
    .catch(error => next(error))
})



//DELETE
app.delete("/api/persons/:id", (req, res, next) => {
    console.log("hellou")
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

