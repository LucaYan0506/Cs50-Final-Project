# Cs50-Final-Project
## Video: [CS50’s Web Programming with Python and JavaScript Final Project](https://youtu.be/5FV3gdesLPI)
   
I created a website where people can write notes and ,in the same time, chat with other users (so people don't need to use a website for chatting and another website for taking note).  
To create this website I watched a tutorial on youtube about asynchronous request(`channels`). Based on that video, I created a chatroom and pages where multiple users can edit the same document (users can see changes made by other users).  
  
### The main purpose of the website is:
- write notes
- create a chatgroup and chat with other user
### Additional Features
- Add table/checkbox on notes
- Print notes
- Add folder and separate notes in different folders
- Share notes with other user and edits them in the same time
- The admin of a group can promote and kick a member
- The admin of a group can rename a chatgroup
- Get a notification when there is a new message


## Distinctiveness and Complexity:
I believe that my web application is sufficiently distinct from the other projects in this course because my website is about taking notes and chatroom which is completely different than other projects. Also, I used django-encrypted-model-fields to encrypt some sensitive data and make sure that people can't read db.sqlite without permission.
I also believe that it is more complex than those projects because it has more features than other projects, more lines of code and because of the time I spent (almost 2 month).
## What’s contained in each file:
- [final_project](https://github.com/me50/LucaYan0506/tree/web50/projects/2020/x/capstone/final_project) is the project folder. It contains:
  - [asgi.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/final_project/asgi.py): here, there is the default setting to have asynchronous web servers and applications. It allows the server to communicate with the client asynchronously
  - [routing.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/final_project/routing.py): it collect urls from `chat.routing`. This allow the WebSocket  (in client-side) to connect to the server asynchronously
  - [setting.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/final_project/settings.py): It contains:
    - main apps of this project (to_do_list & chat), channels (library that allow the asynchronous communication) and encrypted_model_fields (the library to encrypt some data)
    - static and media url to allow the web gets images from media folder and static file (JS and CSS file) from static folder.
    - ASGI_APPLICATION: get the application from [asgi.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/final_project/asgi.py)
    - Channel layers which allow us to talk between different instances of an application
    - FIELD_ENCRYPTION_KEY to encrypt data
  - [urls.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/final_project/urls.py): it collect all urls from to_do_list and chat
  - [wsgi.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/final_project/asgi.py): here, there is the default setting for WSGI
- [chat](https://github.com/LucaYan0506/Cs50-Final-Project/tree/master/chat) is the folder for the chat app (it allows users to chat with others]. It contains:
  - [apps.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/apps.py): it contains the default configuration of the chat app
  - [routing.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/routing.py): it contains all urls (urls for the `chat app` and `to_do_list app`) that allow WebSocket  to connect to the server 
  - [consumer.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/consumer.py): it contains functions to run when a WebSocket  connect or disconnect  to the server and when the server receive a message
  - [models.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/models.py): it contains 2 Models: 
    - Chat_group: it contains the title of the group, administrators, members, users that read the last message of the group, user who create the group and the time this group has been created.
    - Chat_message: it contains messages, chat_group that this message is from and the sender
  -  [urls.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/urls.py): it contains urls to:
      - join a chat-group
      - create a chat-group
      - send a message in a specific group
      - get all messages of a specific group
      - read a message of a specific group (so the name of that group will not be bold and with * symbol anymore)
      - get detail of a group (such as title, admins, members, creator, created time and if the current user is an admin of the group)
      - if the user is an admin he can kick or promote a member and rename the name of the group 
  -  [views.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/views.py): it contains functions that will run when the user call one of the urls mentioned above
- [media](https://github.com/LucaYan0506/Cs50-Final-Project/tree/master/media): it contains an image of profile and an image of sidebar
- [to_do_list](https://github.com/LucaYan0506/Cs50-Final-Project/tree/master/to_do_list)
  - [static](https://github.com/LucaYan0506/Cs50-Final-Project/tree/master/to_do_list/static): it constains JavaScript and CSS file for the project. Also it contains jquery.caret.js which used to get the position of the cursor.
  - [templates](https://github.com/LucaYan0506/Cs50-Final-Project/tree/master/to_do_list/templates): it contains html file
  - [apps.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/apps.py): it contains the default configuration of the chat app
  - [consumer.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/consumer.py): it contains functions to run when a WebSocket  connect or disconnect to the server and when the server receive a message
  - [context_processors.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/to_do_list/context_processors.py): it contains 2 "global variable" and a "global form" which allow all templates to access them
  - [models.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/models.py): it contains 3 Models: 
    - `User`
    - `folder`: it contains title, creator and owner of the folder (p.s. owner can be more than one when a user is sharing his folder with other user, but the creator is only one)
    - `Page`: it contains the content and title of the note. Also, it has a field to know in which folder it is saved
  -  [urls.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/urls.py): it contains urls to:
      - go to the index (it is the default view when the user is already login, otherwise it will go to the login page)
      - login page where user can login
      - registerpage where user can register an account
      - logout page where user can logout
      - add note which means that users can have a new page to write notes
      - get note which means that users can get the content and the title of a page
      - update note which means that users can save their changes in our database
      - add folder which means that users can create a new folder 
      - delete note which means that users can delete a note
      - delete folder which means that users can delete a folder
      - rename folder which means that users can rename a folder
      - share folder which means that users can share a folder with other users
      - search user which means that users can search an user (by writing the firsts letters of the username of the user)
  -  [views.py](https://github.com/me50/LucaYan0506/blob/web50/projects/2020/x/capstone/chat/views.py): it contains functions that will run when the user call one of the urls mentioned above
- [requirements.txt](https://github.com/LucaYan0506/Cs50-Final-Project/blob/master/requirements.txt) which contains packages used for this project
## How to run your application:
Make sure that [python](https://www.python.org/downloads/), [pip](https://pip.pypa.io/en/stable/installation/) and [pipenv](https://pipenv.pypa.io/en/latest/install/) are installed  
#### set up virtual environment 
```
pipenv install django  
pipenv shell
pip install -r requirements.txt
```
#### create a superuser (optional)
```
python manage.py createsuperuser
```
#### run the app
```
python manage.py migrate
python manage.py runserver
```


## Special thanks
Brian Yu, David J. Malan and all the staff of CS50.
