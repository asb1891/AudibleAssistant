import React, { useEffect, useState } from 'react';
import './App.css';
import RecordingComponent from './RecordingComponent';
import ResponseComponent from './ResponseComponent';
import LoginComponent from './LoginComponent';
import LogoutComponent from './LogoutComponent';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  // State to store the WebSocket instance
  const [ws, setWs] = useState(null);
  // State to store messages received from the server
  const [message, setMessage] = useState(null);

  const [prompt, setPrompt] = useState(null);

  const [responseData, setResponseData] = useState([])

  const { isAuthenticated } = useAuth0();

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
      console.log('App Console Log:', event.data); 
      const [prompt, response] = event.data.split('\n'); // Assuming the format "PROMPT: ... \n RESPONSE: ..."
        setResponseData(prevData => [...prevData, { prompt, response }]);
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
    backgroundColor: '#ffff'
  };
  // const headerStyle = {
  //   backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with transparency
  //       padding: '10px 15px', // Space inside the bubble
  //       borderRadius: '20px', // Rounded corners
  //       maxWidth: '17%', // Maximum width of a bubble
  //       margin: '0 auto', // Space around each bubble
  //       wordWrap: 'break-word', 
  //       textAlign: 'center', 
  // }

  const headerStyle = {
    maxWidth: '100px',
    height: 'auto',
  };

  const startRecording = () => {
    // Check if the WebSocket instance exists and is in the OPEN state
    if (ws && ws.readyState === WebSocket.OPEN) {
        
        // Send a message to the WebSocket server to start recording
        ws.send("start_recording");
    } else {
        // Log a message if the WebSocket is not connected
        console.log("WebSocket is not connected.");
    }
};


return (
  <div>
    {!isAuthenticated ? (
      // Show login component when not authenticated
      <main className="column">
        <h1>Auth0 Login</h1>
        <LoginComponent />
      </main>
    ) : (
      // Show main content when authenticated
      <div style={backgroundStyle}>
        {/* <h1 style={headerStyle}>Andrew's Chat</h1> */}
        <LogoutComponent />
        <RecordingComponent ws={ws} startRecording={startRecording} />
        <ResponseComponent responseData={responseData} prompt={prompt} message={message} />
      </div>
    )}
  </div>
);
}

export default App;

//   return (
//     <div style = {backgroundStyle}>
//       <h1 style = {headerStyle}>Andrew's Chat</h1>
//       <RecordingComponent ws={ws} startRecording={startRecording} />
//       <ResponseComponent responseData={responseData} prompt = {prompt} message={message}/> {/* Include the ResponseComponent */}
//     </div>
//   );
// }

// export default App;



