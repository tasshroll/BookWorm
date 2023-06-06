
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

// Add event listener on profile.handlebar
// to a parent element that contains the delete a favorite button
document.querySelector('.remove-favorites').addEventListener('click', handleButtonClick);

