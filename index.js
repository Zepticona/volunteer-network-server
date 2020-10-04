// Importing Modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;

// Initalizing Environement Variable
require('dotenv').config()

// Declaring Express Server
const app = express();


// Initializing Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// Declaraing Mogodb essentials
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ebkk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', (req, res) => {
    res.send('Hello World.')
})


client.connect(err => {
  const volunteerWorkCollection = client.db("volunteerAppDb").collection("volunteeringWorks");
  const userCollection = client.db("volunteerAppDb").collection("users");

  // Get all volunteering Works
  app.get('/allWorks', (req, res) => {
    volunteerWorkCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents)
    })
  });

  // Get all Users
  app.get('/allRegisteredUsers', (req, res) => {
    userCollection.find({})
    .toArray( (err, documents) => {
      console.log(documents)
      res.send(documents)
    })
  })

  // Load one(clicked) Volunteering Work
  app.get('/allWorks/:id', (req, res) => {
    const workId = parseInt(req.params.id);
    // console.log(`${typeof(req.params.id)}`)
    volunteerWorkCollection.find({id: workId})
    .toArray( (err, documents) => {
      console.log(documents)  
      res.send(documents[0]);
    })
  })

  // Add new volunteering work to the database
  app.post('/addWork', (req, res) => {
    const newVolunteeringWork = req.body;
    console.log(newVolunteeringWork)
    volunteerWorkCollection.insertOne(newVolunteeringWork)
    .then( result => {
      console.log(result)
    })
  })

  // Create user by registering his selected volunteering work into the database
  app.post('/addUsers', (req, res) => {
    userCollection.insertOne(req.body)
    .then( result => {
      console.log(result)
      // res.redirect('http://localhost:3000/testingRoute')
    })
  })

  // Load all the registered by a specific
  app.get('/registeredWorks', (req, res) => {
    userCollection.find({email: req.query.email})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  // Delete Users (Along with information about their registered Volunteering Work)
  app.delete('/deleteWork/:id', (req, res) => {
    const workId = req.params.id;
    console.log(workId)
    userCollection.deleteOne({
      _id: ObjectId(workId)
    })
    .then( result => {
      console.log(result)
      res.send( result.deletedCount > 0)
    })
  })
});







// Initializing Express server
app.listen(8080, () => console.log('Server running at port 8080'))