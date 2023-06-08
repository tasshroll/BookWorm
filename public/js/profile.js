
// Delete a book given its ID
async function deleteBook(bookId) {
  const response = await fetch(`/api/books/${bookId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    document.location.replace('/profile');
  } else {
    alert('Failed to delete book');
  }
};


// Event handler for profile.handlebars
function handleButtonClick(event) {
  console.log("button clicked");

  const targetElement = event.target;

  // Find the closest parent element with the deleteBook class
  const deleteButton = targetElement.closest('.deleteBook');

  // Call deleteBook if the clicked element or its parent has the class 'deleteBook'
  if (deleteButton) {
    const bookId = deleteButton.getAttribute('data-id');
    deleteBook(bookId);
  }
}

const handleCommentClick = async (event, bookId) => {
// THIS WAS WORKING
//const handleCommentClick = async (event) => {
  event.preventDefault();
  console.log("Inside Comment Click")
  console.log("Book ID is ", bookId);
  const date_created = Date.now();
  
  
  const comment = document.querySelector('#comment-content').value.trim();
  console.log('comment content is', comment);
  

  if (comment) {
    // POST the new COMMENT
    const response = await fetch(`/api/books/comment/${bookId}`, {
      method: 'POST',
      body: JSON.stringify({ comment, date_created }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      // list all the comments
      location.reload();
    } else {
      console.log(response.status);
      alert('Failed to add comment');
    }
  }
};


// Add event listener on profile.handlebar
// to a parent element that contains the delete a favorite button
document
  .querySelector('.remove-favorites')
  .addEventListener('click', handleButtonClick);

// Add event listener to signal a comment has been made
// THIS CODE WAS DETECTING THE SUBMIT COMMENT OK and the RIGHT BOOK ID

// document.addEventListener('click', (event) => {
//   const submitCommentButton = event.target.closest('.submit-comment');
//   if (submitCommentButton) {
//     const bookContainer = submitCommentButton.closest('[data-book-id]');
//     const bookId = bookContainer.getAttribute('data-book-id');
//     handleCommentClick(event, bookId);
//   }
// });


// GETS THE BOOK ID - WORKS
// document.addEventListener('click', (event) => {
//   const submitCommentButton = event.target.closest('.submit-comment');
//   if (submitCommentButton) {
//     const commentBox = submitCommentButton.parentElement.querySelector('.comment-box');
//     const bookId = commentBox.getAttribute('data-id');
//     handleCommentClick(event, bookId);
//   }
// });


document.addEventListener('click', (event) => {
  const submitCommentButton = event.target.closest('.submit-comment');
  if (submitCommentButton) {
    const commentBox = submitCommentButton.closest('.create-comment').querySelector('.comment-box');
    const bookId = commentBox.getAttribute('data-id');
    handleCommentClick(event, bookId);
  }
});



// Add event listener to signal a comment has been made
// document.addEventListener('click', (event) => {
//   const submitCommentButton = event.target.closest('.submit-comment');
//   if (submitCommentButton) {
//     const commentBox = submitCommentButton.closest('.create-comment').querySelector('.comment-box');
//     const bookId = commentBox.getAttribute('data-id');
//     handleCommentClick(event, bookId);
//   }
//});

