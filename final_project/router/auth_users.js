const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" },
    // Add more sample users as needed
];

const isValid = (user) => {
    // Write code to check if the username is valid
    // For example, check if the username exists in the users array
    return users.some(u => u.username === user.username);
}
  
const authenticatedUser = (username, password) => {
// Write code to check if username and password match the one we have in records
// For simplicity, assuming a plain comparison of username and password
return users.some(user => user.username === username && user.password === password);
}

// Endpoint for user login
regd_users.post("/login", (req, res) => {
const { username, password } = req.body;

// Check if username and password are provided
if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
}

// Check if the username exists
if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username." });
}

// Check if the username and password match
if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password." });
}

// If username and password are correct, generate JWT token
const token = jwt.sign({ username }, 'secret_key');

// Send the token in the response
res.status(200).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Authorization token not provided." });
    }
    
    // Extract username from JWT token
    const decodedToken = jwt.decode(token.split(" ")[1]);
    const username = decodedToken.username;
    
    // Check if the user exists
    if (!isValid(username)) {
      return res.status(401).json({ message: "Invalid user." });
    }
  
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    // Check if the ISBN is valid
    if (!books.some(book => book.isbn === isbn)) {
      return res.status(404).json({ message: "Invalid ISBN." });
    }
  
    // Check if the user has already posted a review for the given ISBN
    const existingReviewIndex = books.findIndex(book => book.isbn === isbn && book.username === username);
    if (existingReviewIndex !== -1) {
      // Update existing review
      books[existingReviewIndex].review = review;
      return res.status(200).json({ message: "Review updated successfully." });
    } else {
      // Add new review
      books.push({ isbn, username, review });
      return res.status(201).json({ message: "Review added successfully." });
    }
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Authorization token not provided." });
    }

    // Extract username from JWT token
    const decodedToken = jwt.decode(token.split(" ")[1]);
    const username = decodedToken.username;

    // Check if the user exists
    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid user." });
    }

    const isbn = req.params.isbn;

    // Check if the ISBN is valid
    if (!books.some(book => book.isbn === isbn)) {
        return res.status(404).json({ message: "Invalid ISBN." });
    }

    // Find the index of the review for the given ISBN and username
    const reviewIndex = books.findIndex(book => book.isbn === isbn && book.username === username);

    if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found." });
    }

    // Delete the review
    books.splice(reviewIndex, 1);
    return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
