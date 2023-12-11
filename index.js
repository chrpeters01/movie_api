const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movieDB', {
useNewUrlParser: true, 
useUnifiedTopology: true 
});

app.use(morgan('common'));

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!')
});


// 1. 
app.get('/movies', (req, res) => {
  res.send('Successful GET request returns list of ALL movies to the user');
});

// 2. 
app.get('/movies/:title', (req, res) => {
  res.send('Successful GET request returns data about a single movie by title to the user');
});

// 3. 
app.get('/genres/:name', (req, res) => {
  res.send('Successful GET request returns data about a genre (description by name/title');
});

// 4. 
app.get('/directors/:name', (req, res) => {
  res.send('Successful GET request returns data about a director (bio, birth year, death year) by name');
});

// 5. 
app.post('/users', (req, res) => {
  res.send('Allow new users to register');
});

// 6.
app.put('/users/:userId', (req, res) => {
  res.send('Allow users to update their user info (username, password, email, date of birth)');
});

// 7. 
app.post('/users/:userId/favorites', (req, res) => {
  res.send('Allow users to add a movie to their list of favorites');
});

// 8. 
app.delete('/users/:userId/favorites/:movieId', (req, res) => {
  res.send('Allow users to remove a movie from their list of favorites');
});

// 9. 
app.delete('/users/:userId', (req, res) => {
  res.send('Allow existing users to deregister')
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('This app is listening on port 8080.');
});