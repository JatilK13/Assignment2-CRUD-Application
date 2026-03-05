import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>TMU Event Planner</h1>
        <p>The central hub to set up, manage, and discover school-wide events. Get involved and make the most of your campus experience.</p>
      </header>

      <section className="action-cards-container">
        <div className="action-card create-card">
          <div className="card-content">
            <h2>Host an Event</h2>
            <p>Have a great idea? Start planning and bring your campus event to life.</p>
          </div>
          <button 
            className="btn primary-btn" 
            onClick={() => navigate('/create')}
          >
            Create Event
          </button>
        </div>

        <div className="action-card browse-card">
          <div className="card-content">
            <h2>Discover Events</h2>
            <p>See what's happening around campus this week and RSVP to join the fun.</p>
          </div>
          <button 
          className="btn secondary-btn"
          onClick={() => navigate('/events')}
          
          >View Events</button>
        </div>
      </section>

      <section className="featured-section">
        <h3 className="section-title">Featured Activities</h3>
        <div className="gallery-grid">
          
          <div className="feature-card">
            <div className="image-wrapper">
              <img 
                src="https://www.torontomu.ca/content/dam/recreation/activity/intramural/dodgeball_rsz.jpg" 
                alt="Students playing Dodgeball" 
              />
              <span className="category-badge">Sports</span>
            </div>
            <div className="feature-info">
              <h4>Intramural Dodgeball</h4>
              <p>Join the weekly drop-in games at the main quad.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="image-wrapper">
              <img 
                src="https://www.torontomu.ca/content/dam/news-events/news/2023/08/web-orientation1.jpg" 
                alt="Outdoor Concert" 
              />
              <span className="category-badge">Live Music</span>
            </div>
            <div className="feature-info">
              <h4>Campus Fest Concert</h4>
              <p>Kick off the semester with live music and food trucks.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="image-wrapper">
              <img 
                src="https://www.torontomu.ca/content/dam/student-life-and-learning/slc/Picture1-min.png" 
                alt="Students at a Conference" 
              />
              <span className="category-badge">Academic</span>
            </div>
            <div className="feature-info">
              <h4>Tech Innovation Panel</h4>
              <p>Network with alumni and industry leaders in tech.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>These are just a few of the events you can be a part of. <strong>Get involved today!</strong></p>
      </footer>
    </div>
  );
};

export default HomePage;