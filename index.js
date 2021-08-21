const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  Models = require('./models.js');
const app = express();
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movieSeek', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Movie Requests

// Gets the list of data about ALL movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => res.status(200).json(movies))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

// Gets the data of a single movie, by title
app.get('/movies/:title', (req, res) => {
  console.log(req.params.title);
  Movies.find({ 'Title': req.params.title })
    .then((movies) => res.status(200).json(movies))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

// Gets the list of data about ALL movies in a genre, by genre name
app.get('/movies/genres/:name', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.name })
    .then((movie) => res.status(200).json(movie.Genre))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Gets the data of a single director, by name
app.get('/movies/directors/:name', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.name })
    .then((movie) => res.status(200).json(movie.Director))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// User Requests

// Request user data
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Request specific user's data
app.get('/users/:username', (req, res) => {
  Users.findOne({ 'Username': req.params.username })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add data for new user to our list of users
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
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

app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate({ 'Username': req.params.username }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
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

app.post('/users/:username/movies/:movieID', (req, res) => {
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

app.delete('/users/:username/movies/:movieID', (req, res) => {
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

app.delete('/users/:username', (req, res) => {
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
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
