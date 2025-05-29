const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory array to store books
let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: 3, title: '1984', author: 'George Orwell' }
];
let nextId = 4; // To generate unique IDs for new books

// --- API Endpoints ---

// ## GET /books
// Returns all books
app.get('/books', (req, res) => {
  res.json(books);
});

// ## POST /books
// Adds a new book from the request body
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  const newBook = { id: nextId++, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// ## PUT /books/:id
// Updates a book by ID
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!title && !author) {
    return res.status(400).json({ message: 'At least title or author must be provided for update' });
  }

  const updatedBook = { ...books[bookIndex] };
  if (title) {
    updatedBook.title = title;
  }
  if (author) {
    updatedBook.author = author;
  }

  books[bookIndex] = updatedBook;
  res.json(updatedBook);
});

// ## DELETE /books/:id
// Removes a book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const initialLength = books.length;
  books = books.filter(b => b.id !== bookId);

  if (books.length === initialLength) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.status(204).send(); // No content to send back
});

// Start the server
app.listen(port, () => {
  console.log(`Book API server listening at http://localhost:${port}`);
});