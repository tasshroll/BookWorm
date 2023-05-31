const sequelize = require('../config/connection');
const { User, Comment, Book, BookUser } = require('../models');

const userData = require('./userData.json');
const bookUserData = require('./bookUserData.json');
const bookData = require('./bookData.json');
const commentData = require('./commentData.json');



const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const books = await Book.bulkCreate(bookData, {
    returning: true,
  });

  const bookUser = await BookUser.bulkCreate(bookUserData, {
    returning: true,
  });

  const comment = await Comment.bulkCreate(commentData, {
    returning: true,
  });


  process.exit(0);
};

seedDatabase();
