import React, { useEffect, useState } from "react";
import socket from "../socket";

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("notification", (data) => {
      const id = Date.now();

      // add notification
      setNotifications(prev => [...prev, { id, message: data.message }]);

      // remove after 3 sec
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    });

    return () => socket.off("notification");
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999
    }}>
      {notifications.map(note => (
        <div key={note.id} style={{
          background: "#333",
          color: "white",
          padding: "10px 15px",
          marginBottom: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
        }}>
          {note.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;