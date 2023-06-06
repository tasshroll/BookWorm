async function addBook() {
  const book_title = document.querySelector('.book-title').textContent.trim();
  const author_name = document.querySelector('.author').textContent.trim();
  console.log("Title is ", book_title);
  console.log("Author is", author_name);

  // Add book to user favorites
  if (book_title && author_name) {
    console.log("Adding book to favorites!");
    const response = await fetch(`/api/books`, {
      method: 'POST',
      body: JSON.stringify({ book_title, author_name }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // list all the users favorite books including this new one at the bottom
      document.location.replace('/');
    } else {
      console.log(response.status);
      alert('Failed to add favorite book');
    }
  }
};


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
}


// Event handler for all the click events
// in profile.handlebars
function handleButtonClick(event) {
  console.log("button clicked");
  // call deleteBook if the clicked element has the class 'deleteBook'
  if (event.target.classList.contains('deleteBook')) {
    const bookId = event.target.getAttribute('data-id');
    deleteBook(bookId);
  }

  // call addBook if the clicked element has the class 'update-blog'
  if (event.target.classList.contains('add-book')) {
    console.log("Calling addBook");
    addBook();
  }
}

// Add event listener to a parent element that contains the edit & delete buttons
document.querySelector('.book-description').addEventListener('click', handleButtonClick);

