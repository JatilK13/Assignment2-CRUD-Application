import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { useNavigate } from 'react-router-dom';
import './ViewEvents.css';

//locations for update
const LOCATIONS = [
  'ILC Lounge', 'Kerr Hall Upper Gym', 'Kerr Quad', 'MAC Court', 
  'RAC Court 1', 'RAC Court 2', 'RCC', 'SCC', 'SLC Amphitheatre', 'TRSM Building'
];


//set use state for current search fields

const ViewEvents = ({user}) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchId, setSearchId] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '', date: '', startTime: '', endTime: '', location: ''
  });

  const API_URL = 'http://127.0.0.1:8080/api/events';

  useEffect(() => {
    fetchAllEvents();
    // real time listeners
    socket.on("eventCreated", (event) => {
      setEvents(prev => [...prev, event]);
    });
  
    socket.on("eventDeleted", (eventID) => {
      setEvents(prev => prev.filter(e => e.eventID !== eventID));
    });
  
    socket.on("eventUpdated", (event) => {
      setEvents(prev =>
        prev.map(e => e.eventID === event.eventID ? event : e)
      );
    });
  
    return () => {
      socket.off("eventCreated");
      socket.off("eventDeleted");
      socket.off("eventUpdated");
    };
  }, []);
  const fetchAllEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all events by the logged in user
  const fetchUserEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch (`${API_URL}/user/${user}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error(`No events created by ${user}`);
        throw new Error (`Failed to fetch ${user}'s events`)
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //search by ID
  const handleSearchById = async (e) => {
    e.preventDefault();
    if (!searchId) {
      setError("No ID has been entered");
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/eventID/${searchId}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error(`No event found with ID: ${searchId}`);
        throw new Error('Failed to search by ID');
      }
      const data = await response.json();
      setEvents([data]); 
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  //search by location
  const handleSearchByLocation = async (e) => {
    e.preventDefault();
    if (!searchLocation) {
      setError("No location has been selected");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/search?location=${searchLocation}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error(`No events found at the ${searchLocation}`);
        throw new Error('Failed to search by location');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Search by username
  const handleSearchByUsername = async (e) => {
    e.preventDefault();
    if(!searchUsername) {
      setError('No username has been entered');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/user/${searchUsername}`);
      if (!response.ok) {
        throw new Error('Failed to search by user');
      }

      const data = await response.json();
      if(data.length === 0) {
        throw new Error(`No events created by ${searchUsername}`);
      }
      setEvents(data);
    } catch(err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Search by title
  const handleSearchByTitle = async (e) => {
    e.preventDefault();
    if(!searchTitle) {
      setError('No title has been entered');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/search/title?title=${searchTitle}`);
      if(!response.ok) {
        const errorData = await response.json();
        if(errorData.error === "No events found with this title") {
          throw new Error(`No events titled ${searchTitle}`);
        }
        throw new Error('Failed to search by title');
      }

      const data = await response.json();

      if(data.length === 0) {
        throw new Error(`No events titled ${searchTitle}`);
      }
      setEvents(data);
    } catch(err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  //Update editing
  const startEditing = (ev) => {
    setEditingId(ev.eventID);
    setEditFormData({
      title: ev.title,
      date: ev.date ? ev.date.split('T')[0] : '', 
      startTime: ev.startTime,
      endTime: ev.endTime,
      location: ev.location
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (eventID) => {
    if (editFormData.startTime && editFormData.endTime) {
      if (editFormData.endTime <= editFormData.startTime) {
        alert("Error: End Time cannot be before Start Time.");
        return; 
      }
    }

    try {
      const response = await fetch(`${API_URL}/eventID/${eventID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...editFormData, username: user})
      });

      if (!response.ok) throw new Error('Failed to update event');
      
      const updatedEvent = await response.json();
      setEvents(events.map(ev => ev.eventID === eventID ? updatedEvent : ev));
      setEditingId(null); 
      
    } catch (err) {
      alert(err.message);
    }
  };


  //Delete Event
  const handleDelete = async (eventID) => {
    if(!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await fetch(`${API_URL}/eventID/${eventID}`, { 
        method: 'DELETE',
        headers: {'content-Type' : 'application/json'},
        body: JSON.stringify({ username: user})
      });
      if (!response.ok) throw new Error('Failed to delete');
      setEvents(events.filter(ev => ev.eventID !== eventID));
    } catch (err) {
        alert(err.message);
    }
  }

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="view-events-container">
      <div className="nav-container-view">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back to Home
        </button>
        <button className="back-btn" onClick={() => navigate('/create')}>
          Go to Create Events →
        </button>
      </div>

      <header className="page-header">
        <h1>Discover Events</h1>
        <p>Browse all upcoming campus events, or search for something specific.</p>
      </header>

      {/* Create Search Bar with presets */}

      <section className="search-toolbar">

        {/* Search by ID */}
        <form onSubmit={handleSearchById} className="search-group">
          <input 
            type="text" 
            placeholder="Search by Event ID (e.g., 2476)" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button type="submit" className="btn secondary-btn">Find ID</button>
        </form>

        {/* Search by Location */}
        <form onSubmit={handleSearchByLocation} className="search-group">
          <select onChange={(e) => setSearchLocation(e.target.value)} value={searchLocation}>
            <option value="">Select a Location</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <button type="submit" className="btn secondary-btn">Find Location</button>
        </form>

        {/* View All Events */}
        <button onClick={fetchAllEvents} className="btn primary-btn clear-btn">
          View All Events
        </button>

        {/* Search by Username */}
        <form onSubmit={handleSearchByUsername} className="search-group">
          <input 
            type="text" 
            placeholder="Search by Username" 
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
          <button type="submit" className="btn secondary-btn">Find Username</button>
        </form>

        {/* View My Events */}
        <form onSubmit={handleSearchByTitle} className="search-group">
          <input
            type="text"
            placeholder="Search by Event Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <button type="submit" className="btn secondary-btn">
            Find Title
          </button>
        </form>

        {/* View My Events */}
        <button onClick={fetchUserEvents} className="btn primary-btn clear-btn">
          View My Events
        </button>

      </section>

      {loading && <p className="status-msg">Loading events</p>}
      {error && <p className="status-msg error-msg">{error}</p>}
      {!loading && !error && events.length === 0 && (
        <p className="status-msg">No events found.</p>
      )}

      <section className="events-grid">
        {events.map((ev) => (
          <div className="event-detail-card" key={ev.eventID}>
            <div className="card-header">
              <span className="event-id-badge">ID: {ev.eventID}</span>
              {user === ev.username && (
                <button className="text-link delete-link" onClick={() => handleDelete(ev.eventID)}>Delete</button>
              )}
            </div>
            
            <div className="card-body">
              {editingId === ev.eventID ? (
                <div className="edit-mode-form">
                  <input type="text" name="title" value={editFormData.title} onChange={handleEditChange} className="edit-input main-title-edit" placeholder="Event Title"/>
                  
                  
                  {/* Create Edit Fields*/}
                  <div className="edit-grid">
                    <div>
                      <label>Date</label>
                      <input type="date" name="date" value={editFormData.date} onChange={handleEditChange} className="edit-input" />
                    </div>
                    <div>
                      <label>Location</label>
                      <select name="location" value={editFormData.location} onChange={handleEditChange} className="edit-input">
                        {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                    <div>
                      <label>Start Time</label>
                      <input type="time" name="startTime" value={editFormData.startTime} onChange={handleEditChange} className="edit-input" />
                    </div>
                    <div>
                      <label>End Time</label>
                      <input type="time" name="endTime" value={editFormData.endTime} onChange={handleEditChange} className="edit-input" />
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button onClick={() => handleSaveEdit(ev.eventID)} className="save-btn">Save</button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="title-row">
                    <h2 className="event-title">{ev.title}</h2>
                    {user === ev.username && (
                      <button className="text-link edit-link" onClick={() => startEditing(ev)}>Edit</button>
                    )}
                  </div>
                  <div className="event-info">
                    <p><strong>Username:</strong> {ev.username}</p>
                    <p><strong>Date:</strong> {formatDate(ev.date)}</p>
                    <p><strong>Time:</strong> {ev.startTime} - {ev.endTime}</p>
                    <p><strong>Location:</strong> {ev.location}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ViewEvents;