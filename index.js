const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  { check, validationResult } = require('express-validator'),
  Models = require('./models.js');
const app = express();
const Movies = Models.Movie;
const Users = Models.User;

// Test server
//mongoose.connect('mongodb://localhost:27017/movieSeek', { useNewUrlParser: true, useUnifiedTopology: true });
// Live server
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add cors to app
const cors = require('cors');
let  allowedOrigins = ['http://localhost:8080', 'http://localhost:4200', 'http://localhost:1234', 'https://movie-seek.netlify.app'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

// Import auth and passport
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Movie Requests

// Gets the list of data about ALL movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => res.status(200).json(movies))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

// Gets the data of a single movie, by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.params.title);
  Movies.find({ 'Title': req.params.title })
    .then((movies) => res.status(200).json(movies))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

// Gets the information about a genre
app.get('/movies/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.name })
    .then((movie) => res.status(200).json(movie.Genre))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Gets the data of a single director, by name
app.get('/movies/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.name })
    .then((movie) => res.status(200).json(movie.Director))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// User Requests

// Request user data
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Request specific user's data
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ 'Username': req.params.username })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add data for new user to our list of users
app.post('/users',
  // Validation logic here for requests
  [
    check('Username', 'Username is required',).isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    //Chech the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => res.status(201).json(user))
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Update data for specified user
app.put('/users/:username', passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username is required',).isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) => {
    //Chech the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate({ 'Username': req.params.username }, {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.status(200).json(updatedUser);
        }
      });
  });

// Add movie to user's "Favorites" list by movie ObjectId
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Users.findOneAndUpdate({ 'Username': req.params.username }, {
    $push: { FavoriteMovies: req.params.movieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.status(201).json(updatedUser);
    }
  });
});

// Delete movie from user's "Favorites" list by movie ObjectId
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ 'Username': req.params.username }, {
    $pull: { FavoriteMovies: req.params.movieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.status(200).json(updatedUser);
    }
  });
});

// Delete user from registry
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ 'Username': req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use(express.static('public'));

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
