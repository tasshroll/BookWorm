// add book to user Favorites
const addBookHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#project-name').value.trim();
  const needed_funding = document.querySelector('#project-funding').value.trim();
  const description = document.querySelector('#project-desc').value.trim();

  if (name && needed_funding && description) {
    const response = await fetch(`/api/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, needed_funding, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};

// remove book from user Favorites
const delBookHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete project');
    }
  }
};
const book = {
  id: 123,
  title: 'Example Book',
  author: 'John Doe',
  description: 'This is an example book.',
  cover: 'path/to/cover.jpg'
};

const bookHTML = bookPartial(book);
// Note: new-project-form should change to something
// like new-fav-book in html, profile.handlebars or 
// This listener triggered when user clicks checkbox
// next to book. Need to grab the 
//     title
//     author  
// from the selected book to store into Book table for
// the user.
document
  .querySelector('.new-project-form')
  .addEventListener('submit', addBookHandler);

  // Note: project-list should change to something
// like remove-fav-book in html, profile.handlebars
// Need to grab the
//     title
//     author
// from the de-selected book to remove it from Book
// table for this user.
document
  .querySelector('.project-list')
  .addEventListener('click', delBookHandler);
