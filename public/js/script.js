function getAPI() {
  const apiKey = 'AIzaSyBK-aCp0XCvqFwZRs5alePb5udp3HQ1RE4';
  const genres = ['classics', 'science fiction', 'popular fiction', 'biography'];
  const bookPromises = [];

  for (const genre of genres) {
    const bookApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${genre}&maxResults=10&key=${apiKey}`;
    const bookPromise = fetch(bookApiUrl)
      .then(response => response.json())
      .then(result => {
        const books = result.items.map(item => {
          return {
            title: item.volumeInfo.title,
            cover: item.volumeInfo.imageLinks?.thumbnail || 'No cover available',
            id: item.id
          };
        });

        // Append book covers to the webpage
        const container = document.createElement('div');
        container.className = 'container is-fluid';

        books.forEach(book => {
          const bookCover = document.createElement('img');
          bookCover.src = book.cover;
          bookCover.alt = 'Book Cover';
          bookCover.dataset.bookId = book.id; // Set the book ID as a data attribute

          container.appendChild(bookCover);
        });

        document.body.appendChild(container);
      })
      .catch(error => {
        console.error(`Error fetching books of ${genre}:`, error);
      });

    bookPromises.push(bookPromise);
  }

  document.addEventListener('click', event => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'IMG') {
      const bookId = clickedElement.dataset.bookId;
      if (bookId) {
        // Redirect to the book details page
        window.location.href = `/books/${bookId}`;
      }
    }
  });

  Promise.all(bookPromises)
    .then(() => {
      console.log('All books fetched successfully!');
    })
    .catch(error => {
      console.error('Error fetching books:', error);
    });
}

getAPI();
