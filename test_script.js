const sequelize = require("./config/connection");

const { User, Book, BookUser } = require("./models");

const init = async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({
    name: "John Doe",
    email: "tt@bb.com",
    password: "ThisisPassword!",
  });
  const book = await Book.create({
    book_title: "The Great Gatsby",
    author_name: "F. Scott Fitzgerald",
  });

  await user.addBook(book);

  const books = await User.findAll({
    include: [
      {
        model: Book,
        through: BookUser,
      },
    ],
  });

  console.log(
    JSON.stringify(
      books.map((book) => book.toJSON()),
      null,
      2
    )
  );
  process.exit(0);
};

init();