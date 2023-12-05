import React, { useState, useEffect } from "react";
import './index.css';

function ResponseComponent({ prompt, message }) {
  const [ws, setWs] = useState(null);
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    const newWs = new WebSocket('ws://localhost:6789');

    newWs.onopen = () => {
        console.log('WebSocket Connected');
        newWs.send("get_response");
    };

    newWs.onmessage = (event) => {
        console.log("Message from server:", event.data);
        const [prompt, response] = event.data.split('\n'); // Assuming the format "PROMPT: ... \n RESPONSE: ..."
        setResponseData(prevData => [...prevData, { prompt, response }]);
    };

    newWs.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    setWs(newWs);

    return () => newWs.close();

  }, []);

  return (
    <div className="chat-box">
      <h2 className="chat-header">Audible Assistant</h2>
      {/* Render each prompt and response in separate bubbles */}
      {responseData.length > 0 ? (
        responseData.map(({ prompt, response }, index) => (
          <React.Fragment key={index}>
            {prompt && <div className="chat-bubble">{prompt}</div>}
            {response && <div className="response-style">{response}</div>}
          </React.Fragment>
        ))
      ) : (
        <div>Ask Away!</div>
      )}
    </div>
  );
}

export default ResponseComponent;
