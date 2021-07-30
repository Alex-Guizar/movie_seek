const express = require('express'),
  morgan = require('morgan');
const app = express();

let topMovies = [
  {
    title: 'The Departed',
    director: 'Martin Scorsese'
  },
  {
    title: 'Inglourious Basterds',
    director: 'Quentin Tarantino'
  },
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont'
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan'
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino'
  },
  {
    title: 'Fight Club',
    director: 'David Fincher'
  },
  {
    title: 'Spirited Away',
    director: 'Hayao Miyazaki'
  },
  {
    title: 'Gladiator',
    director: 'Ridley Scott'
  },
  {
    title: 'Superbad',
    director: 'Greg Mottola'
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan'
  }
];

app.use(morgan('common'));

// Movie Requests

// Gets the list of data about ALL movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Gets the data of a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find((movie) => student.title === req.params.title));
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

// Add data for new user to our list of users
app.post('/users', (req, res) => {
  res.send('User will be added to list here.');
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
