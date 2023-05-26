const router = require('express').Router();
const { Project } = require('../../models');
const withAuth = require('../../utils/auth');

// favorite a certain book for a user
router.put('/', withAuth, async (req, res) => {
  try {
    const newBook = await Book.update({
      ...req.body,
      user_id: req.session.user_id,
    });
    console.log(res.newBook);

    res.status(200).json(newBook);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const projectData = await Book.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!bookData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
