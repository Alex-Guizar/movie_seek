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
  res.json(movies);
});

// Gets the data of a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => movie.title === req.params.title));
});

// Gets the list of data about ALL movies in a genre, by genre name
app.get('/movies/genres/:title', (req, res) => {
  res.send('This is a list of movies in a genre.');
});

// Gets the data of a single director, by name
app.get('/movies/directors/:name', (req, res) => {
  res.send('This is a JSON object with the director\'s info');
})

// User Requests

// Request user data
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => res.status(201).json(users))
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
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

app.put('/users/:name', (req, res) => {
  res.send('User\'s data will be updated here.');
});

app.put('/users/:name/list/:title', (req, res) => {
  res.send('Movie title will be added to the user\'s list here.');
});

app.delete('/users/:name/list/:title', (req, res) => {
  res.send('Movie title will be removed from the user\'s list here.');
});

app.delete('/users/:name', (req, res) => {
  res.send('User\'s account will be removed here.');
});

app.use(express.static('public'));

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
