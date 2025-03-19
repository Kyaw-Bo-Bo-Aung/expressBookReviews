const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const SECRET_KEY = "my_jwt_secret_key"; // just for practice

let users = [];

const isValid = (username) => {
  //returns boolean
  return !!users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  if (!isValid(username)) return false;

  return !!users.find((user) => user.password === password);
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  return res.status(200).json({ message: "Login successful!", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const book = books[isbn];
  if (!book) {
    return res.status(400).json({ error: "No book found" });
  }
  if (!review) {
    return res.status(400).json({ error: "Review field is requried." });
  }

  const loggedInuser = req.session.user.username;

  book.reviews["review"] = {
    description: review,
    by: loggedInuser,
  };
  books[isbn] = book;

  return res.status(200).json({ message: "Book review updated." });
});

const deleteReview = (bookIndex, reviewer) => {
  if (books[bookIndex] && books[bookIndex].reviews.review) {
    if (books[bookIndex].reviews.review.by === reviewer) {
      delete books[bookIndex].reviews.review; // Delete the review if conditions match
    }
  }
};

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(400).json({ error: "No book found" });
  }
  const loggedInuser = req.session.user.username;

  deleteReview(isbn, loggedInuser);

  return res.status(200).json({ message: "Book review deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.SECRET_KEY = SECRET_KEY;
