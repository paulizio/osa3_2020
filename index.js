const express = require('express')
const app = express()
const morgan = require('morgan')
morgan('tiny')
app.use(express.json())
let persons=[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]
  
  morgan.token('body', function (req) { return JSON.stringify(req.body) })
  const morganLogger=':method :url :status :res[content-length] - :response-time ms:body'
app.use(morgan(morganLogger))


app.get('/api/persons',(req,res)=>{
    res.json(persons)
})
app.get('/info',(req,res)=>{
    let amount=persons.length
    console.log('amount of people: ', amount)
    let date=new Date()
    console.log('Date: ',date)
    res.send(`<p>Phonebook has info for ${amount} people</p>
    <p>${date}</p>`)

})
const generateId = () => {

    return Math.floor(Math.random()*10000000000000000000)
  }
app.post('/api/persons',(request,response)=>{   
    const body=request.body
    if(!body.name||!body.number){
return response.status(400).json({
  error:'name or number missing'
})
    }else if(persons.some(p=>p.name===body.name)){
return response.status(400).json({

  error:'name already in phonebook'
  
})
    }else{
    
    const person={
        name:body.name,
        number:body.number,
        id:generateId()
    }
    persons=persons.concat(person)
response.json(person)
}})
app.get('/api/persons/:id',(req,res)=>{
    let id=Number(req.params.id)
    console.log('id: ',id)
    console.log('typeof id:', typeof id)
    let person=persons.find(person=>person.id===id)
    console.log('Person.id type: ',typeof person)
    if(person){
    res.json(person)
    }else{
        res.status(404).end()
    }
})
app.delete('/api/persons/:id',(req,res)=>{
    let id=Number(req.params.id)
    persons=persons.filter(p=>p.id!==id)
    res.status(204).end()
})




  const PORT=3001
  app.listen(PORT)
  console.log(`Server running on port ${PORT}`)
