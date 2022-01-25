let chat_name = "default";
const chatSocket = new WebSocket("ws://" + window.location.host + "/ws/chat/" + chat_name + "/");

chatSocket.onmessage = (event) =>{
    const data = JSON.parse(event.data);
    const message = document.createElement('div');
    message.innerHTML += data['user'] + "<br>" + data['message'] + "<br>";
    message.className = 'chat-message'
    if (data['user'] === user)
        message.className += ' mine';
    document.querySelector('#chat-box #chat-content').append(message);
    var content = document.querySelector("#chat-box #chat-content");
    content.scrollTop = content.scrollHeight;
}

document.querySelector('#chat-box button').onclick = () => {
    if (document.querySelector('#chat-box input').validity.valid){
        const message = document.querySelector('#chat-box input').value;
        document.querySelector('#chat-box input').value = '';
        chatSocket.send(JSON.stringify({
            'message': message,
            'user' : user,
        }))
    }
}

document.querySelector('#chat-box input').onkeyup = (event) => {
    if (event.key == 'Enter' & document.querySelector('#chat-box input').validity.valid){
        const message = document.querySelector('#chat-box input').value;
        document.querySelector('#chat-box input').value = '';
        chatSocket.send(JSON.stringify({
            'message': message,
            'user' : user,
        }))
    };
}

function choose_group(card,pk){
    document.querySelector('#chat-box').style.display = 'block';
    document.querySelector('#chat-box div').innerHTML = card.innerHTML;
    chat_name = card.innerHTML;
    //change the background of the card in the menu
    if (prev_card)
        prev_card.style.background = '';
    
    card.style.background = 'gainsboro';
    prev_card = card;
    curr_page_pk = pk;
}

function show_add_chat_view(){
    if (window.innerWidth < 600)
        return save_note();
    
    const view = document.querySelector('#container #add-chat').parentElement;
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