import React, { useEffect, useState } from 'react';
import './App.css';
import RecordingComponent from './RecordingComponent';

function App() {
  // State to store the WebSocket instance
  const [ws, setWs] = useState(null);
  // State to store messages received from the server
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    const newWs = new WebSocket('ws://localhost:6789');

    // Event handler for when the WebSocket connection opens
    newWs.onopen = () => {
      console.log('Connected to the server');
    };

    // Event handler for receiving messages from the WebSocket server
    newWs.onmessage = (event) => {
      console.log('Message from server:', event.data);
      // Update the message state with the received message
      setMessage(event.data);
    };

    // Event handler for any WebSocket errors
    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Update the WebSocket state with the new WebSocket instance
    setWs(newWs);

    // Clean up function: Close the WebSocket when the component unmounts
    return () => {
      newWs.close();
    };
  }, []); // Empty dependency array means this effect runs once on mount and never again

  return (
    <div>
      <h1>React WebSocket Client</h1>
      {/* Display the message received from the server, if any */}
      {message && <p>Message: {message}</p>}
      {/* Pass the WebSocket instance to the RecordingComponent as a prop */}
      <RecordingComponent ws={ws} />
    </div>
  );
}

export default App;



