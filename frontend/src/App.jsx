import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateEvent from './pages/CreateEvent';
import ViewEvents from './pages/ViewEvents';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/events" element={<ViewEvents />} />
      </Routes>
    </Router>
  );
};

export default App;