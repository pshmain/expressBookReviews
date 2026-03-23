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
      users.push({"username":username,"password":password});
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
    const response = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.status(200).send(JSON.stringify(response, null, 4));
  } catch (err) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error('ISBN not found'));
      }
    });
    return res.status(200).json(response);
  } catch (err) {
    return res.status(404).json({message: 'ISBN not found'});
  }
});

// Task 12: Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(b => b.author === author);
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error('Author not found'));
      }
    });
    return res.status(200).json(response);
  } catch (err) {
    return res.status(404).json({message: 'Author not found'});
  }
});

// Task 13: Get all books based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(b => b.title === title);
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error('Title not found'));
      }
    });
    return res.status(200).json(response);
  } catch (err) {
    return res.status(404).json({message: 'Title not found'});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
});

module.exports.general = public_users;
