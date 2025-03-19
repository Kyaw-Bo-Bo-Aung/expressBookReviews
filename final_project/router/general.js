const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username or Password is not provided." });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  users.push({
    username,
    password,
  });

  return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    }, 5000);
  })
  const bookres = await bookPromise;
  return res.status(200).json(bookres);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  const bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn])
    }, 5000);
  })
  const book = await bookPromise;
  return res.status(200).json({ book });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  const bookPromise = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.author === author
    );
    setTimeout(() => {
      resolve(filteredBooks)
    }, 5000);
  })
  const bookres = await bookPromise;
  return res.status(200).json(bookres);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const bookPromise = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.title === title
    );
    setTimeout(() => {
      resolve(filteredBooks)
    }, 5000);
  })
  const bookres = await bookPromise;
  return res.status(200).json(bookres);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.status(200).json({ data: book.reviews });
});

module.exports.general = public_users;
