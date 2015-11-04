'use strict';

// connect to firebase
var ref = new Firebase('https://nicholasapp.firebaseio.com/');
var chatRef = ref.child('chat'); // separate directory in the above firebase
var usersRef = ref.child('users');

$(document).ready(() => {

  let $name = $('#name');
  let $msg = $('#msg');
  let $add = $('#add');
  let $users = $('#userlist');
  let $log = $('.log');
  let $conversation = $('#conversation');
  var name;

  // event listeners
  $('#start').click(start);
  $add.click(addMessage);
  $name.on('keypress', (e) => {
    if (e.charCode === 13) start();
  }).focus();
  $msg.on('keypress', (e) => {
    if (e.charCode === 13) addMessage();
  }).focus();
  $('#logout').click(logout);

  // firebase listeners
  chatRef.on('child_added', (snapshot) => {
    var value = snapshot.val();
    var $li = $('<li>').text(value.time + ', ' + value.name + ': ' + value.message);
    $conversation.append($li);
  });
  usersRef.on('value', (snapshot) => {
    var users = snapshot.val();

    var $lis = [];

    for (var key in users) {
      var $li = $('<li>').text(users[key]);
      $lis.push($li);
    }

    $users.empty().append($lis);
  })

  function start() {
    name = $name.val();
    $name.val('');
    // name validation
    if (name.length > 0 && name.length < 15) {
      $log.show();
      $('.newMessage').show();
      $('#logout').show()
      $('.chooseName').hide();
      usersRef.push(name);
      $msg.focus();
      $('#username').text('logged in as ' + name).css('font-style', 'italic');
    } else {
      $name.val('too long!');
    }
  }

  function logout() {
    // same as on, but only triggers once
    usersRef.once('value', (snapshot) => {
      // console.log(snapshot.val());
      let users = snapshot.val();
      for (let key in users) {
        if (users[key] === name) {
          // remove from list
          usersRef.child(key).remove();
        }
      }
      $log.hide();
      $('.newMessage').hide();
      $('#logout').hide()
      $('.chooseName').show();

    }) 
  }

  function addMessage() {
    var message = $msg.val();
    $msg.val('');
    let time = (new Date()).toTimeString().split(' ')[0]
    let date = (new Date()).toDateString().split(' ').slice(1,3).join(' ');
    chatRef.push({
      name: name,
      time: time + ' ' + date,
      message: message
    });
    $msg.focus();
  }

})