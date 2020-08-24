"use strict";

// Instructional Modal
var modal = document.getElementById('instructions-modal');
var openModal = document.getElementById('open-modal');
var exitButton = document.getElementById('exit');

openModal.onclick = function () {
  modal.style.display = 'block';
};

exitButton.onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};