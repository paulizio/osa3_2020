const express = require('express')
const app = express()
app.use(express.static('build'))
app.use(express.json())
require('dotenv').config()
const morgan = require('morgan')
morgan('tiny')
const cors=require('cors')
const Person=require('./models/person')
app.use(cors())
let persons=[
  {
    'name': 'Arto Hellas',
    'number': '040-123456',
    'id': 1
  },
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
    'id': 2
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'id': 3
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
    'id': 4
  }
]

morgan.token('body', function (req) { return JSON.stringify(req.body) })
const morganLogger=':method :url :status :res[content-length] - :response-time ms:body'
app.use(morgan(morganLogger))


app.get('/api/persons',(req,res,next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
    .catch(error => next(error))
})
app.get('/info',(req,res,next) => {
  // let amount=persons.length
  // console.log('amount of people: ', amount)
  let date=new Date()
  // console.log('Date: ',date)
  // res.send(`<p>Phonebook has info for ${amount} people</p>
  // <p>${date}</p>`)
  Person.find({}).then(person => {

    res.send(`<p>Phonebook has info for ${person.length} people</p>
      <p>${date}</p>`)
  })
    .catch(error => next(error))
}
)



// const generateId = () => {

//     return Math.floor(Math.random()*10000000000000000000)
//   }
app.post('/api/persons',(request,response,next) => {
  const body=request.body
  if(!body.name||!body.number){
    return response.status(400).json({
      error:'name or number missing'
    })
  }else if(persons.some(p => p.name===body.name)){
    return response.status(400).json({

      error:'name already in phonebook'

    })
  }else{

    const person=new Person({
      name:body.name,
      number:body.number,
      // id:generateId()
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
      .catch(error => next(error))
  }})
app.get('/api/persons/:id',(req,res,next) => {
  // let id=Number(req.params.id)
  // console.log('id: ',id)
  // console.log('typeof id:', typeof id)
  // let person=persons.find(person=>person.id===id)
  // console.log('Person.id type: ',typeof person)
  // if(person){
  // res.json(person)
  Person.findById(req.params.id)
    .then(person => {
      if(person){
        res.json(person.toJSON())

      }else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(req,res,next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(res => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


const errorHandler=(error,req,res,next) => {
  console.log(error.message)
  if(error.name==='CastError'){
    return res.status(400).send({ error:'malformatted id' })

  }else if(error.name==='ValidationError'){
    return res.status(400).json({ error:error.message })
  }
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
