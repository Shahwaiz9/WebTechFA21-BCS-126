
window.onload = function() {
  var button = document.getElementById('subbut');

  button.addEventListener('click', function(event) {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;
  
    alert("Name: " + name + "\nEmail: " + email + "\nMessage: " + message);
  
    // Reset form fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
  
  });
};