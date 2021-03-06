const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  { check, validationResult } = require('express-validator'),
  Models = require('./models.js');

/**
 * Express router providing user related routes
 * @module routers/users
 * @requires express
 */
/**
 * express module
 * @const
 */
const app = express();
const Movies = Models.Movie;
const Users = Models.User;

/**
 * Testing Code
 */

// Test server
//mongoose.connect('mongodb://localhost:27017/movieSeek', { useNewUrlParser: true, useUnifiedTopology: true });
// Live server
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add cors to app
const cors = require('cors');
let  allowedOrigins = ['http://localhost:8080', 'http://localhost:4200', 'http://localhost:1234', 'https://movie-seek.netlify.app', 'https://alex-guizar.github.io'];

// Uses cors policy to detect if origin is white-listed. If not then provides an error message
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

/**
 * Route serving movie information
 * @name get/movies
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path=/movies/:title - Express path. Optional ':title' paramter attached to the path
 * @param {boolean} [validation] - Checks for passport authentication. Requires Passport
 * @param {callback} middleware - Express middleware
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => res.status(200).json(movies))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

/**
 * Route serving movie information
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Title': req.params.title })
    .then((movies) => res.status(200).json(movies))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

/**
 * Route serving genre information
 * @name get/genres
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path=/movies/genres/:name - Express path. ':name' paramter attached to the path
 * @param {boolean} [validation] - Checks for passport authentication. Requires Passport
 * @param {callback} middleware - Express middleware
 */
app.get('/movies/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.name })
    .then((movie) => res.status(200).json(movie.Genre))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Route serving director information
 * @name get/director
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path=/movies/directors/:name - Express path. ':name' paramter attached to the path
 * @param {boolean} [validation] - Checks for passport authentication. Requires Passport
 * @param {callback} middleware - Express middleware
 */
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
/**
 * Route serving user information
 * @name get/users
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path=/users/:username - Express path. Optional ':username' paramter attached to the path
 * @param {boolean} [validation] - Checks for passport authentication. Requires Passport
 * @param {callback} middleware - Express middleware
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Route serving user information
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ 'Username': req.params.username })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Route creating a new user
 * @name post/users
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path=/users - Express path
 * @param {array} validation - Checks for username, password, and email
 * @param {callback} middleware - Express middleware
 */
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

/**
 * Route updating data for a specfic user
 * @name put/users
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path=/users/:username - Express path. ':username' parameter attached to the path
 * @param {array} validation - Checks for passport authentication. Requires Passport
 * @param {callback} middleware - Express middleware
 */
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

/**
 * Route adding a movie to users favorites list
 * @name post/users/movies
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path=/users/:username/movies/:movieID - Express path. ':username' and ':movieId' parameters attached to the path
 * @param {array} validation - Checks for passport authentication. Requires Passport
 * @param {callback} middleware - Express middleware
 */
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

/**
 * Route deleting a movie to users favorites list
 * @name delete/users/movies
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path=/users/:username/movies/:movieID - Express path. ':username' and ':movieId' parameters attached to the path
 * @param {array} validation - Checks for passport authentication. Requires Passport
 * @param {callback} middleware - Express middleware
 */
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

/**
 * Route deleting user from registry
 * @name delete/users
 * @function
 * @memberof module:routers/users
 * @inner
 * @param {string} path=/users/:username - Express path. ':username' parameter attached to the path
 * @param {array} validation - Checks for passport authentication. Requires Passport
 * @param {callback} middleware - Express middleware
 */
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
