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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  for (let key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }
  return res.status(200).json({booksByAuthor: booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  for (let key in books) {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  }
  return res.status(200).json({booksbytitle: booksByTitle});
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

// Task 10: Get all books using async-await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

// Task 11: Get book by ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get('http://localhost:5000/isbn/' + isbn);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

// Task 12: Get book by Author using async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get('http://localhost:5000/author/' + author);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

// Task 13: Get book by Title using async-await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get('http://localhost:5000/title/' + title);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

module.exports.general = public_users;
