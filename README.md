# CPS630 - Assignment 3
### Group 16: Sarthak Banglorewala, Param Chauhan, Balraj Grewal, Jatil Kapadia

## Overview

This Final project was developed to create a webpage where users can create, edit, and delete TMU campus events. The goal for this project was provide TMU students with a visually-appealing and friendly interface to reserve campus areas for events. 

The application demonstrates client-server communication through a REST API that allows users to GET, POST, UPDATE, and DELETE events. To store the events, a MongoDB database was used to hold all data and information important to each event. Furthermore, this application contains user login and authentication functionality, allowing for multiple users to login and have their own data. Alongside this, the application uses socket.io to implement an event update/delete/create notification system and real-time communication between clients and server. Finally, the UI of the application was modified to ensure it followed the Nielsen usability principles.


## Documentation: How to Run the Project

1. Install Node.js and MongoDB if not already installed (use mongodb://localhost:27017 for this project)

2. Clone repository
```shell
https://github.com/JatilK13/Assignment2-CRUD-Application.git
```

3. Navigate to the project directory

4. cd to "backend"

4. Install project dependencies
```shell
npm install
```

5. cd back to project directory and then cd to "frontend" 

6. Install project dependencies
```shell
npm install
```

6. Start backend (must be in "backend" directory)
```shell
npm run start
```

7. Start frontend (must be in "frontend" directory)
```shell
npm run dev
```

8. Open your browser and go to:
```shell
http://localhost:5173/
```
## REFLECTION

This assignment helps us understand how a high-fidelity Mongo+Express+React+Node (MERN) application is built. We built off of our previous assignment, as this time we had to add user authentication to our application. To achieve this, we created a seperate Users mongoose model to store login information, and made new functions for the RestAPI to facilitate the login functionality, while also making use of sessionStorage to track whether the user is logged in or not. We also developed real time communication as instructed using Socket.io, allowing multiple clients to stay up to date by instantly reflecting event updates without requiring a page refresh. This included a notification system that would pop up for all users when a event is created, deleted, or changed. For the front end, the task was to create a nice looking user interface for the notification system and login page that also sucessfully connects to and displays any of the new RESTAPIs from the backend. There were also additional changes to styling for user experience and to ensure that the application followed the Nielsen usability principles discussed in class.

One challenge we faced during this assignment was getting familiar with using socket.io. Since it was a new technology to all of us, understanding how real-time communication works and how to set up event listeners/emit data was difficult at first, occasionally resulting in inconsistencies in how the updates were being shown on the UI. Despite these initial speed bumps, through testing, debugging, and clear communication, we were able to better understand how socket.io functioned and successfully implement the real-time features in our application.

Overall, this project has improved our understanding of high-fidelity MERN applications, giving us experience in developing authentication and real-time communication features.
