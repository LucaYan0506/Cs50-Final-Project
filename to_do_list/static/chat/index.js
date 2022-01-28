let chat_name = "default";
let curr_chatSocket;
let all_chatSocket = new Map();

document.addEventListener('DOMContentLoaded',() => {
    document.querySelectorAll('#card').forEach((card) => {
        chat_name = card.getAttribute("name");
        get_message(chat_name.substr(5))
        const chat_socket = new WebSocket("ws://" + window.location.host + "/ws/chat/" + chat_name + "/");
        all_chatSocket.set(chat_name,chat_socket);
        chat_socket.onmessage = (event) => {
            receive_message(chat_socket,event)
        }
    })
})

function receive_message(self,event){
    let pk = self.url.substr(self.url.search('note_')+ 5);
    pk = pk.substr(0,pk.length - 1)

    get_message(pk,false);
    if (self == curr_chatSocket){
        const data = JSON.parse(event.data);
        read_message(pk);
        show_message(data);
    }
}

function send_message(message){
    fetch("/chat/send_message/", { 
        method: 'POST',
        headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({
            'message' : message,
            'pk':chat_name.substr(5)
        }),
        mode: 'same-origin' // Do not send CSRF token to another domain.
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
}

function read_message(pk){
    fetch("/chat/read_message/", { 
        method: 'PUT',
        headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({
            'pk':pk
        }),
        mode: 'same-origin' // Do not send CSRF token to another domain.
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}

function get_message(pk, show = true){
    fetch(`/chat/get_message/${pk}`)
    .then(response => response.json())
    .then(data => {
        data.body.forEach((message) => {
            if (show == true){
                show_message(message)
            }
        })
        console.log(data.read)
        if (data.read == false){
            elem = document.getElementsByName(`note_${pk}`)[0];
            if (elem.innerHTML[elem.innerHTML.length - 1] != '*'){
                console.log(elem.innerHTML[elem.innerHTML.length - 1]);
                elem.innerHTML += ' *';
                elem.style.fontWeight = '900'
            }
        }
    })
}

function show_message(data){
    const message = document.createElement('div');
    message.innerHTML += '<b style="color:blue">' + data['user'] + "</b><br>" + data['message'] + "<br>";
    message.className = 'chat-message'
    if (data['user'] === user)
        message.className += ' mine';
    document.querySelector('#chat-box #chat-content').append(message);

    //when there is a new message go to the bottom of the page
    var content = document.querySelector("#chat-box #chat-content");
    content.scrollTop = content.scrollHeight;
}

document.querySelector('#chat-box button').onclick = () => {
    if (document.querySelector('#chat-box input').validity.valid){
        const message = document.querySelector('#chat-box input').value;
        send_message(message);
        document.querySelector('#chat-box input').value = '';
        curr_chatSocket.send(JSON.stringify({
            'message': message,
            'user' : user,
        }))
    }
}

document.querySelector('#chat-box input').onkeyup = (event) => {
    if (event.key == 'Enter' & document.querySelector('#chat-box input').validity.valid){
        const message = document.querySelector('#chat-box input').value;
        send_message(message);
        document.querySelector('#chat-box input').value = '';
        curr_chatSocket.send(JSON.stringify({
            'message': message,
            'user' : user,
        }))
    };
}

function choose_group(card,pk){
    document.querySelector('#chat-box').style.display = 'block';
    chat_name = card.getAttribute("name");
    //change the background of the card in the menu
    if (prev_card)
        prev_card.style.background = '';
    
    card.style.background = 'gainsboro';
    card.style.fontWeight  = 'normal';

    if (card.innerHTML[card.innerHTML.length - 1] == '*'){
        card.innerHTML = card.innerHTML.substr(0,card.innerHTML.length - 2)
    }
    document.querySelector('#chat-box div').innerHTML = card.innerHTML;

    prev_card = card;
    curr_page_pk = pk;

    //remove all the message in the chat-content
    let chat_message = document.querySelector('#chat-box #chat-content');
    while(chat_message.firstChild){
        chat_message.removeChild(chat_message.lastChild);
    }

    //set in the server that emssages in this group is read
    read_message(pk);

    //get message of new group
    get_message(pk);

    curr_chatSocket = all_chatSocket.get(chat_name);
}

function show_add_chat_view(){
    if (window.innerWidth < 600)
        return save_note();
    
    const view = document.querySelector('#container #create-chat').parentElement;
    view.style.display = "block";   
    view.style.animationName = 'fade-out';
    view.style.animationDuration = '1s';
    view.style.animationFillMode  = 'forwards';

}function show_join_chat_view(){
    if (window.innerWidth < 600)
        return save_note();
    
    const view = document.querySelector('#container #join-chat').parentElement;
    view.style.display = "block";   
    view.style.animationName = 'fade-out';
    view.style.animationDuration = '1s';
    view.style.animationFillMode  = 'forwards';
}