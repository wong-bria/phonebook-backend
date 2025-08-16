const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
//app.use(morgan('tiny'))

// Custom token for POST request body
morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let data = [
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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/info', (request, response) => {
    const date = new Date(Date.now())
    response.send(`<div>Phonebook has info for ${data.length} people</div><br /><div>${date}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = data.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.statusMessage = "Person not found"
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(person => person.id !== id)

    response.status(204).end()
})

const generateID = () => {
    return Math.floor(Math.random() * 999999999)
}

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({ error: 'Name and number are required' })
    }

    if (data.find(person => person.name === name)) {
        return response.status(400).json({ error: 'Name must be unique' })
    }

    const id = generateID()
    const newPerson = { id, name, number }

    data = data.concat(newPerson)
    response.json(newPerson)
})


// const PORT = 3001

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})