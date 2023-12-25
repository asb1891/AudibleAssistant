
import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import ResponseComponent from "./ResponseComponent";
import LoginComponent from "./LoginComponent";
import InputComponent from "./InputComponent";
import { useAuth0 } from "@auth0/auth0-react";
import "./index.css";
import Header from "./Header";

function App() {

  const { isAuthenticated } = useAuth0();
  const [ws, setWs] = useState(null);
  const [newWs, setNewWs] = useState(null);
  const [shouldReconnect, setShouldReconnect] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [countdown, setCountdown] = useState(30); // Adjust as needed

  const connectWebSocket = useCallback(() => {
    if (!shouldReconnect) return;

    const newWsInstance = new WebSocket("ws://localhost:6789");

    newWsInstance.onopen = () => {
      console.log("WebSocket Connected");
      newWsInstance.send("hello from the client side");
    };

    newWsInstance.onmessage = (event) => {
      console.log("Message from server:", event.data);
      const [prompt, response] = event.data.split("\n"); // Handling incoming messages
      setResponseData((prevData) => [...prevData, { prompt, response }]);
      setCountdown(30); // Resetting countdown on receiving message
    };

    newWsInstance.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      if (shouldReconnect) {
        setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
      }
    };

    setWs(newWsInstance);
  }, [shouldReconnect]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      setShouldReconnect(false);
      ws?.close();
    };
  }, [connectWebSocket, ws]);

  const connectSecondWebSocket = useCallback(() => {
    if (!shouldReconnect) return;

    const secondWSInstance = new WebSocket("ws://localhost:5678");

    secondWSInstance.onopen = () => {
      console.log("Second WS Connected to Server");
    };

    secondWSInstance.onclose = () => {
      console.log("Second WebSocket closed, attempting to reconnect...");
      if (shouldReconnect) {
        setTimeout(connectSecondWebSocket, 3000); // Reconnect after 3 seconds
      }
    };

    setNewWs(secondWSInstance);
  }, [shouldReconnect]);

  useEffect(() => {
    connectSecondWebSocket();
    return () => {
      setShouldReconnect(false);
      newWs?.close();
    };
  }, [connectSecondWebSocket, newWs]);

  return (
    <div className={isAuthenticated ? "" : ""}>
      {!isAuthenticated ? (
        <main>
          <div className="flex-1 px-2 mx-2 text-lg font-bold text-center mt-3 mb-3">
            Audible Assistant
          </div>
          <LoginComponent />
        </main>
      ) : (
        <>
          <Header />
          <InputComponent />
          <ResponseComponent ws={ws} setWs={setWs} newWs={newWs} setNewWs={setNewWs} countdown={countdown} setCountdown={setCountdown} responseData={responseData} setResponseData={setResponseData}/>
          
        </>
      )}
    </div>
  );
}

export default App;
