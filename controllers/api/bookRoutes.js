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
