import React, { useEffect, useState } from "react";
import "./App.css";
import RecordingComponent from "./RecordingComponent";
import ResponseComponent from "./ResponseComponent";
import LoginComponent from "./LoginComponent";
import LogoutComponent from "./LogoutComponent";
import { useAuth0 } from "@auth0/auth0-react";
import "./index.css";
// import Sidebar from "./Sidebar";
import Header from "./Header";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import About from "./About";
// import RoutesComponent from "./RoutesComponent";

function App() {
  // State to store the WebSocket instance
  const [ws, setWs] = useState(null);
  // State to store messages received from the server
  const [message, setMessage] = useState(null);

  // const [prompt, setPrompt] = useState("hello");

  const [responseData, setResponseData] = useState([]);

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    const newWs = new WebSocket("ws://localhost:6789");
    // Event handler for when the WebSocket connection opens
    newWs.onopen = () => {
      console.log("Connected to the server");
    };
    // newWs.onprompt = (event) => {
    //   console.log("Prompt from server:", event.data);
    //   setPrompt(event.data);
    // };
    // Event handler for receiving messages from the WebSocket server
    // newWs.onmessage = (event) => {
    //   console.log("App Console Log:", event.data);
    //   const [prompt, response] = event.data.split("\n"); // Assuming the format "PROMPT: ... \n RESPONSE: ..."
    //   setResponseData((prevData) => [...prevData, { prompt, response }]);
    //   // Update the message state with the received message
    //   setMessage(event.data);
    // };
    // Event handler for any WebSocket errors
    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    // Update the WebSocket state with the new WebSocket instance
    setWs(newWs);

    // Clean up function: Close the WebSocket when the component unmounts
    return () => {
      newWs.close();
    };
  }, []); // Empty dependency array means this effect runs once on mount and never again

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
    <div className={isAuthenticated ? "background-style" : "login-style"}>
      {!isAuthenticated ? (
        <main className="column">
          <h1 className="h1-style">Welcome to Audible Assistant</h1>
          <LoginComponent />
          <h2 className="h2-style">
            Clicking the 'Sign In' button will redirect you to a 3rd party
            authentication system
          </h2>
        </main>
      ) : (
        <>
          {/* <h1 className="header-style">Andrew's Chat</h1> */}
          <Header />
          <RecordingComponent ws={ws} startRecording={startRecording} />
          <ResponseComponent
            // responseData={responseData}
            // prompt={prompt}
            message={message}
          />
        </>
      )}
    </div>
  );
}

export default App;
