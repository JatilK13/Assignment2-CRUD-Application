const express = require('express');
const cors = require('cors');
const app = express();
const { default: mongoose } = require('mongoose');
const path = require('path');
const Event = require('./models/Event');

const PORT = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

app.use(cors());

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

// Array of test events to add to populate database
let event_library = [
  {eventID:"2476", title:"First-Year Mixer", date: new Date("2026-03-01"), startTime:"9:30", endTime:"10:30", location:"ILC Lounge"},
  {eventID:"7840", title:"Pick-up Basketball", date: new Date("2026-03-02"), startTime:"11:00", endTime:"13:00", location:"Kerr Hall Upper Gym"},
  {eventID:"5293", title:"Concert", date: new Date("2026-03-03"), startTime:"15:30", endTime:"16:00", location:"Kerr Quad"},
  {eventID:"6803", title:"Drop-In Volleyball", date: new Date("2026-03-04"), startTime:"10:30", endTime:"14:30", location:"Mac Court"},
  {eventID:"0116", title:"Yoga", date: new Date("2026-03-05"), startTime:"14:30", endTime:"16:00", location:"RAC Court 1"}
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

// Gets All Events 
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        console.error("Error Getting Events: ", error);
        res.status(500).json({error: "Unable to get the Events"});
    }
});

// Starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });