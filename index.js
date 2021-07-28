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

// GET request
app.get('/', (req, res) => {
  res.send('Welcome to Movie Seek!');
});

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
