const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('data', request => {
  if (request.method === "POST"){
    return JSON.stringify(request.body)
  }
  return " "
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.json())


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>${new Date()}<p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(person => person.id === id)
    
  
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  
    const person = request.body

    if (!person.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }
    if (!person.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }
    if (persons.find(p => p.name===person.name)){
        return response.status(400).json({ 
            error: 'name must be unique'
        })
    }
    const id = Math.floor(Math.random() * 1000000)
  
    persons = persons.concat({
      "name": person.name,
      "number": person.number,
      "id": id
    })
  
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})