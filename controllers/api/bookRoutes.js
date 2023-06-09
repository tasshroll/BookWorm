const router = require('express').Router();
const { User, Comment, Book, BookUser } = require('../../models');
const withAuth = require('../../utils/auth');
const axios = require('axios');

// Add book title to book list as a favorite for this user
// route : POST api/books/
// in profile.js, addBook
router.post('/', withAuth, async (req, res) => {

  try {
    // get id of current user
    user_id = req.session.user_id;

    const newBook = await Book.create({
      ...req.body,
    });

    // Get user data from User table
    const user = await User.findByPk(user_id);

    // Connects the user to the selected book in the BookUser model
    // user.addBook method is provided by sequelize with a Many to many association 
    await user.addBook(newBook);

    res.status(200).json(newBook);
  } catch (err) {
    console.log("Error adding book to FAV:", err);
    res.status(400).json(err);
  }
});


// Create a  NEW COMMENT on a book -- route not used
// route : POST api/book/comment/:id
// in comment.js, newCommentHandler
router.post('/comment/:id', withAuth, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.session.user_id;
    console.log(req.body);

    // Check if the book already exists in the user's list
    const existingBook = await BookUser.findOne({
      where: {
        book_id: bookId,
        user_id: userId,
      },
    });

    if (existingBook) {
      console.log("Creating COMMENT");

      // Add the comment for this book
      await Comment.create({
        ...req.body,
        user_id: userId,
        book_id: bookId
      });

      res.status(200).json({ message: 'Comment added successfully' });
    }
  } catch (error) {
    console.error('Error bookmarking book:', error);
    res.status(500).json({ message: 'Failed to bookmark the book' });
  }
});


// Get COMMENTs on a book by ID -- route not used
// route : GET api/book/comment/:id
// in book.js
router.get('/comment/:id', withAuth, async (req, res) => {
  try {
    console.log("Getting Comments for Book");
    const bookId = req.params.id;
    const userId = req.session.user_id;

    // Get comments for the book if they exist
    const existingComment = await Comment.findAll({
      where: {
        book_id: bookId,
        //user_id: userId,
      },
    });
    console.log("existingComment is", existingComment);

    if (existingComment) {
      // Serialize data so the template can read it
      const comments = existingComment.map((el) => el.get({ plain: true }));
      console.log(comments);

      // Pass data amd session flag to book template
      res.render('book', {
        comments,
        logged_in: req.session.logged_in
      });
    }
  } catch (err) {
    console.log("Error getting comments for book");
    res.status(500).json(err);
  }
});

// Get COMMENTs on a book by TITLE regardless of user -- route not used
// route : GET api/book/comment/:id
// in book.js
router.get('/comment-title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const userId = req.session.user_id;
    console.log("Title to search is ", title);

    // Find the comments in the Comment model but includde the Book model
    // to search on the passed in book_title from URL
    const existingComments = await Comment.findAll({
      include: [
        {
          model: Book,
          where: {
            book_title: title,
          }
        }
      ]
    });

    // Serialize data so the template can read it
    const comments = existingComments.map((el) => el.get({ plain: true }));
    console.log("Comments Objs is", comments);

    // Pass data and session flag to book template
    res.render('book', {
      comments,
      logged_in: true
    });

  } catch (err) {
    console.log("Error getting comments for book", err);
    res.status(500).json(err);
  }
});



// Fetch a specific book by ID
router.get('/:id', withAuth, async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log("Book ID IS ", bookId);

    const apiKey = process.env.API_KEY;
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
      console.log ("Cover is ", book.cover);
      // Check for comments on this book in DB
      // if book_title exists in DB for given title
      const dbBook = await Book.findOne({
        where: {
          book_title: result.volumeInfo.title
        }
      });

      let comments = "";

      if (dbBook) {
        // pull comments for the book
        const bookComments = await Comment.findAll({
          where: {
            book_id: dbBook.id
          }
        });
        if (bookComments) {
          // Serialize data so the template can read it
          const com = bookComments.map((el) => el.get({ plain: true }));
          console.log("Comments Objs is", bookComments);
          // make available outside this scope
          comments = com;
        }
      }

      // pass the book title, description and comments (if any) to template
      res.render('book', {
        book,
        comments
      });
    } else {
      throw new Error('Failed to fetch book details from Google Books API');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch the description of a specific book by ID -- route not used
router.get('/:id/description', withAuth, async (req, res) => {
  try {
    const bookId = req.params.id;
    const apiKey = process.env.API_KEY;
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