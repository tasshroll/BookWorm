
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
              cover: item.volumeInfo.imageLinks?.thumbnail || 'No cover available'
            };
          });
          console.log(`Books of ${genre}:`, books);
        })
        .catch(error => {
          console.error(`Error fetching books of ${genre}:`, error);
        });
    
      bookPromises.push(bookPromise);
    }
    
    Promise.all(bookPromises)
      .then(() => {
        console.log('All books fetched successfully!');
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }
  
  getAPI();
  