const bookmarkBtn = document.querySelector('.bookmark-btn');
bookmarkBtn.addEventListener('click', bookmarkBook);

// Function to handle bookmarking the book
async function bookmarkBook() {
  const bookId = document.querySelector('.book').getAttribute('data-bookid');

  try {
    const response = await axios.post(`/api/books/${bookId}`, {});
    alert('Book bookmarked successfully!');
  } catch (error) {
    console.error('Error bookmarking book:', error);
    alert('Failed to bookmark the book. Please try again.');
  }
}