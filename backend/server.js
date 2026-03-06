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
app.use(express.json());

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

// *** SERVER READ ***
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

/*** SERVER READ ***/
// Gets all Events 
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        console.error("Error Getting Events: ", error);
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

/*** SERVER DELETE ***/
// Delete Event by eventID
app.delete('/api/events/eventID/:eventID', async (req, res) => {

    try {

        // gets eventID from request
        const { eventID } = req.params;

        // Finds event with eventID in the database and deletes it
        const deleted = await Event.findOneAndDelete(
            { eventID: String(eventID) }
        );

        // If there was no event with the specified eventID, return error status code
        if (!deleted) {
            return res.status(404).json({ error: "Event not Found"});
        }

        // Sends succesful status code for delete
        res.status(204).send();

    } catch (error) {
        res.status(500).json({ error: "Failed to Delete Event"});
    }
});

/*** SERVER CREATE ***/
// Create Event
app.post('/api/events', express.json(), async (req, res) => {
    console.log("Incoming Data from React:", req.body);
    try {
        // Separate and store each field from the request body
        const {eventID, title, date, startTime, endTime, location} = req.body;

        // Validate all of the fields have data entered
        if(!eventID || !title || !date || !startTime || !endTime || !location) {
            return res.status(400).json({ error: 'The ID, Title, Date, Start Time, End Time, and Location of the event are required'});
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
            location: location
        });

        // Save the newly created event to the MongoDB
        const createdEvent = await newEvent.save();

        // Return the newly created event
        res.status(201).json(createdEvent);
    }
    catch(e) {
        console.error(e)
        res.status(500).json({error: 'Failed to create event. ' + e})
    }
});

/*** SERVER UPDATE ***/
// Create Event
app.patch('api/events/title/:title', express.json(), async (req, res) => {
    try {
        // Get the ID and store it
        const eventID = req.params.eventID

        // Get the title and store it
        const {title} = req.body;

        // update the event and return the updated book
        const updatedEvent = await Event.findOneAndUpdate(
            {eventID: String(eventID) },
            {title: title},
            {new: true}
        )

        // If the event does not exist return an error
        if (!updatedEvent) {
            return res.status(404).json({error: 'Event not found'});
        }
        // Send the updated book in json format
        res.status(200).json(updatedEvenet);
    }
    
    catch (e) {
        res.status(500).json({error: 'Could not update Event'});
    }
});

// Starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });