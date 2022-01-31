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

    if (window.innerWidth < 600){
        open_close_menu(document.querySelector('.menu #icon'));
    }
})

function kick_member(username){
    pk = chat_name.substring(5);
    fetch(`/chat/admin/?group_pk=${pk}&action=kick&member=${username}`)
    .then(() => {
        alert(`${username} is kicked`); 
        location.reload();
    })
}

function leave(){
    pk = chat_name.substring(5);
    fetch(`/chat/admin/?group_pk=${pk}&action=kick&member=${user}`)
    .then(() => {
        alert('You left this group.')
        location.reload();
    })
}

function promote_member(username){
    pk = chat_name.substring(5);
    fetch(`/chat/admin/?group_pk=${pk}&action=promote&member=${username}`)
    .then(() => {
        alert(`You promoted ${username} to Admin`);
        location.reload();
    })
}

function save_title(title){
    alert('Saved');
}

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

    if (window.innerWidth < 600){
        open_close_menu(document.querySelector('.menu #icon'));
    }
}

function show_add_chat_view(){
    const view = document.querySelector('#container #create-chat').parentElement;
    view.style.display = "block";   
    view.style.animationName = 'fade-out';
    view.style.animationDuration = '1s';
    view.style.animationFillMode  = 'forwards';

}function show_join_chat_view(){
    const view = document.querySelector('#container #join-chat').parentElement;
    view.style.display = "block";   
    view.style.animationName = 'fade-out';
    view.style.animationDuration = '1s';
    view.style.animationFillMode  = 'forwards';
}

function show_group_detail_view(){
    const pk = chat_name.substr(5)
    fetch(`/chat/get_group_detail?pk=${pk}`)
    .then(response => response.json())
    .then(data => {
        const group_detail_view = document.querySelector('#group-detail');

        //clear group_detail_view
        while(group_detail_view.childElementCount > 1){
            group_detail_view.lastChild.remove();
        }

        const title_container = document.createElement('div');
        title_container.id="title-container"
        const title = document.createElement('h2')
        title.style.margin = '0 10px';
        title.innerHTML = data.name;
        title_container.append(title);

        if (data.Im_admin == true){
            const edit_title = document.createElement('img');
            edit_title.src = 'https://img.icons8.com/ios-glyphs/20/000000/edit--v1.png';
            edit_title.style.marginLeft = '5px';
            edit_title.style.marginTop = '7px';
            edit_title.style.cursor = 'pointer';
            edit_title.style.height = '20px';
            edit_title.style.width = '20px';
            edit_title.onclick = () => {
                title.contentEditable="true";
                title.focus()
            }

            title.onkeydown = () =>{
                save_title(title);
            }
            title_container.append(edit_title);
        }

        const description = document.createElement('div');
        description.id = 'description';
        description.innerHTML = `Group created by ${data.creator}, on ${data.created_time.substr(0,10)} at ${data.created_time.substr(11,8)}.`;

        const p = document.createElement('p');
        p.innerHTML = "Members";

        const members = document.createElement('div');
        members.id = 'members'

        data.admins.forEach((username) => {
            const member = document.createElement('div');
            member.id = 'member';

            const profile_img = document.createElement('img');

            const user_lbl = document.createElement('label');
            user_lbl.innerHTML = username;
            user_lbl.id = "username";

            const admin = document.createElement('label');
            admin.innerHTML = 'Admin';
            admin.id = "admin";
   
            member.append(profile_img);
            member.append(user_lbl);
            member.append(admin);

            if (data.Im_admin == true){
                const kick = document.createElement('label');
                kick.id= 'kick';
                if (username == user){
                    kick.innerHTML = 'Leave';
                    kick.onclick = () => {
                        leave();
                    }
                }else{
                    kick.innerHTML = 'Kick';
                    kick.onclick = () => {
                        kick_member(username);
                    }
                }
               
                member.append(kick);
                member.onmouseover = () => {
                    kick.style.display = 'block';
                }
                member.onmouseleave = () => {
                    kick.style.display = 'none';
                }
            }

            members.append(member);
        })

        data.members.forEach((username) => {
            const member = document.createElement('div');
            member.id = 'member';

            const profile_img = document.createElement('img');

            const user_lbl = document.createElement('label');
            user_lbl.innerHTML = username;
            user_lbl.id = "username"
            member.append(profile_img);
            member.append(user_lbl);

            if (data.Im_admin == true){
                const kick = document.createElement('label');
                kick.id= 'kick';
                if (username == user){
                    kick.innerHTML = 'Leave';
                    kick.onclick = () => {
                        leave();
                    }
                }else{
                    kick.innerHTML = 'Kick';
                    kick.onclick = () => {
                        kick_member(username);
                    }
                }
               
                const promote = document.createElement('label');
                promote.id = 'admin';
                promote.style.cursor = 'pointer';
                promote.style.display = 'none';
                promote.innerHTML = 'Promote';
                promote.onclick = () => {
                    promote_member(username);
                }

                member.append(promote)
                member.append(kick);
                member.onmouseover = () => {
                    kick.style.display = 'block';
                    promote.style.display = 'block';
                }
                member.onmouseleave = () => {
                    kick.style.display = 'none';
                    promote.style.display = 'none'
                }
            }

            members.append(member);
        })

        const leave_btn = document.createElement('button');
        leave_btn.id = 'leave';
        leave_btn.innerHTML = 'Leave';
        leave_btn.onclick = () => {
            console.log('success')
            leave();
        }

        group_detail_view.append(title_container);
        group_detail_view.append(description);
        group_detail_view.append(p);
        group_detail_view.append(members);
        group_detail_view.append(leave_btn);
    })

    const view = document.querySelector('#container #group-detail').parentElement;
    view.style.display = "block";   
    view.style.animationName = 'fade-out';
    view.style.animationDuration = '1s';
    view.style.animationFillMode  = 'forwards';
}
function close_container(self){
    console.log(self);
    self.parentElement.parentElement.parentElement.style.animation = 'fade-in';
    self.parentElement.parentElement.parentElement.style.animationDuration = '1s';
    self.parentElement.parentElement.parentElement.style.animationFillMode  = 'forwards';
}