const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 1: Get the list of all books
public_users.get('/', async function (req, res) {
  try {
    const booksResponse = await axios.get('https://mohammedmoh4-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
    res.json(booksResponse.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books from the server" });
  }
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      // Using Axios to fetch book details from an external API
      const response = await axios.get(`http://your-book-api-url/books/${isbn}`);
      const book = response.data;
      
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch book details" });
    }
  });

// Task 3: Get books based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    try {
      // Using Axios to fetch book details from an external API
      const response = await axios.get(`http://your-book-api-url/books?author=${author}`);
      const authorBooks = response.data;
  
      if (authorBooks.length > 0) {
        res.json(authorBooks);
      } else {
        res.status(404).json({ message: "Books by this author not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch books by author" });
    }
  });

// Task 4: Get books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
      const response = await axios.get(`http://your-book-api-url/books?title=${title}`);
      const titleBooks = response.data;
  
      if (titleBooks.length > 0) {
        res.json(titleBooks);
      } else {
        res.status(404).json({ message: "Books with this title not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch books by title" });
    }
  });
  

// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`http://your-book-api-url/books/${isbn}/reviews`);
      const reviews = response.data;
  
      if (reviews && reviews.length > 0) {
        res.json(reviews);
      } else {
        res.status(404).json({ message: "No reviews found for this book" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch book reviews" });
    }
  });
  

// Task 6: Register a new user
public_users.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
  
      if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      users[username] = password;
      return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  

module.exports.general = public_users;
