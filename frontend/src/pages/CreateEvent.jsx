import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

// Location Data
const LOCATION_DATA = [
  {
    title: 'ILC Lounge',
    img: 'https://www.torontomu.ca/content/dam/university-business-services/event-space-reservations/images/meeting-room-slider6.jpg',
    desc: 'The ICL (International Living/Learning Centre) is one of TMUs three residence buildings. What sets this building apart from the others is the lounge that is has on the first floor. This lounge can be booked for events!'
  },
  {
    title: 'Kerr Hall Upper Gym',
    img: 'https://tmubold.ca/images/2025/5/28/0D5A3677_ZsUFl.jpg',
    desc: "The Kerr Hall Upper Gym is one of the many gymnasiums that TMU has to offer. Unlike the RAC courts, the Kerr Hall Upper Gym is a triple gym, meaning it is composed of three smaller gymnasiums that can be separated by barriers. Due to this large space, its space can be booked and used for anything from sports to career fairs! "
  },
  {
    title: 'Kerr Quad',
    img: 'https://images.squarespace-cdn.com/content/v1/5b915520697a986a35b98805/1559065077683-ZZCJZH4KLD2H1ABZFAKR/Ryerson+University+Places+to+Picnic+Neary+Yonge-Dundas+Square.jpg',
    desc: "The Kerr Quad is one of TMU's most popular outdoor spots. Surrounded by the Kerr Hall building, the Kerr Quad is a green space that helps to bring life to the concrete that is Toronto. This space gets booked almost regularly, especially during frosh, to host concerts,food vendors, and games!"
  },
  {
    title: 'MAC Court',
    img: 'https://tmubold.ca/images/2024/1/25/0D5A2567.jpg',
    desc: 'The MAC (Mattamy Athletic Centre) Court is the most popular court TMU has to offer. What was once Maple Leaf Garden, is now where TMU hosts many of their sports games including basketball and volleyball. Lucky for students, this beautiful court can be more than just looked at, as it can be booked for nearly any kind of event!'
  },
  {
    title: 'RAC Courts',
    img: 'https://tmubold.ca/images/2021/7/28/RAC_1_Gym.jpg',
    desc: "The RAC (Recreate and Athletic Centre) is one of TMU's two gyms on campus. Alongside regular workout equipment, the gym has two basketball courts that can be booked to play different sports. Don't worry about equipment, if you book the court, we provide all of the equiment!"
  },
  {
    title: 'RCC',
    img: 'https://www.torontomu.ca/content/dam/the-creative-school-equipment-distribution-centre/facilities/multitrackcontrol.jpg',
    desc: "The RCC (Rogers Communication Centre) is the home of the School of Journalism here at TMU. With facilities from recording studios to photoshoot spaces, some of TMU's most unique technology is showcased here. That being said, it is more this just on display as it can be booked for your use!"
  },
  {
    title: 'SCC',
    img: 'https://theeyeopener.com/wp-content/uploads/2020/02/SCC_RyanDioso.jpg',
    desc: "The SLC (Sheldon & Tracy Levy Student Learning Centre) is one of the largest, most popular buildings on campus. It has 8 floors, each differently themed to students' needs. It also contains a large space known as the amphitheatre on the first floor that can be and is often booked out for events."
  },
  {
    title: 'TRSM Building',
    img: 'https://www.torontomu.ca/content/dam/tedrogersschool/trsm-images/2023-TRSM-building-exterior-1200x800.jpg',
    desc: 'The TRSM (Ted Rogers School of Management) building is the home to all of the business students here at TMU. Located nearly 200m from Sankofa Square, this space has many floors with limitless potential to host any events that you have in mind!'
  }
];

const CreateEvent = () => {
  const navigate = useNavigate();
  
  // 2. State for the form data
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: LOCATION_DATA[0].title
  });

  // 3. State to track which image we are currently starting from in the carousel
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsToShow = 3;

  // Carousel Handlers
  const nextSlide = () => {
    // Only go next if we aren't at the very end of the list
    if (carouselIndex < LOCATION_DATA.length - itemsToShow) {
      setCarouselIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    // Only go back if we aren't at the very beginning
    if (carouselIndex > 0) {
      setCarouselIndex(prev => prev - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Time Validation
    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        alert("Error: The event's End Time cannot be before or equal to the Start Time.");
        return; 
      }
    }

    // Generate a random 4-digit string for the eventID to satisfy the backend schema
    const generatedEventID = Math.floor(1000 + Math.random() * 9000).toString();

    // Combine our form data with the new ID
    const eventPayload = {
      ...formData,
      eventID: generatedEventID
    };

    try {
      const response = await fetch('http://localhost:8080/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload)
      });

      if (response.ok) {
        const savedEvent = await response.json();
        alert(`Success! Event "${savedEvent.title}" (ID: ${savedEvent.eventID}) was created.`);
        
        // Optional: Clear the form fields after successful submission
        setFormData({
          title: '',
          date: '',
          startTime: '',
          endTime: '',
          location: LOCATION_DATA[0].title
        });

      } else {
        // Handle validation errors sent back from the server (like the 400 status)
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to connect to the server. Make sure your Express backend is running on port 8080!');
    }
  };
  
  return (
    <div className="create-event-container">
      
      <div className="nav-container">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>

      <header className="page-header">
        <h1>Book an Event</h1>
        <p>Here at TMU, we take pride in our campus and encourage our students to use it as much as they can. Book various spaces around campus for free by filling out the form below!</p>
      </header>

      <section className="form-section">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            
            <div className="form-group full-width">
              <label htmlFor="title">Event Name</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="e.g., Co-op Info Session"
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date 🗓️</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location 📍</label>
                <select id="location" name="location" value={formData.location} onChange={handleChange} required>
                  {LOCATION_DATA.map(loc => (
                    <option key={loc.title} value={loc.title}>{loc.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Start Time </label>
                <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} min={formData.startTime} required />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary-btn submit-btn">Submit Event</button>
            </div>
            
          </form>
        </div>
      </section>

      {/* 4. Updated Carousel Section */}
      <section className="locations-preview">
        <h3 className="section-title">Explore Our Spaces</h3>
        
        <div className="carousel-wrapper">
          <button 
            className="carousel-btn prev-btn" 
            onClick={prevSlide} 
            disabled={carouselIndex === 0}
          >
            &#10094; {/* Left Arrow HTML entity */}
          </button>

          <div className="carousel-grid">
            {/* We slice the array to only show 3 items at a time based on our current index */}
            {LOCATION_DATA.slice(carouselIndex, carouselIndex + itemsToShow).map((loc) => (
              <div className="preview-card fade-in" key={loc.title}>
                <img src={loc.img} alt={loc.title} />
                <div className="preview-info">
                  <h4>{loc.title}</h4>
                  <p>{loc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="carousel-btn next-btn" 
            onClick={nextSlide} 
            disabled={carouselIndex === LOCATION_DATA.length - itemsToShow}
          >
            &#10095; {/* Right Arrow HTML entity */}
          </button>
        </div>
      </section>

    </div>
  );
};

export default CreateEvent;
