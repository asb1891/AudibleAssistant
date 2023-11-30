import React, { useEffect, useState } from 'react';
import './App.css';
import RecordingComponent from './RecordingComponent';
import ResponseComponent from './ResponseComponent';

function App() {
  // State to store the WebSocket instance
  const [ws, setWs] = useState(null);
  // State to store messages received from the server
  const [message, setMessage] = useState(null);

  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    const newWs = new WebSocket('ws://localhost:6789');

    // Event handler for when the WebSocket connection opens
    newWs.onopen = () => {
      console.log('Connected to the server');
    };

    newWs. onprompt = (event) => {
      console.log('Prompt from server:', event.data);
      setPrompt(event.data);
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

  const backgroundStyle = {
    backgroundColor: `#FFE4E1`,
  };
  const headerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with transparency
        padding: '10px 15px', // Space inside the bubble
        borderRadius: '20px', // Rounded corners
        maxWidth: '17%', // Maximum width of a bubble
        margin: '0 auto', // Space around each bubble
        wordWrap: 'break-word', 
        textAlign: 'center', 
  }

  return (
    <div style = {backgroundStyle}>
      <h1 style = {headerStyle}>Andrew's Chat</h1>
      {/* {message && <p>Message: {message}</p>} */}
      <RecordingComponent ws={ws} />
      <ResponseComponent prompt = {prompt} message={message}/> {/* Include the ResponseComponent */}
    </div>
  );
}

export default App;



