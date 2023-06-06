const router = require('express').Router();
const { User, Comment, Book, BookUser } = require('../../models');
const withAuth = require('../../utils/auth');
const axios = require('axios');

// Add book title to book list as a favorite for this user
// route : POST api/books/
// in profile.js, addBook
router.post('/', withAuth, async (req, res) => {

  try {
    console.log("req.body is ", req.body);

    // get id of current user
    user_id = req.session.user_id;

    const newBook = await Book.create({
      ...req.body,
    });

    // Get user data from User table
    const user = await User.findByPk(user_id);

    console.log("user found is ", user);

    // Connects the user to the selected book in the BookUser model
    // user.addBook method is provided by sequelize with a Many to many association 
    await user.addBook(newBook);

    console.log(newBook);

    res.status(200).json(newBook);
  } catch (err) {
    console.log("Error adding book to FAV:", err);
    res.status(400).json(err);
  }
});


// Create a  NEW COMMENT on a book
// route : POST api/book/comment/:id
// in comment.js, newCommentHandler
router.post('/:id', withAuth, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.session.user_id;

    // Check if the book already exists in the user's list
    const existingBook = await BookUser.findOne({
      where: {
        book_id: bookId,
        user_id: userId,
      },
    });

    if (existingBook) {
      return res.status(400).json({ message: 'Book already bookmarked' });
    }

    // Create a new entry in the BookUser join table
    await BookUser.create({
      book_id: bookId,
      user_id: userId,
    });

    res.status(200).json({ message: 'Book bookmarked successfully' });
  } catch (error) {
    console.error('Error bookmarking book:', error);
    res.status(500).json({ message: 'Failed to bookmark the book' });
  }
});
// Fetch a specific book by ID
router.get('/:id', withAuth, async (req, res) => {
    try {
      const bookId = req.params.id;
      const apiKey = process.env.API_KEY2;
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
        res.render('book', book);
      } else {
        throw new Error('Failed to fetch book details from Google Books API');
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Fetch the description of a specific book by ID
router.get('/:id/description', withAuth, async (req, res) => {
  try {
    const bookId = req.params.id;
    const apiKey = process.env.API_KEY3;
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
      res.render('book', book);
    } else {
      throw new Error('Failed to fetch book details from Google Books API');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Unfavorite a certain book for a user
// route : DELETE api/books/:id
// in profile.js, deleteBook
router.delete('/:id', async (req, res) => {
  try {
    console.log("Delete book from user Book list")
    
    // Delete associated comments first
    await Comment.destroy({
      where: {
        book_id: req.params.id,
      },
    });

    // Delete the book
    const bookData = await Book.destroy({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
          through: BookUser,
          where: {
            id: req.session.user_id,
          },
        },
      ],
    });

    if (!bookData) {
      res.status(404).json({ message: 'No book found with this id!' });
      return;
    }

    res.status(200).json(bookData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;