const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();
const axios = require('axios');

public_users.post('/register', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({'username':username,'password':password});
      return res.status(200).json({message: 'User successfully registered. Now you can login'});
    } else {
      return res.status(404).json({message: 'User already exists!'});
    }
  }
  return res.status(404).json({message: 'Unable to register user. Please provide username and password.'});
});

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (err) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get('http://localhost:5000/isbn/' + isbn);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(200).json(books[req.params.isbn]);
  }
});

// Task 12: Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get('http://localhost:5000/author/' + author);
    return res.status(200).json(response.data);
  } catch (err) {
    const author = req.params.author;
    let booksByAuthor = [];
    for (let key in books) {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    }
    return res.status(200).json({booksByAuthor: booksByAuthor});
  }
});

// Task 13: Get all books based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get('http://localhost:5000/title/' + title);
    return res.status(200).json(response.data);
  } catch (err) {
    const title = req.params.title;
    let booksByTitle = [];
    for (let key in books) {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    }
    return res.status(200).json({booksbytitle: booksByTitle});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
