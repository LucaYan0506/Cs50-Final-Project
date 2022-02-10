var editor = document.getElementsByTagName("p").item(0);
var button = document.getElementsByTagName("button").item(0);
var button2 = document.getElementsByTagName("button").item(1);
var button3 = document.getElementsByTagName("button").item(2);
var button4 = document.getElementsByTagName("button").item(3);


var sel = document.getSelection();
var saved;

editor.addEventListener('keypress', handleKeyPress);
editor.addEventListener('keydown', handleKeyDown);
button4.addEventListener('click', log);
button.addEventListener('click', savePosition);
button2.addEventListener('click', restorePosition);
button3.addEventListener('click', change);

function log() {
  console.log(editor.childNodes);
}

function restorePosition() {
  editor.focus();
  //sel.extend(saved[0], saved[1]);
  sel.collapse(saved[0], saved[1]);
}

function savePosition() {
}

function change() {
  var text = editor.childNodes;
   
  for (var i = 0; i<text.length;i++) {

    if (text[i].textContent === "base") {
      var bold = document.createElement("span");
      bold.classList.add("highlight");
      bold.appendChild(document.createTextNode(text[i].textContent));
      editor.replaceChild(bold, text[i]);
    }
  }
}

var lastCharSpace = false;

function handleKeyDown(e) {
  if (e.which === 32) {
    lastCharSpace = true;
    e.preventDefault();
    var space = new Text('\u00A0');
    
    editor.appendChild(space);
		sel.collapse(space, 1);
    
  } 
}

function handleKeyPress(e) {
  change();
   if (lastCharSpace) {
    e.preventDefault();
    lastCharSpace = false;
    var newNode = new Text(String.fromCharCode(e.keyCode));
    
    editor.appendChild(newNode);
    
    sel.collapse(newNode, 1);
  }
}