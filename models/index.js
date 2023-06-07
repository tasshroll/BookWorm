const User = require('./User');
const Book = require('./Book');
const BookUser = require('./BookUser');
const Comment = require('./Comment');


Comment.belongsTo(User, {
  foreignKey: 'user_id'
  })

  User.hasMany(Comment, {
    foreignKey: 'user_id'
  })

Comment.belongsTo(Book, {
 foreignKey: 'book_id',
});


Book.hasMany(Comment, {
 foreignKey: 'book_id'
})

// Book belongToMany Users (through BookUser)
Book.belongsToMany(User, {
  // third table needed
    // foreignKey: 'user_id',
    through: BookUser
});

// User belongToMany Book (through BookUser)
User.belongsToMany(Book, {
  // third table needed
    // foreignKey: 'book_id',
    through: BookUser
});


module.exports = { User, Book, Comment, BookUser};
