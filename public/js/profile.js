
// --------------------- Remove Book----------------------
// Remove a book from user Favorite given its ID
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

// ---------------------Handle Remove----------------------

// Event handler for profile.handlebars, "Remove From Favorites"
function handleRemoveClick(event) {
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

// ---------------------Handle Comment Input----------------------
const handleCommentClick = async (event, bookId, commentBox) => {
  event.preventDefault();
  const date_created = Date.now();
  
  const comment = commentBox.value.trim();

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
      // Show the comment-added message
      // const commentMessage = document.querySelector('#comment-message');
      const commentMessage = commentBox.closest('.create-comment').querySelector('.comment-message');

      commentMessage.textContent = 'Your comment was added!';
      commentMessage.style.color = 'green';

    } else {
      console.log(response.status);
      alert('Failed to add comment');
    }
  }
};


// ---------------------Event Listeners----------------------
// Event listener for REMOVE from Favorites button
document
  .querySelector('.remove-favorites')
  .addEventListener('click', handleRemoveClick);


// Event listener for comment SUBMIT button
document.addEventListener('click', (event) => {
  const submitCommentButton = event.target.closest('.submit-comment');
  if (submitCommentButton) {
    const commentBox = submitCommentButton.closest('.create-comment').querySelector('.comment-box');
    const bookId = commentBox.getAttribute('data-id');
    handleCommentClick(event, bookId, commentBox);
  }
});



