'use strict';

var form = document.querySelector('#url-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  var url = encodeURI(document.querySelector('#url-input').value);
  var invalid = document.querySelector('#invalid-checkbox').checked;
  if (invalid) {
    url += '?invalid=true';
  }
  window.location.href = '/api/url/new/' + url;
});