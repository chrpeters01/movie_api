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



// 1. Return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// 2. Return data about a single movie by title to the user
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.Title})
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// 3. Return data about a genre (description) by name/title
app.get('/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({'Genre.Name':req.params.genreName})
    .then((movie) => {
      res.status(200).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// 4. Return data about a director (bio, birth year, death year) by name
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({'Director.Name':req.params.directorName})
    .then((movie) => {
      res.status(200).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// 5. Allow new users to register
app.post('/users', [
  check('Username', 'Username is required').isLength({min:5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user)})
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

// 6. Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:userId', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    
    if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied.');
    }

    let data = {
      Username: req.body.Username,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
    if (req.body.Password){
      let hashedPassword = Users.hashPassword(req.body.Password);
      data['Password']= hashedPassword;
    }

    Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $set: data},
    { new: true }) 
    .then(updatedUser => {
        res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// 7. Allow users to add a movie to their list of favorites
app.post('/users/:userId/favorites', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID } },
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

// 8. Allow users to remove a movie from their list of favorites
app.delete('/users/:userId/favorites/:movieId<', passport.authenticate('jwt', { session: false }), (req, res) => {
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

// 9. Allow existing users to deregister
app.delete('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('This app is listening on port 8080.');
});