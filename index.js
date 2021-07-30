const express = require('express'),
  morgan = require('morgan');
const app = express();

let movies = [
  {
    title: 'The Departed',
    director: 'Martin Scorsese',
    genre: 'crime',
    description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.',
    imageURL: ''
  },
  {
    title: 'Inglourious Basterds',
    director: 'Quentin Tarantino',
    genre: 'adventure',
    description: 'In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner\'s vengeful plans for the same.',
    imageURL: ''
  },
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    genre: 'drama',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    imageURL: ''
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    genre: 'action',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    imageURL: ''
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    genre: 'crime',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    imageURL: ''
  },
  {
    title: 'Fight Club',
    director: 'David Fincher',
    genre: 'drama',
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    imageURL: ''
  },
  {
    title: 'Spirited Away',
    director: 'Hayao Miyazaki',
    genre: 'animation',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    imageURL: ''
  },
  {
    title: 'Gladiator',
    director: 'Ridley Scott',
    genre: 'action',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    imageURL: ''
  },
  {
    title: 'Superbad',
    director: 'Greg Mottola',
    genre: 'comedy',
    description: 'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.',
    imageURL: ''
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'action',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    imageURL: ''
  }
];

app.use(morgan('common'));

// Movie Requests

// Gets the list of data about ALL movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Gets the data of a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => student.title === req.params.title));
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
