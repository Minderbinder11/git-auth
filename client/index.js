//index.js

var button = document.getElementById('submit');

button.addEventListener('click', () => {
  axios.get('/login')
    .then(response => {
      console.log('in client response');
      window.location.replace(response.data.redirect);
    })
    .catch(err => {
      console.log(err);
    });

});
