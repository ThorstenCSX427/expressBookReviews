const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
  try {
    // Simulating an async operation with Promise
    const getBooks = new Promise((resolve) => {
      resolve(books);
    });
    
    const result = await getBooks;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    
    // Simulating an async operation with Promise
    const getBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
    
    const result = await getBook;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(404).json({message: error});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  try {
    const author = req.params.author;
    
    // Simulating an async operation with Promise
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author");
      }
    });
    
    const result = await getBooksByAuthor;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(404).json({message: error});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
