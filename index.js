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

// 1. Returns list of ALL movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// 2. Returns list of ALL users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// 3. Returns data about single movie by title
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title
    })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// 4. Returns data about a genre (description by name/title)
app.get('/movies/genres/:genreName', (req, res) => {
  Movies.findOne({'Genre.Name': req.params.genreName})
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// 5. Returns data about a director (bio, birth year, death year)
app.get('/movies/directors/:directorName', (req, res) => {
  Movies.findOne({'Director.Name': req.params.directorName})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error " + err);
    });
});

// 6. Register new user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate
          })
          .then((user) => {
            res.status(201).json(user); 
          })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// 7. Update user info
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    {Username: req.params.Username}, 
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthdate: req.body.Birthdate,
      }
    }, 
    {new: true})
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });


  // 8. Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $push: {
        FavoriteMovies: req.params.MovieID
      }
    }, {
      new: true
    })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// 9. Remove movie from favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
  

// 10. Allow user to deregister
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({
      Username: req.params.Username
    })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + "was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error " + err);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('This app is listening on port 8080.');
});
