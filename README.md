# CPS630 - Assignment 2
### Group 16: Sarthak Banglorewala, Param Chauhan, Balraj Grewal, Jatil Kapadia

## Overview

This MERN project was developed to create a webpage where users can create, edit, and delete TMU campus events. The goal for this project was provide TMU students with a visually-appealing and friendly interface to reserve campus areas for events. 

The application demonstrates client-server communication through a REST API that allows users to GET, POST, UPDATE, and DELETE events. To store the events, a MongoDB database was used to hold all data and information important to each event.

Future expansion of this project could involve:

- Adding User Authentication
- Preventing  Booking Conflicts


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

This assignment helps us understand how a Mongo+Express+React+Node (MERN) application works. We built off of our previous assignment, as this time we had to implement a MongoDB. From a backend perspective, we had to connect to a MongoDB database, develop a test function that adds test data to the database, and develop a RestAPI to connect the frontend to the backend and allows for creating, reading, updating, and deleting items. For the front end, the task was to create a nice looking user interface to successfully connect to and display the RestAPIs from the backend. 

One challenge that we faced was converting our old makeshift database to a MongoDB database. Some of the CRUD operations were slightly different to implement, which resulted in a different subsequent user interface to go along with it. We had some issues coordinating this new backend with the frontend at first, but with good communication we were able to get the hang of it.

Overall, this project has improved our understanding of MERN applications, giving us experience with developing CRUD operations in a team.
