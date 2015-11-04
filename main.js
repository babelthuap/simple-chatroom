'use strict';

// connect to firebase
var ref = new Firebase('https://nicholasapp.firebaseio.com/');
var chatRef = ref.child('chat'); // separate directory in the above firebase

$(document).ready(() => {

  let $name = $('#name');
  let $msg = $('#msg');
  let $add = $('#add');
  let $conversation = $('#conversation');
  var name;

  // event listeners
  $('#start').click(start);
  $add.click(addMessage);
  $('#name').on('keypress', (e) => {
    if (e.charCode === 13) start();
  }).focus();
  $('#msg').on('keypress', (e) => {
    if (e.charCode === 13) addMessage();
  }).focus();

  // firebase listener
  chatRef.on('child_added', (snapshot) => {
    var value = snapshot.val();
    var $li = $('<li>').text(value.time + ' ' + value.name + ': ' + value.message);
    $conversation.append($li);
  });

  function start() {
    name = $name.val();
    $name.val('');
    // name validation
    if (name.length > 0 && name.length < 15) {
      $('.newMessage').show();
      $('.chooseName').hide();
      $msg.focus();
      $add.after( $('<p>').text('logged in as ' + name).css('font-style', 'italic') );
    } else {
      $name.val('too long!')
    }
  }

  function addMessage() {
    var message = $msg.val();
    $msg.val('');
    chatRef.push({
      name: name,
      time: (new Date()).toTimeString().split(' ')[0],
      message: message
    });
    $msg.focus();
  }

})