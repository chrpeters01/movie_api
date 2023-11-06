const express = require('express');
morgan = require('morgan');
fs = require('fs');
path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a'
})

let topMovies = [
  {
    title: 'Saving Private Ryan',
    Director: 'Steven Spielberg'
  },
  {
    title: 'Good Will Hunting',
    Director: 'Gus Van Sant'
  },
  {
    title: 'The Departed',
    Director: 'Martin Scorsese'
  },

]

app.use(morgan('combined', {
  stream: accessLogStream
}));

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!')
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('This app is listening on port 8080.');
});