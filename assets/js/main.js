"use strict";
const typingDelay = 500;

let
  endpoint = '/api/data?q=',
  timer,
  searchText = '',
  selectedType = -1;

function init() {
  select('all');
  $('.search-input').keyup(delay(e => request(e), typingDelay));
}

function search(text) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    searchText = text;
    request(text);
  }, typingDelay);
}

function request(event) {
  let query = event && event.target && event.target.value || event;
  if (selectedType >= 0) query += `&type=${selectedType}`;
  if (query.length && query.length !== 0 && query.length < 2) return;
  fetch(`${endpoint}${query}`)
    .then(res => res.json())
    .then(data => {
      $('.search-results').html('');
      for (let i = 0; i < data.length; i++) {
        let result = data[i];
        $('.search-results').append(`
          <tr>
            <td class="id">${result.id}</td>
            <td class="company-name">${result.companyName}</td>
            <td class="email">${result.email}</td>
          </tr>
        `);
      }
    });
}

function delay(fn, ms) {
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, ...args), ms || 0);
  }
}

function select(id) {
  $('#filterall, #filterfree, #filterpaying').removeClass('selected');
  $(`#filter${id}`).addClass('selected');
  switch (id) {
    case 'all':
      typeSet(-1);
      break;
    case 'free':
      typeSet(0);
      break;
    case 'paying':
      typeSet(1);
      break;
  }
}

function typeSet(i) {
  searchText = $('.search-input').val();
  selectedType = i;
  request(searchText);
}