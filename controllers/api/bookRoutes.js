const router = require('express').Router();
const axios = require('axios');
const { User, Book, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Fetch all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Fetch a specific book by ID
router.get('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const apiKey = 'AIzaSyBK-aCp0XCvqFwZRs5alePb5udp3HQ1RE4';
    const bookApiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

    const response = await axios.get(bookApiUrl);
    if (response.status === 200) {
      const result = response.data;
      const book = {
        title: result.volumeInfo.title,
        author: result.volumeInfo.authors,
        description: result.volumeInfo.description || 'No description available',
        cover: result.volumeInfo.imageLinks?.thumbnail || 'No cover available'
      };
      res.status(200).json(book);
    } else {
      throw new Error('Failed to fetch book details from Google Books API');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch the description of a specific book by ID
router.get('books/:id/description', async (req, res) => {
  try {
    const bookId = req.params.id;
    const apiKey = 'AIzaSyBK-aCp0XCvqFwZRs5alePb5udp3HQ1RE4';
    const bookApiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

    const response = await axios.get(bookApiUrl);
    if (response.status === 200) {
      const result = response.data;
      const book = {
        description: result.volumeInfo.description || 'No description available',
      };
      res.status(200).json(book);
    } else {
      throw new Error('Failed to fetch book details from Google Books API');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// // Unfavorite a certain book for a user
// router.delete('/:id/favorite', withAuth, async (req, res) => {
//   try {
//     const book = await Book.findByPk(req.params.id);
//     if (!book) {
//       res.status(404).json({ message: 'Book not found' });
//       return;
//     }
//     await book.removeUser(req.session.user_id);
//     res.status(200).json({ message: 'Book unfavorited successfully' });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
