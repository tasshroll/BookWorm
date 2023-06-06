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
        // list all the users favorite books including this new one at the bottom
        document.location.replace('/profile');
      } else {
        console.log(response.status);
        alert('Failed to add favorite book');
      }
    }
  };
  
  
  
  // Event handler for all the click events
  // in book.handlebars
  function handleButtonClick(event) {
    console.log("button clicked");
  
    // call addBook if the clicked element has the class 'add-book'
    if (event.target.classList.contains('add-book')) {
      console.log("Calling addBook");
      addBook();
    }
  }
  

  // Add event listener on book.handlebar
  // to a parent element that contains the add favorite buttons
  document.querySelector('.book-description').addEventListener('click', handleButtonClick);
  
