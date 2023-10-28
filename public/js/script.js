const maxResults = 20;
const maxResultsPerGenre = 40; // Set the number of results to fetch per genre


// Function to fetch books from the Google Books API
function getAPI(maxResultsPerGenre, startIndex) {
  const apiKey = 'AIzaSyD2spQD7RpmuMQYgW3iqPZ-avwRM05t9cs';
  //TODO: hide the API KEY
  //const apiKey = process.env.API_KEY;

  const genres = ['classics', 'science fiction', 'popular fiction', 'biography'];
  const bookPromises = [];

  for (const genre of genres) {

    const bookApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${genre}&maxResults=${maxResultsPerGenre}&startIndex=${startIndex}&filter=full&printType=books&orderBy=newest&key=${apiKey}`;

//    const bookApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${genre}&maxResults=${maxResults}&startIndex=${startIndex}&key=${apiKey}`;

    const bookPromise = fetch(bookApiUrl)
    .then(response => response.json())
    .then(result => {
      const books = result.items.filter(item => item.volumeInfo.description) // Filter out books without descriptions
        .map(item => {
          return {
            title: item.volumeInfo.title,
            cover: item.volumeInfo.imageLinks?.thumbnail || 'No cover available',
            id: item.id
          };
        });

        // Create a container for each genre
        const container = document.createElement('div');
        container.className = 'container is-fluid genre-container';

        // Create a heading for the genre
        const heading = document.createElement('h2');
        heading.textContent = genre.toUpperCase();
        heading.classList.add ('genreHeading');
        container.appendChild(heading);

        books.forEach(book => {
          const bookCover = document.createElement('img');
          bookCover.className = 'bookCover'
          bookCover.src = book.cover;
          bookCover.alt = 'Book Cover';
          bookCover.dataset.bookId = book.id;
  
          container.appendChild(bookCover);
        });

        // Append the container to the webpage
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
        console.log("re-directing to specific book");
        window.location.href = `/books/${bookId}`;
      }
    }
  });

 // Initialize the startIndex to 0
 
  
  
  Promise.all(bookPromises)
    .then(() => {
      console.log('All books fetched successfully!');
    })
    .catch(error => {
      console.error('Error fetching books:', error);
    });
}

let startIndex = 0; 

  document.getElementById('displayMoreBtn').addEventListener('click', () => {
    
    const newOffset = currentOffset + 20; // Increase the number by 10 
  
    // Remove the existing genre containers to make space for new ones
    const genreContainers = document.querySelectorAll('.genre-container');
    genreContainers.forEach(container => {
      container.remove();
    });
  
    // Call the getAPI() function with  new maxResults and updated startIndex
    getAPI(maxResultsPerGenre, newOffset);
  
  });

  const currentOffset = 0; 
getAPI(maxResultsPerGenre, startIndex);