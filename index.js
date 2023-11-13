const express = require('express');
const morgan = require('morgan');
const app = express();

let topMovies = [{
    title: 'Saving Private Ryan',
    director: 'Steven Spielberg'
  },
  {
    title: 'Good Will Hunting',
    director: 'Gus Van Sant'
  },
  {
    title: 'The Departed',
    director: 'Martin Scorsese'
  },

]


app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!')
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('This app is listening on port 8080.');
});