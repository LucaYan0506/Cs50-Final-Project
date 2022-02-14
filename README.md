# Cs50-Final-Project
## Video: [CS50’s Web Programming with Python and JavaScript Final Project](https://www.youtube.com/watch?v=bTbj_oWgWD0)


For the final project of CS50 web programming with python and JavaScript I created a website using Django Rest Framework for the backend and HTML & CSS & JS for the backend.

The main purpose of the website is:
- write notes
- create a chatgroup and chat with other user
### Aditional Features
- Add table/checkbox on notes
- Print notes
- Add folder and separate notes in different folders
- Share notes with other user and edit it in the same time
- The admin of a group can promote and kick a member
- The admin of a group can rename a chatgroup
- Get a notification when there is a new message


## Distinctiveness and Complexity:
I believe that my web application is sufficiently distinct from the other projects in this course and more complex than those because I used channels to let users edit the same note page at same time and chat with each other. Also, I used django-encrypted-model-fields to encrypt some sinsitive data and make sure that people can't read db.sqlite without the permission.
## What’s contained in each file:

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


## Additional info:
