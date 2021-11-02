const express = require('express')
const Joi = require('joi')
const app = express();

app.use(express.json());

const courses = [
  {id: 1,name:'course1'},
  {id: 2,name:'course2'},
  {id: 3,name:'course3'}
]

app.get('/', (req,res)=> {
  res.send('Hello World!!');
});

app.get('/api/courses',(req,res)=>{
  res.send(courses);
});

app.get('/api/courses/:id',(req,res)=>{
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if(!course) res.status(404).send('The course with the given id is not found');
  else res.send(course);
});


app.post('/api/courses', (req,res)=>{

  const { error } = validateCourse(req.body);
  // validate
  //If invalid, return 400 - Bad request
  if(error){
    res.status(400).send(error.details[0].message);
    return;
  }

  /*if(!req.body.name || req.body.name.length<3){
    res.status(400).send('Name is required and should be minimum 3 characters')
    return;
  }*/

  const course ={
    id: courses.length+1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id',(req,res)=>{
  //Look up the course1
  //If not existing , return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if(!course) res.status(404).send('The course with the given id is not found');


  const { error } = validateCourse(req.body);
  // validate
  //If invalid, return 400 - Bad request
  if(error){
    res.status(400).send(error.details[0].message);
    return;
  }

  //Update course1
  course.name = req.body.name;
  res.send(course);

  //Return the updated course
});

function validateCourse(course){
  const schema ={
    name: Joi.string().min(3).required()
  };

  return  Joi.validate(course,schema);
}

app.delete('/api/courses/:id',(req,res)=>{
  //Lookup course
  //Not existing return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if(!course) res.status(404).send('The course with the given id is not found');


  //Delete
  const index = courses.indexOf(course);
  courses.splice(index,1);


  res.send(course);

  //Return the same course
});


const port  =  process.env.PORT || 5000;
app.listen(port,()=>console.log(`listening on port ${port}`));
