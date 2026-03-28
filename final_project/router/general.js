const express = require('express');
const public_users = express.Router();
const axios = require('axios');

let books = require("./booksdb.js");

let users = [];

const isValid = (str) => {
  return typeof str === "string" && str.trim().length > 0;
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found for this author" });
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found for this title" });
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Task 6: Register new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!isValid(username) || !isValid(password)) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

/*
  Tasks 10-13
  These are the async/await versions using Axios.
  They are added as separate endpoints so your original routes still work.
*/

// Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book by ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});

// Task 12: Get books by author using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13: Get books by title using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

module.exports.general = public_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
module.exports.books = books;
