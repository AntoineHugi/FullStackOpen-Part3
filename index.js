const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

morgan.token('post-body', function (req, res) { 
    return JSON.stringify(req.body) 
})

app.use(morgan(':method :url :status :response-time :post-body')) 
app.use(express.json())

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const phonebookLength = persons.length
    const today = new Date()
    console.log(persons.length)
    response.send(`<div>Phonebook has info on ${phonebookLength} people</div><br/><div> ${today} </div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    
    const newPerson = request.body
    const newName = newPerson.name
    const newNumber = newPerson.number
    newPerson.id = Math.floor(Math.random() * 100000)
    console.log('new name', newName, 'is person found?', persons.find(person => person.name === newName))
    if (!newName) {
        response.status(400).send({ error: 'please add a name' }).end()
    } else if (!newNumber) {
        response.status(400).send({ error: 'please add a number' }).end()
    } else if (persons.find(person => person.name === newName)) {
        response.status(400).send({ error: 'this name already exists' }).end()
    } else if (persons.find(person => person.number === newNumber)) {
        response.status(400).send({ error: 'this number already exists' }).end()
    } else {
        persons = persons.concat(newPerson)
        response.send({ success: 'this person was added to the phonebook' }).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})