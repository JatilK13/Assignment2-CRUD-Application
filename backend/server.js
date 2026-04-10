const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);

// start socket.io server and allow communication with frontend using cors
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const { default: mongoose } = require('mongoose');
const path = require('path');
const Event = require('./models/Event');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const PORT = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

app.use(cors());
app.use(express.json());

// handles real time client connection using socket
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/events_database`;
mongoose.connect(dbURL);

// Checks if database connection was successful or not and returns message
const db = mongoose.connection;
db.on('error', function(e) {
    console.log('error connecting' + e);
});
db.on('open', function() {
    console.log('database connected!');
});

// Array of test events to add to populate database (Added username: "admin" so it doesn't crash)
let event_library = [
  {eventID:"2476", title:"First-Year Mixer", date: new Date("2026-03-01"), startTime:"9:30", endTime:"10:30", location:"ILC Lounge", username: "admin"},
  {eventID:"7840", title:"Pick-up Basketball", date: new Date("2026-03-02"), startTime:"11:00", endTime:"13:00", location:"Kerr Hall Upper Gym", username: "admin"},
  {eventID:"5293", title:"Concert", date: new Date("2026-03-03"), startTime:"15:30", endTime:"16:00", location:"Kerr Quad", username: "admin"},
  {eventID:"6803", title:"Drop-In Volleyball", date: new Date("2026-03-04"), startTime:"10:30", endTime:"14:30", location:"Mac Court", username: "admin"},
  {eventID:"0116", title:"Yoga", date: new Date("2026-03-05"), startTime:"14:30", endTime:"16:00", location:"RAC Court 1", username: "admin"}
]


// Function to add test events to MongoDB, creating database and entries if not already existing
async function addTestEventsToMongoDB() {
  const eventCount = await Event.countDocuments();

  if (eventCount === 0) {
      console.log('Adding test events to db ...');

      event_library.forEach(event => {
          const newEvent = new Event(event);
          newEvent.save()
              .then(() => console.log('Event added with ID ' + event.eventID))
              .catch(err => console.error('Error adding event with ID ' + event.eventID + ' ' + err));
      });
  }
  else {
      console.log('Events already exist. Not adding test events.')
      return;
  }
}

// Calls function to populate database
addTestEventsToMongoDB();

/*** SERVER READ (PUBLIC) ***/
// Gets ALL Events for the public "Discover Events" page
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        console.error("Error Getting Events: ", error);
        res.status(500).json({error: "Unable to get the Events"});
    }
});

/*** SERVER READ (PRIVATE) ***/
// Gets only the events created by a specific user for My Events
app.get('/api/events/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const events = await Event.find({ username: username });
        res.status(200).json(events);
    } catch (error) {
        console.error("Error Getting User Events: ", error);
        res.status(500).json({error: "Unable to get the Events"});
    }
});

/*** SERVER READ ***/
// Gets an Event by eventID 
// Returns a json object with the event that matches the eventID
app.get('/api/events/eventID/:eventID', async (req, res) => {
    try {
        // Get eventID from request
        const { eventID } = req.params;

        // Get Event with eventID from database
        const event = await Event.findOne({ eventID: String(eventID) });
        
        // If there is no event with the eventID, return error
        if (!event) {
            return res.status(404).json({error: "Event not found"});
        }

        // Json status code for successful get
        res.status(200).json(event);

    } catch (error) {
        res.status(500).json({ error: "Failed to Get Event" });
    }
});

/*** SERVER READ ***/
// Returns a json object with all the events that match the location (can be multiple)
app.get('/api/events/search', async (req, res) => {
    try {
        // Get location from request
        const eventLocation  = req.query.location;
    
        // If there is no location, return error status message
        if (!eventLocation) {
            return res.status(400).json({ error: "Location query parameter is required" });
        }

        // Get all events that match the location in database
        const events = await Event.find({location: {$regex: eventLocation, $options: 'i' }});

        // if there are no events with the location, return appropriate error status code
        if (events.length === 0) {
            return res.status(404).json({error: "No Events Found for this Location"});
        }

        // Json status code for successful get
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({error: "Failed to Search for Events"});
    }
});

/*** SERVER READ ***/
// Returns a json object with all the events that match a specific date
app.get('/api/events/search/date', async (req, res) => {
    try {
        // Get the date from the request query 
        const queryDate = req.query.date;
    
        if (!queryDate) {
            return res.status(400).json({ error: "Date query parameter is required (Format: YYYY-MM-DD)" });
        }
        
        // Create a date range to cover the entire day (avoids exact timestamp/timezone misses)
        const startDate = new Date(queryDate);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        // Find events where the date is greater than/equal to the start of the day, and strictly less than the next day
        const events = await Event.find({
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        if (events.length === 0) {
            return res.status(404).json({ error: "No events found for this date" });
        }

        res.status(200).json(events);
    } catch (error) {
        console.error("Error searching by date: ", error);
        res.status(500).json({ error: "Failed to search for events by date" });
    }
});

/*** SERVER DELETE ***/
// Delete Event (Protected: Only Owner Can Delete)
app.delete('/api/events/eventID/:eventID', async (req, res) => {
    try {
        const { eventID } = req.params;
        const { username } = req.body; // Grab the username from the request body

        const deleted = await Event.findOneAndDelete(
            { eventID: String(eventID), username: username } // Must match ID AND Owner
        );

        if (!deleted) {
            return res.status(403).json({ error: "Unauthorized: You can only delete your own events."});
        }

        //res.status(204).send();
        // notify clients that an event was deleted
        io.emit("eventDeleted", eventID);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to Delete Event"});
    }
});

/*** SERVER CREATE ***/
// Create Event (Protected: Requires Username)
app.post('/api/events', express.json(), async (req, res) => {
    console.log("Incoming Data from React:", req.body);
    try {
        // Separate and store each field from the request body
        const {eventID, title, date, startTime, endTime, location, username} = req.body;

        // Validate all of the fields have data entered
        if(!eventID || !title || !date || !startTime || !endTime || !location || !username) {
            return res.status(400).json({ error: 'All fields, including a username, are required'});
        }

        // Check that the start time is before the end time
        let startTimeNum = Number(startTime.split(':').join(''));
        let endTimeNum = Number(endTime.split(':').join(''));
        if(startTimeNum > endTimeNum) {
            return res.status(400).json({ error: 'The Start Time must be before the End Time'});
        }

        // Create a new event containing the fields extracted from the request body
        const newEvent = new Event({
            eventID: String(eventID),
            title: title,
            date: date,
            startTime: startTime,
            endTime: endTime,
            location: location,
            username: username
        });

        // Save the newly created event to the MongoDB
        const createdEvent = await newEvent.save();

        // Return the newly created event
       // res.status(201).json(createdEvent);
       // notify client that an event was created
       io.emit("eventCreated", createdEvent);

       // Notification
       io.emit("notification", {
        message: `New event create: ${createdEvent.title}`
       });

       res.status(201).json(createdEvent);
    }
    catch(e) {
        console.error(e)
        res.status(500).json({error: 'Failed to create event. ' + e})
    }
});

/*** SERVER UPDATE ***/
// Update Any Event Field (Protected: Only Owner Can Edit)
app.patch('/api/events/eventID/:eventID', async (req, res) => {
    try {
        const eventID = req.params.eventID;
        const { title, date, startTime, endTime, location, username } = req.body;

        const updatedEvent = await Event.findOneAndUpdate(
            { eventID: String(eventID), username: username }, // Must match ID AND Owner
            { 
                title: title,
                date: date,
                startTime: startTime,
                endTime: endTime,
                location: location 
            },
            { returnDocument: 'after' } 
        );

        if (!updatedEvent) {
            return res.status(403).json({error: 'Unauthorized: You can only edit your own events.'});
        }
        
        //res.status(200).json(updatedEvent);
        // notify clients that am event was updated
        io.emit("eventUpdated", updatedEvent);
        res.status(200).json(updatedEvent);
    }
    catch (e) {
        res.status(500).json({error: 'Could not update Event'});
    }
});

/*** USER AUTHENTICATION ROUTES ***/
// Register a New User
app.post('/api/users/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken. Please choose another.' });
        }

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const newUser = new User({
            username: username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login an Existing User
app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // If successful, send back the username so React knows who is logged in
        res.status(200).json({ 
            message: 'Login successful', 
            username: user.username 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

// Starts server
//app.listen(PORT, () => { console.log("Server started on port: " + PORT) });
server.listen(PORT, () => {
    console.log("Server started on port: " + PORT);
});