const User = require('./User');
const Book = require('./Book');
const BookUser = require('./BookUser');
const Comment = require('./Comment');


User.hasMany(Book, {
  foreignKey: 'book.id'
  //onDelete: 'CASCADE'
});

Book.belongsTo(User, {
  foreignKey: 'user.id'
});

Comment.belongsTo(Book, {
 foreignKey: 'book_id',
 onDelete: 'CASCADE'
});

// Book belongToMany Users (through BookUser)
Book.belongsToMany(User, {
  // third table needed
    foreignKey: 'user_id',
    through: BookUser
});

// User belongToMany Book (through BookUser)
User.belongsToMany(Book, {
  // third table needed
    foreignKey: 'book_id',
    through: BookUser
});


module.exports = { User, Book, Comment, BookUser};
