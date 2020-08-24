// Instructional Modal
let modal = document.getElementById('instructions-modal');
let openModal = document.getElementById('open-modal');
let exitButton =document.getElementById('exit');

openModal.onclick = function() {
  modal.style.display = 'block';
};

exitButton.onclick = function() {
  modal.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
