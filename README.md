# Easy Manager:

my project is a webapp for managing personal budget and setting events, memories and notes
the front end uses: HTML, CSS, Bootstrap and JavaScript
the backend uses: python, Django, celery for scheduling a task and rabbitmq as a message broker

  ## how to run:
  1. open 3 terminals from the root directory
  2. in the first one write ``` Python manage.py runserver ``` to run the web app
  3. in the second one write ``` celery -A myspace beat -l INFO ``` to start the celery beat 
  4.  in the third one write ``` sudo service rabbitmq-server start ``` to start the broker 
  5. in the third one write ``` celery -A myspace worker -l info --pool=solo ``` to start celery worker listening for messages

## Distinctiveness and Complexity:

my project is neither a social network nor an encommerce website it's mini management system. it has CRUD operations and has a celery task running periodically to send email using smtp server.

### File contents:
1. in the root directory "requirements.txt" containing all requirements to run the webapp
2. Inside myspace directory i created "celery.py" file to setup celery for the project to auto discover tasks
3. Inside "settings.py" file:
    1. I'm using <from decouple import config> to call environment variables
    2. i used :


    ```

      STATIC_URL = 'static/'
      MEDIA_ROOT = "space/media/"
      MEDIA_ROOT = os.path.join(BASE_DIR, 'space/media/')
      STATICFILES_DIRS = (os.path.join(BASE_DIR, "static"),)

    ```
        to setup a static directory and a media directory for the memories table in the models.py.
    3. i used:
    ```

      EMAIL_HOST = "smtp.gmail.com"
      EMAIL_PORT = "587"
      EMAIL_HOST_USER = "erenyaarmin5000@gmail.com"
      EMAIL_HOST_PASSWORD = config("EMAIL_KEY")
      EMAIL_USE_TLS = True

    ```
        to setup the smtp server.
    4. i used:
    ```

          CELERY_BEAT_SCHEDULE = {
          "schedueled_task": {
              "task": "space.tasks.send",
              "schedule": 5.0
          }
      }

    ```
    to setup the schedule for the celery beat.
4. Inside urls.py:
  1. I used 
   ``` 

    path('', include("space.urls"))
  
   ```
   to add my app urls.
  2. I used 
    ```

      static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    ```
    to add the url for the media url.
5. Inside the space directory
  1.  in "models.py" file i created the folllowing models:
    1. User inhereting from Abstract user
    2. Goals having: 
      - user_id a foreign key to the id in the USER table
      - title, details (char)
      - total (int) : the total amount required to reach the goal
      - price (int) : the remaining amount to reach the goal
      - status (boolean) : whether the goal is achieved or not
      - end_date (date) : the date the user wants to reach the goal before
    3. Debts having:
      - user_id a foreign key to the id in the USER table
      - title (char)
      - total (int) : the total amountof the debt
      - amount (int) : the remaining amount to fulfil the debt
      - due_date (date) : the date to pay the debt
    4. Income having:
      - user_id a foreign key to the id in the USER table
      - title (char)
      - amount (int) : the amount of the income
      - frequency (char) : the frequency of the income
      - due_date (date) : the date of recieving an income
    5. Expense having:
      - user_id a foreign key to the id in the USER table
      - title (char)
      - price (int) : the amount of the expense
      - category (char) : the category
      - date (date) : set auotomatically to the time the expense is added
    6. Events having:
      - user_id a foreign key to the id in the USER table
      - title (char)
      - info (char) : the details
      - date (datetime) : the time of the event used to send email notification about the event one day before
      - sent (boolean) : becomes True after the user is notified about the event
    7. Memories having:
      - user_id a foreign key to the id in the USER table
      - title, details (char)
      - file (image) : contains the url for the image from the media directory
    8. Notes having:
      - user_id a foreign key to the id in the USER table
      - title, details (char)
  2. Inside "tasks.py" file i wrote the function "send" to check if the user has any event tommorrow and send an email to the user to notify him.
  3. Inside "urls.py" file i included all urls for my app
  4. Inside "views.py" file i wrote all my views including:
    - index view to display the budget section of the app from index.html
    - login for logging users in
    - logout for logging users out
    - register for signning users up
    - show which takes an argument(topic) to display that topic content to the user 
    - add_goal adds goals to the Goals model 
    - add_income adds goals to the Income model 
    - add_debt adds debts to the Debt model
    - add_expense adds expenses to the Expense model
    - edit it's an api that takes 2 arguments (id: refering to the id in the respective table. And topic: refering to the model the user is editting from ) and recieves a json containning the data to apply to the model 
    - delete it's an api that takes 2 arguments (id: refering to the id in the respective table. And topic: refering to the model the user is editting from )and deletes that entry from the database.
    - change_password to change the user's password
    - balance to edit the user's balance
    - notes which adds to the Notes model and displays user's notes
    - memories which adds to the Notes model and displays user's memories
    - events which adds to the Notes model and displays user's events
  5. Inside the "static/space/" directory:
    1. index.js: it contains multiple functions as follows
      - addgoal: it shows or hides the form to add goals
      - addincome: it shows or hides the form to add incomes
      - adddebt: it shows or hides the form to add debts
      - addexpense: it shows or hides the form to add expenses
      - it takes an argument (topic) and displays the content div from "index.html" and calls fetch with GET request and fills the content with the desired topic
      - editGoal(id, title, details, price, date, topic):
        1. id : refering to the id of the entry from the models to be edited
        2. title : the title of the entry
        3. details: the details of the entry
        4. price : incase of editing a goal, income, or a debt
        5. date : the date associated with the topic entry
        6. topic : refering to the model to which the editting will be be applied
        7. it takes those arguments and calls fetch with PUT request to the edit view in "views.py" to apply the changes to the database
      - Delete(id, topic):
        1. id : refering to the id of the entry from the models to be deleted
        2. topic : refering to the model to which the editting will be be applied
        3. it deletes the specified entry from the specified model(topic)
      - saveGoal(id, price, topic):
        1. id : refering to the id of the entry from the models to be edited
        2. price : the amount the user saved for the goal
        3. topic : refering to the model to which the editting will be be applied
        4. it takes those arguments and calls fetch with PUT request to the edit view to apply the changes to the database
      - mark_income(id, topic, date, income):
        1. id : refering to the id of the entry from the models to be deleted
        2. topic : refering to the model to which the editting will be be applied
        3. date :  the date of the recieved income and it's update to the new date depending on the frequency of the income
        4. income : the income card collected by ``` queryselector(`#income_card${id}`) ``` to be hidden if income's frequency is once
      - note_delete(id, topic):
        1. id : refering to the id of the entry from the models to be deleted
        2. topic : refering to the model to which the editting will be be applied
        3. t deletes the specified entry from the specified model(topic)
    2. styles.css: contains the styling i wrote myself. the rest is mainly bootstrap styling
  6. Inside the "template/space/" directory:
    1. layout.html : the main layout that the rest of the pages extend from
    2. login.html : page for logging users in
    3. register.html : page containing a register form to sign users up
    4. index.html : shows the budget section of the app if the user is logged in otherwise it prompts the user to either login or register
    5. balance.html : containing a form allowing the user to either add to his balance or to adjust his initial balance
    6. pass.html : containing a form to change the user's password
    7. events.html : containing a form to add events and displaying the user's events
    8. memo.html : containing a form to add memories and displaying the user's memories
    9. notes.html : containing a form to add notes and displaying the user's note 
  7. media directory containing the images for the Memories model