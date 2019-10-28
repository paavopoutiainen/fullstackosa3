//otetaan dotenv kirjasto käyttöön, pitää ottaa käyttöön ennen modelien importtaamista
//jotta .env:ssä määritellyt ympäristömuuttujat olisivat moduulien käytössä
require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.static('build'))
//middleware, joka parsii requestistä bodyn 
const bodyParser = require('body-parser')
var morgan = require('morgan')
const Person = require("./models/person.js")
//parsitaan pelkkä json ja etsii vain niitä requestejä, joiden content-type on json
app.use(bodyParser.json())

morgan.token("postData", function(req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms :postData'))


//apin info
app.get("/info", (req, res) => {
    Person.find({})
    .then(result => {
        res.send(`<p>Phonebook has info for ${result.length} people</p>
        <p>${Date()}</p>`)
    })
    
})

//GET all
app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons =>{
        res.json(persons.map(person => person.toJSON()))
    })
})
//GET one
app.get("/api/persons/:id", (req, res, next) => {
    //finding the person from the mongodb using the id in the request.params and findByID method
    Person.findById(req.params.id).then(person => {
        if(person){
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

//adding a connection
app.post("/api/persons", (req, res, next) => {
    
    const body = req.body

    /*if(!body.name || !body.number){
        return res.status(400).json({
            error: "Content miiiissing"
        })
    } 
   */
    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => res.status(200).json(savedAndFormattedPerson))
    .catch(error => next(error))
})
//updating the person, this is requested from frontend when the name of the to be added person already exists
//
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
            if(result){
                console.log(result)
                res.status(204).end()
            } else {
                res.status(404).end()
            }
           
           
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log("täällä1:", error)
    console.log("hellou", error.errors.number)
    
    
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name ==="ValidationError" ){
        return response.status(400).json({error: error.message})
    } 
  
    next(error)
  }
  
app.use(errorHandler)


const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

