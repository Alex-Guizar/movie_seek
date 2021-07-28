const express = require('express'),
  morgan = require('morgan');
const app = express();

let topBooks = [
  {
    title: 'Harry Potter and the sorcerer\'s Stone',
    author: 'J.K. Rowling'
  },
  {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien'
  },
  {
    title: 'Twilight',
    author: 'Stephanie Meyer'
  }
];

app.use(morgan('common'));

// GET request
app.get('/', (req, res) => {
  res.send('Welcome to my book club!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/books', (req, res) => {
  res.json(topBooks);
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
