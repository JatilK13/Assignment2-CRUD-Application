import React, { useEffect, useState } from "react";
import socket from "../socket";
import "./NotificationContainer.css"

const NotificationContainer = () => {

  // Create state variable notifications to store notification, setNotifications to update state
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {

    // Listener for notifications, receives the data when triggered
    socket.on("notification", (data) => {

      // Generates id using timestamp for the notifications
      const id = Date.now();

      // Updates state and adds new notification object 
      setNotifications(prev => [...prev, { id, message: data.message }]);

      // Timeout notification after 3 sec
      setTimeout(() => {
        // Removes notification that matches the id
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    });

    // Removes listener when the component unmounts
    return () => socket.off("notification");
  }, []);

  // Returns notification object
  return (
    <div className="notification-container">

      {/* Loops through notifications */}
      {notifications.map(note => (

        // Creates a div for a notification, and displays notification
        <div key={note.id} className="notification">
          {note.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;