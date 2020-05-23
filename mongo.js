const mongoose=require('mongoose')

if (process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}
const password=process.argv[2]
const arg3=process.argv[3]
const arg4=process.argv[4]
const url=`mongodb+srv://fullstack:${password}@cluster0-ur5za.mongodb.net/test?retryWrites=true&w=majority`
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})

const personSchema=new mongoose.Schema({
    name:String,
    number:String,
})
const Person=mongoose.model('Person',personSchema)
    if(arg3 && arg4){

const person=new Person({
    name:`${arg3}`,
    number:`${arg4}`
})
person.save().then(response=>{
    if(arg3){
    console.log(`added ${arg3} number ${arg4} to phonebook`)
    mongoose.connection.close()
}})
}else{
    console.log('')
}
Person.find({}).then(result=>{
    console.log('Phonebook:')
    result.forEach(person=>{
        console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
})