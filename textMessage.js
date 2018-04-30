
var $messages = $('.messages');
var $chatinput = $('.chatinput');
var $chatsend = $('.chatsend');
var $sendmessage = $('.sendmessage');
var $clearall = $('.clearall');


var msgs = []; 


function createMsg(text, owner){
  var msg = {
    text: text,
    time: new Date().getTime(),
    owner: owner
  };
    msgs.push(msg);
    renderMsg(msg);
  
  localStorage.msgs = JSON.stringify(msgs);
  
    return msg;
}

function renderAll() {
  $messages.empty();
  if(typeof localStorage.msgs === 'string') {
    msgs = JSON.parse(localStorage.msgs);
  }
  msgs.forEach(renderMsg);
}

renderAll();

function renderMsg(msg) {
  var $li = $('<li>').addClass(msg.owner + 'message').appendTo($messages);
  if(msg.owner === 'bot') {
          $('<span/>').text('DD').addClass('avatar').appendTo($li);
  }
  var $body = $('<div/>').addClass('messagebody').appendTo($li);
  $('<p/>').text(msg.text).appendTo($body).on('click', editMessage.bind($li));
  var time = new Date(msg.time).toLocaleTimeString();
  $('<time/>').text(time).appendTo($body);
  scrollAtBottom();
}

function editMessage() {
  var $el = $(this);
  var index = $el.index();
  var msg = msgs[index];
  if(msg.owner === 'my') {
    var p = prompt('Edit your message', msg.text);
    if(p) {
      msg.text = p;
    } else {
      msgs.splice(index, 1);
    }
    localStorage.msgs = JSON.stringify(msgs);
    renderAll();
  }
}


function scrollAtBottom() {
  var amount = $messages.get(0).scrollHeight - $messages.get(0).clientHeight;
  $messages.scrollTop(amount);
}

function createBotMsg(text) {
  return createMsg(pigLatinAll(text), 'bot');
}

$('.messages li').click('click', function(){
  $(this).remove();
});


var el = renderMessage({
		user: 'bot',
		text: '<i class="fa fa-spin fa-hourglass-end"></i>'
	});

function sendMessage () {
  var text = $chatinput.val();
  if(text) {
     $chatinput.val('');
    createMsg(text, 'my');
 
    setTimeout(function(){
      createBotMsg(text);
    }, 1200);
  }
  $chatinput.focus();
}


$chatsend.on('click', sendMessage);

function pigLatin(text) {
  return text.substr(1) + text[0] + 'ay';
}

function pigLatinAll(text) {
  return text.split(' ').map(pigLatin).join(' ');
}

$chatinput.on('keyup', function(e){
  if(e.which === 13) {
    sendMessage();
  }
})