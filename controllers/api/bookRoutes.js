const router = require('express').Router();
const { User, Comment, Book, BookUser} = require('../../models');
const withAuth = require('../../utils/auth');

// Add book title to user book list (favorite)
// route : POST api/book/
// in profile.js, addBookHandler
// ADD WITHAUTH AFTER FRONT END WORKING
// router.post('/', withAuth, async (req, res) => {
//   try {
//     console.log("req.body is ", req.body);
//     const newBook = await Book.create({
//       ...req.body,
//       user_id: req.session.user_id,
//      include: [
//     { model: User, through: BookUser }]
//     });
//     console.log(res.newBook);

//     res.status(200).json(newBook);
//   } catch (err) {
//     console.log("Error adding book to FAV")
//     res.status(400).json(err);
//   }
// });


router.post('/', withAuth, async (req, res) => {
  try {
    console.log("req.body is ", req.body);
    const newBook = await Book.create({
      ...req.body,
      user_id: req.session.user_id,
    }, {
      include: [{ model: User, through: BookUser }]
    });
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
router.post('/comment/:id', async (req, res) => {
  const user_id = req.session.user_id;
  const book_id = req.params.id;

  console.log ("book_id is ", book_id);
  console.log(`Inside bookRoutes POST to api/book/comment/:id }) where id = `, book_id);
  try {
    console.log(req.body);
    const commentData = await Comment.create({
      ...req.body,
      user_id,
      book_id
    });

    console.log(commentData);
    res.status(200).json(commentData);

  } catch (err) {
    console.log("Error posting comment");
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
// DELETE a user book from their favorites list
// route : DELETE api/book/:id
// in profile.js, delBookHandler
router.delete('/:id', async (req, res) => {
  try {
    console.log("Delete book from user Book list")
    console.log(req.body);
    const bookData = await Book.destroy({
      where: {
        id: req.params.id
        // ADD THIS CODE BACK IN
        //user_id: req.session.user_id,
      },
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
