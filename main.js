'use strict';

// connect to firebase
var ref = new Firebase('https://nicholasapp.firebaseio.com/');

$(document).ready(() => {

  let $msg = $('#msg');
  let $conversation = $('#conversation');
  $('#add').click(addMessage);
  $('#msg').on('keypress', (e) => {
    if (e.charCode === 13) addMessage();
  }).focus();
  ref.on('child_added', (snapshot) => {
    var value = snapshot.val();
    console.log(value);
    var $li = $('<li>').text(value);
    $conversation.append($li);
  });

  function addMessage(){
    var message = $msg.val();
    $msg.val('');
    ref.push(message);
    $msg.focus();
  }

})