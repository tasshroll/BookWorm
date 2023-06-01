const newCommentHandler = async (event) => {
    event.preventDefault();
  
    const content = document.querySelector('#comment-content').value.trim();
    const date_created = Date.now();
  
    if (content) {
  
      // POST a new COMMENT
  
      const id = window.location.pathname.split("/").pop();
      const response = await fetch(`/api/book/comment/${id}`, {
        method: 'POST',
        body: JSON.stringify({ comment, date_created }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // list all the comments for the book
        location.reload();
        console.log("POSTING NEW COMMENT SUCCESSFULL!");
      } else {
        console.log(response.status);
        alert('Failed to add comment');
      }
    }
  };
  
  // Add .comment-form into the HTML
  document
    .querySelector('.comment-form')
    .addEventListener('submit', newCommentHandler);