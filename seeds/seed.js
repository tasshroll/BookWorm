const sequelize = require('../config/connection');
const { User, Project } = require('../models');

const userData = require('./userData.json');
const bookUserData = require('./bookUserData.json');
const bookData = require('./bookData.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const books = await User.bulkCreate(bookData, {
    returning: true,
  });

  const bookUser = await User.bulkCreate(bookUserData, {
    returning: true,
  });


  process.exit(0);
};

seedDatabase();
