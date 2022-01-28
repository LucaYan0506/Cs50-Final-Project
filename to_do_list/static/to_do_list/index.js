document.addEventListener('DOMContentLoaded',() => {
    document.querySelector('#user').onclick = () => {
        const submenu = document.querySelector('#sub-menu-user');
        submenu.addEventListener('animationend',() =>{
            if (submenu.style.animationName == 'fade-in')
                submenu.style.display = 'none';
        })
        open_close_submenu(submenu)
    }
})

window.onresize = () => {
    if (window.innerWidth < 600){
        const menu = document.querySelector('.menu');
        if (menu.style.animationName != 'move-left-menu'){
            body = document.querySelector('.body');
            body.style=`pointer-events: none;opacity: 0;`;
        }
    }
    else{
        body = document.querySelector('.body');
        body.style=`pointer-events: initial;opacity: 1;`;
        const menu = document.querySelector('.menu');
        if (menu.style.animationName == 'move-left-menu'){
            body.style.marginLeft = "0px";
        }
    }
};

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
    })

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

function autosave(note,table){
    fetch("/update_note/", { 
        method: 'POST',
        headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({
            'pk':curr_page_pk,
            'title':note.childNodes[1].innerHTML,
            'content':note.childNodes[3].innerHTML,
            'table':table
        }),
        mode: 'same-origin' // Do not send CSRF token to another domain.
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
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

document.querySelector('#dropmenu').onclick = () =>{ 
    const user_container = document.querySelector('#users-container');
    if (user_container.style.display == 'none'){
        user_container.style.display = 'flex';
    }else{
        user_container.style.display = 'none';
    }
}