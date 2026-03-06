import { useEffect, useState } from "react";
import "./ViewEvents.css";
import { useNavigate } from "react-router-dom";

function ViewEvents() {

    const [events, setEvents] = useState([]);

    // to navigate between pages using react router
    const navigate = useNavigate();
// use effect runs once the page loads and the backend api is called to get all events from MongoDB
    useEffect(() => {
        fetch("http://localhost:8080/api/events")
        .then(res => res.json())
        .then(data => setEvents(data))
        .catch(err => console.error(err));

    }, [] 
    );


    // delete event

    const handleDelete = (eventID) => {

      // calling the backend delete route
      fetch(`http://localhost:8080/api/events/eventID/${eventID}`, {
        method: "DELETE"
      })
        .then(() => {
  
          // remove the deleted event from ui
          setEvents(events.filter(event => event.eventID !== eventID));
  
        })
        .catch(err => console.error(err));
    };

    // edit event

    const handleEdit = (eventID) => {

      // temporary for now
      navigate(`/create?edit=${eventID}`);
  
    };










    return (
        <div className="events-container">
    
          <div className="events-wrapper">
    {/* this will button will take the user back to homepage    */}
            <button 
              className="back-btn"
              onClick={() => navigate("/")}>
              Back to Home
            </button>
    
            <h1 className="events-title">Campus Events</h1>
    
            <div className="events-grid">
    
    {/* creating cards for each event */}
              {events.map(event => (
                <div key={event._id} className="event-card">
    
                  <h2 className="event-title">{event.title}</h2>
    
                  <p className="event-location">
                    {event.location}
                  </p>
    
                  <p className="event-time">
                    {event.startTime} - {event.endTime}
                  </p>
                  <p className="event-date">
                    {new Date(event.date).toLocaleDateString()}
                  </p>


              {/* edit and delete button */}
              <div className="event-buttons">

                <button
                className="edit-btn"
                onClick={() => handleEdit(event.eventID)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(event.eventID)}>
                  Delete
                </button>

              </div>

                
    
                </div>
              ))}
    
            </div>
    
          </div>
    
        </div>
      );
    }
export default ViewEvents;
