// --------------------- ADD book to Favorites ----------------------//
async function addBook() {
  const book_title = document.querySelector('.book-title').textContent.trim();
  const author_name = document.querySelector('.author').textContent.trim().replace('Author: ', '');
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
      console.log("successful add to DB");
      // redirect to users profile to display all favs
      document.location.replace('/profile');

    } else {
      console.log(response.status);
      alert('Failed to add book');
    }
  }
};


// Event handler for 'Add to Favorite' click in book.handlebars
function handleButtonClick(event) {
  if (event.target.classList.contains('add-book')) {
    addBook();
  }
}


// Event listener on book.handlebar
// to parent element that contains the 'add favorite' button
document
  .querySelector('.book-description')
  .addEventListener('click', handleButtonClick);