import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateEvent from './pages/CreateEvent';
import ViewEvents from './pages/ViewEvents';
import Login from './pages/Login';

const App = () => {

  // create a variable user to track if the user is logged in, setting the initial state as null to signify nobody is logged in
  const [user, setUser] = useState(null);
  
  // Create a protected route to prevent accessing other pages without being logged in
  const PR = ({children}) => {

    // If the user is not logged in, redirect them to the default page (the login page)
    if (!user) {
      return <Navigate to="/" replace />;
    }
    
    // Once the user has logged in, redirect them to the initial page that they were trying to access
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Set the default path to be the login page */}
        <Route path="/" element={<Login setUser={setUser}/>} />

        {/* Protected Route: Home Page */}
        <Route path="/home" element={
          <PR>
            <HomePage user={user} setUser={setUser} />
          </PR>
        } />

        {/* Protected Route: Create Event Page */}
        <Route path="/create" element={
          <PR>
            <CreateEvent user={user} />
          </PR>
        }/>

        {/* Protected Route: View Events Page */}
        <Route path="/events" element={
          <PR>
            <ViewEvents user={user} />
          </PR>
        }/>

        {/* If an invalid path is entered, redirect to the home page */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;