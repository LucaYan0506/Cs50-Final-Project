let chat_name = "default";
let curr_chatSocket;
let all_chatSocket = new Map();

document.addEventListener('DOMContentLoaded',() => {
    document.querySelector('#user').onclick = () => {
        const submenu = document.querySelector('#sub-menu-user');
        submenu.addEventListener('animationend',() =>{
            if (submenu.style.animationName == 'fade-in')
                submenu.style.display = 'none';
        })
        open_close_submenu(submenu)
    }
    document.querySelectorAll('#card').forEach((card) => {
        if (card.getAttribute('name').substring(0,4) == 'note'){
            chat_name = card.getAttribute("name");
            const chat_socket = new WebSocket("ws://" + window.location.host + "/ws/note/" + chat_name + "/");
            all_chatSocket.set(chat_name,chat_socket);
            
            chat_socket.onmessage = (event) => {
                if (chat_socket == curr_chatSocket){
                    let data = JSON.parse(event.data);
                    if (data.user != user){
                        //save current current position
                        let a = $('#content').caret('pos');   
    
                        document.querySelector('.body #content').innerHTML = data.message;
                        //restore current position
                        $('#content').caret('pos',a)

                        //re-update table
                        update_table_function();
                    }
                }
            }
        }
    })

    first_card.click()
})
window.addEventListener('mouseup', function(event){
	const user_box = document.querySelector('#user');
    const submenu = document.querySelector('#sub-menu-user');

	if (event.target != user_box && event.target.parentNode != user_box && submenu.style.animationName == 'fade-out'){
        submenu.style.animation = 'fade-in';
        submenu.style.animationDuration = '1s';
        submenu.style.animationFillMode  = 'forwards';
    }
});

function open_close_submenu(submenu){
    if (submenu.style.animationName == 'fade-out'){
        submenu.style.animation = 'fade-in';
        submenu.style.animationDuration = '1s';
        submenu.style.animationFillMode  = 'forwards';
    }
    else{
        submenu.style.display = 'block';
        submenu.style.animationName = 'fade-out';
        submenu.style.animationDuration = '1s';
        submenu.style.animationFillMode  = 'forwards';
    }
}

function show_add_note_view(){
    if (window.innerWidth < 600)
        return save_note();
    
    const view = document.querySelector('#container #add-note').parentElement;
    view.style.display = "block";   
    view.style.animationName = 'fade-out';
    view.style.animationDuration = '1s';
    view.style.animationFillMode  = 'forwards';
}

function show_add_folder_view(){
    const view = document.querySelector('#container #add-folder').parentElement;
    view.style.display = "block";   
    view.style.animationName = 'fade-out';
    view.style.animationDuration = '1s';
    view.style.animationFillMode  = 'forwards';
}

function show_modify_folders_view(){
    const ul = document.querySelector('#container #modify-folder #users-container ul');
    while (ul.childElementCount > 0){
        ul.removeChild(ul.firstElementChild);
    }
    fetch(`/delete_folder/`)
    .then(response => response.json())
    .then(data => {
        data.forEach(el => {
            const li = document.createElement('li');
            li.innerHTML = el['title'];
            li.style.cursor = 'pointer';
            li.onclick = () => {
                document.querySelector('#container #modify-folder #rename').value = el['title']
                document.querySelector('#container #modify-folder #dropmenu').click()
                document.querySelector('#container #modify-folder button[name="rename-btn"]').onclick = () =>{rename_folder(el['pk'])}
                document.querySelector('#container #modify-folder button[name="delete-btn"]').onclick = () =>{delete_folder(el['pk'])}
            }
            ul.append(li);
        })
        document.querySelector('#container #modify-folder #users-container ul li').click();
    })
    const view = document.querySelector('#container #modify-folder').parentElement;
    view.style.display = "block";   
    view.style.animationName = 'fade-out';
    view.style.animationDuration = '1s';
    view.style.animationFillMode  = 'forwards';
}

function rename_folder(pk){
    const new_title = document.querySelector('#container #modify-folder #rename').value;
    fetch("/rename_folder/", { 
        method: 'POST',
        headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({
            'pk':pk,
            'title':new_title
        }),
        mode: 'same-origin' // Do not send CSRF token to another domain.
    })
    .then(response => response.json())
    .then (data => {
        location.reload();
    })
}

function delete_folder(pk){
    let isExecuted = confirm("Are you sure to delete this folder and all page in the folder?\nNote: if you aren't the person who created this folder it will delete only for you");
    if (isExecuted){
        fetch("/delete_folder/", { 
            method: 'POST',
            headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
            body:JSON.stringify({
                'pk':pk,
            }),
            mode: 'same-origin' // Do not send CSRF token to another domain.
        })
        .then(response => response.json())
        .then (data => {
            location.reload();
        })
    }
}

document.querySelectorAll('#container').forEach(elem => {
    elem.addEventListener('click',(event) => {
        if (event.target === elem){
            event.target.style.animation = 'fade-in';
            event.target.style.animationDuration = '1s';
            event.target.style.animationFillMode  = 'forwards';
        }
    })
    elem.addEventListener('animationend',() => {
        if (elem.style.animationName === 'fade-in')
            elem.style.display = 'none';
    })
})

document.querySelector('#add-note textarea').addEventListener('keydown',() => {
    const element =  document.querySelector('#add-note textarea');
    let temp = element.parentElement.scrollTop; 
    element.style.height = '1px';
    element.style.height = (25+element.scrollHeight)+"px";
    element.parentElement.scrollTop = temp;
})

//save an existing note
function save_btn(self){
    autosave(document.querySelector('#note'))
    location.reload()
}


//save a new note
function save_note(){
    document.querySelector('#add-note form').submit();   
}

function open_close_menu(icon){
    let menu = document.querySelector('.menu');
    if (menu.style.animationName == 'move-left-menu'){
        menu.style.animation = 'move-right-menu';
        menu.style.animationDuration = '1s';
        menu.style.animationFillMode  = 'forwards';

        body = document.querySelector('.body');
        body.style.animation = 'move-right-body';
        body.style.animationDuration = '1s';
        body.style.animationFillMode  = 'forwards';
        const icon = document.querySelector('.body #icon');
        icon.remove();
    }
    else{
        menu.style.animationName = 'move-left-menu';
        menu.style.animationDuration = '1s';
        menu.style.animationFillMode  = 'forwards';

        body = document.querySelector('.body');
        body.style.animation = 'move-left-body';
        body.style.animationDuration = '1s';
        body.style.animationFillMode  = 'forwards';
        
        const icon = document.querySelector('#icon').cloneNode(true);
        icon.style.position = "fixed";
        icon.style.top = "3px";
        body.append(icon);
    }
}

let prev_card;
let curr_page_pk;
function choose_page(card,pk,onpopstate = false){
    //close any windows (if there is) and clear (#share-with-following-users)
    document.querySelector('#container').click()
    while(document.querySelector('#share-with-following-users').childElementCount > 0){
        document.querySelector('#share-with-following-users').removeChild(document.querySelector('#share-with-following-users').lastElementChild)
    }
    document.querySelector('#container #share #search-bar').value = '';

    //change the background of the card in the menu
    if (prev_card)
        prev_card.style.background = '';
        
    card.style.background = 'gainsboro';
    prev_card = card;
    curr_page_pk = pk;

    //update .body
    const h1 = document.querySelector('.body h1');
    const content = document.querySelector('.body #content');
    fetch(`/get_note/?pk=${pk}`)
    .then(response => response.json())
    .then(data => {
        h1.innerHTML = data.title;
        content.innerHTML = data.content; 
        if (onpopstate == false)
            history.pushState({'section':pk},"",`?page=${pk}`);   
      
        update_table_function();
    })

    //set current websocket
    curr_chatSocket = all_chatSocket.get(card.getAttribute('name'));
    if (window.innerWidth < 600){
        open_close_menu(document.querySelector('.menu #icon'));
    }
}

window.onpopstate = function(event){
    let card = document.querySelector('#card');
    let pk =  1;
    if (event != null){
        pk = event.state.section;
        card = document.querySelector(`#card[name=note_${pk}]`);
    }

    choose_page(card,pk,true)
}

function check_empty(element){
    if (element.innerHTML === '<br>')
        element.innerHTML = '';
}

function check_empty_title(element){
    if (element.innerHTML === '<br>')
        element.innerHTML = '';
}

function autosave(note){
    document.querySelectorAll('.table').forEach(table => {
        remove_button_table(table);
    })

    //update simultaneously to everyone
    update_note_share(note.childNodes[3].innerHTML);

    let content = "";
    for (let i = 1; i < note.childElementCount; i++){
        content += note.children[i].innerHTML;
    }
    fetch("/update_note/", { 
        method: 'POST',
        headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({
            'pk':curr_page_pk,
            'title':note.children[0].innerHTML,
            'content':content,
        }),
        mode: 'same-origin' // Do not send CSRF token to another domain.
    })
}

function collaps_uncollapse(self,pages){
    if (pages.style.display == 'none'){
        pages.style.display = 'block';
        self.childNodes[1].className = "arrow down"
    }
    else{
        pages.style.display = 'none';
        self.childNodes[1].className = "arrow right"
    }
}

function print_element(elem){
    let styles;
    if (elem === '.body'){
        styles = `
        @media print {
            @page {
                size: auto;
                margin: 0;  /* this affects the margin in the printer settings */
            }
            body * {
            visibility: hidden;
            }
            .body{
            margin-left: 0px;
            }
            #note, #note * {
            visibility: visible;
            }
        }
        `
    }
    else if(elem == '#add-note'){
        styles = `
        @media print {
            @page {
                size: auto;
                margin: 0;  /* this affects the margin in the printer settings */
            }
            body * {
            visibility: hidden;
            }
            #add-note{
                top:0px;
            }
            #add-note form, #add-note form * {
            visibility: visible;
            }
            #add-note form div, #add-note form select {
                display: none;
            }
        }
        `
    }
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    print();

    document.head.removeChild(styleSheet);
}

document.querySelectorAll('#customize-select').forEach(elem => {
    elem.childNodes[1].onclick = () =>{ 
        const user_container = elem.childNodes[4];
        if (user_container.style.display == 'none'){
            user_container.style.display = 'flex';
        }else{
            user_container.style.display = 'none';
        }
    }
})

function delete_note(){
    let isExecuted = confirm("Are you sure to delete this note?\nNote: if you aren't the person who created this folder you won't delete this page, but you won't be able to access this folder anymore");
    if (isExecuted){
        fetch("/delete_note/", { 
            method: 'POST',
            headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
            body:JSON.stringify({
                'pk':curr_page_pk,
            }),
            mode: 'same-origin' // Do not send CSRF token to another domain.
        })
        .then(() => {location.reload()})
    }
}


let owners = new Set();
let new_owners = new Set();

function show_share_view(){
   owners = new Set()
   new_owners = new Set();

   //clear #share-with-following-users
   while(document.querySelector('#share-with-following-users').childElementCount > 0){
    document.querySelector('#share-with-following-users').removeChild(document.querySelector('#share-with-following-users').lastElementChild)
    }

   const view = document.querySelector('#container #share').parentElement;
   fetch(`share_folder?pk=${curr_page_pk}`)
   .then(response => response.json())
   .then((data) => {
       document.querySelector('#container #share #title').innerHTML = "Folder: " + data.title;
       const member = document.querySelector('#container #share #shared-with');
       member.innerHTML = "";
       data.owner.forEach(user => {
           if (member.innerHTML != ""){
               member.innerHTML += ', '
           }
           member.innerHTML += user;
       })
   })

   view.style.display = "block";   
   view.style.animationName = 'fade-out';
   view.style.animationDuration = '1s';
   view.style.animationFillMode  = 'forwards';
   document.querySelector('#container #share #search-bar').focus();
}

function show_search_user_result_view(self){
    if (self.value == ''){
        document.querySelector('#search-user-result').style.display = 'none';
        return;
    }
    fetch(`/search_user/?prefix=${self.value}&page_pk=${curr_page_pk}`)
    .then(response => response.json())
    .then(data => {
        const result_view = document.querySelector('#search-user-result')

        while(result_view.childElementCount > 0){
            result_view.removeChild(result_view.lastChild);
        }

        result_view.innerHTML = '';

        data.owners.forEach(el => {
            owners.add(el);
        })

        result_view.style.justifyContent = '';
        result_view.style.textAlign  = '';

        let count = 0;
        data.users.forEach(elem => {
            if (owners.has(elem) | new_owners.has(elem)){
                return;
            }
            count++;
            const div = document.createElement('div');
            div.innerHTML = elem;
            div.onclick = () => {
                add_this_user(elem,div)
            }
            result_view.append(div);
        })
        
        if (count == 0){
            result_view.style.justifyContent = 'center';
            result_view.style.textAlign  = 'center';
            result_view.innerHTML = 'Empty';
        }

        result_view.style.display = 'flex';
    })
    
}

function add_this_user(username,self){
    new_owners.add(username);

    const new_user = document.createElement('div');
    new_user.innerHTML = username;

    const delete_btn = document.createElement('b');
    delete_btn.innerHTML = 'X'
    delete_btn.style.cursor = 'pointer';
    delete_btn.style.marginLeft = '10px';
    delete_btn.onclick = () => {
        new_owners.delete(username);
        self.style = "";
        new_user.remove();
    }
    new_user.append(delete_btn);
    document.querySelector('#share-with-following-users').append(new_user);

    self.style = "pointer-events: none;";
    self.style.background = "#a9a9a94f";
    self.style.color = 'gray';
}

function share_btn_click(){
    let data = []
    new_owners.forEach(el => {
       data.push(el);
    })
    fetch("/share_folder/", { 
        method: 'POST',
        headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({
            'new_owners':data,
            'page_pk' : curr_page_pk
        }),
        mode: 'same-origin' // Do not send CSRF token to another domain.
    })
    .then(response => response.json())
    .then(data => {
        show_share_view();
    })
}

function show_add_view(){
    const add_view = document.querySelector('#add-view');
    add_view.style.display = 'block';
    add_view.style.animationName = 'fade-out';
    add_view.style.animationDuration = '1s';
    add_view.style.animationFillMode  = 'forwards';
}

document.addEventListener('click' , (event) => {
    if (document.querySelector('#add')){

        const add_view = document.querySelector('#add-view');

        if (event.target != add_view & event.target != document.querySelector('#add') & add_view.style.display == 'block'){
            add_view.style.animationName = 'fade-in';
            add_view.style.animationDuration = '1s';
            add_view.style.animationFillMode  = 'forwards';

            setTimeout(() => {
                add_view.style.display = 'none';
            },1000)
        }
    }
})

function add_checkbox_l1(){
    document.querySelector('#note #content').innerHTML += '<ul><li></li></ul>'
    autosave(document.querySelector('#note'))
}

function add_checkbox_l2(){
    document.querySelector('#note #content').innerHTML += '<ul><ul><li></li></ul></ul>'
    autosave(document.querySelector('#note'))
}

function add_checkbox_l3(){
    document.querySelector('#note #content').innerHTML += '<ul><ul><ul><li></li></ul></ul></ul>'
    autosave(document.querySelector('#note'))
}

function add_table(){
    let n = prompt("Please enter the number of column", "3");
    let i = 0;
    let rows = "";
    let colomn = "";
    while (i < n){
        rows += '<th scope="col"></th>'
        colomn += '<td></td>'
        i++;
    }


    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = `
    <thead>
        <tr>
        <th style="user-select:none" id="delete-table"></th>
        ${rows}
        </tr>
    </thead>
    <tbody>
        <tr>
        <td><b>1</b></td>
        ${colomn}
        </tr>
    </tbody>
    `
    document.querySelector('#content').append(table);

    update_table_function()
    autosave(document.querySelector('#note'))
}

function add_button_table(table){
    //add delete button
    const delete_btn = document.createElement('button');
    delete_btn.id = 'delete-btn';
    delete_btn.innerHTML = 'X';
    delete_btn.onclick = () => {
        if (confirm('Are you sure to delete this table')){
            table.remove();
            autosave(document.querySelector('#note'))
        }
    }

    //add "add_row" button
    const add_button = document.createElement('button');
    add_button.id = "add-btn";
    add_button.innerHTML = 'Add new row';

    add_button.onclick = () => {
        const tr = document.createElement('tr');
        let count_field = table.querySelector('thead tr').childElementCount;
        let count_row = table.querySelector('tbody').childElementCount + 1;
        let td = "";
        for (let i = 0; i < count_field - 1; i++){
            td += `<td></td>`
        }
        tr.innerHTML = `<td><b>${count_row}</b></th>` + td;

        table.querySelector('tbody').append(tr)
        autosave(document.querySelector('#note'))
    }
   


    table.querySelector('th').innerHTML = "";
    table.querySelector('th').append(delete_btn);
    table.querySelector('th').append(add_button);
}

function remove_button_table(table){
    const delete_btn = table.querySelector('#delete-btn');
    const add_button = table.querySelector('#add-btn');
    if (delete_btn){
        table.querySelector('th').removeChild(delete_btn);
    }
    if (add_button){
        table.querySelector('th').removeChild(add_button);
    }
}

function update_table_function(){
    //add a 'X' btn and "add new row" button for each table
    document.querySelectorAll('.table').forEach(table => {

        table.querySelectorAll('tbody tr td').forEach(el => {
            el.setAttribute('tabindex', 1); 
            el.onfocus = () =>{
                add_button_table(table);
            }
        })
        table.querySelectorAll('tbody tr th').forEach(el => {
            el.setAttribute('tabindex', 1); 
            el.onfocus = () =>{
                add_button_table(table);
            }
        })
        table.querySelectorAll('thead tr th').forEach(el => {
            el.setAttribute('tabindex', 1); 
            el.onfocus = () =>{
                add_button_table(table);
            }
        })
    })
}

document.addEventListener('click',(event) => {
    if (event.target.nodeName != 'TH' & event.target.nodeName != 'TR' & event.target.nodeName != 'TD' & event.target.nodeName != 'TBODY' & event.target.nodeName != 'TABLE' & event.target.id != 'delete-btn' & event.target.id != 'add-btn'){
        document.querySelectorAll('.table').forEach(table => {
            remove_button_table(table);
        })
    };
})



function update_note_share(message){
    curr_chatSocket.send(JSON.stringify({
        'user':user,
        'message': message,
    }))

}