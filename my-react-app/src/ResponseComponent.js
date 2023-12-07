import React, { useState, useEffect } from "react";
import "./index.css";

function ResponseComponent({ message }) {
  const [ws, setWs] = useState(null);
  const [responseData, setResponseData] = useState([]);

  console.log(prompt);

  useEffect(() => {
    const newWs = new WebSocket("ws://localhost:6789");

    newWs.onopen = () => {
      console.log("WebSocket Connected");
      newWs.send("get_response");
    };

    newWs.onmessage = (event) => {
      console.log("Message from server:", event.data);
      const [prompt, response] = event.data.split("\n"); // Assuming the format "PROMPT: ... \n RESPONSE: ..."
      setResponseData((prevData) => [...prevData, { prompt, response }]);
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(newWs);

    return () => newWs.close();
  }, []);

  // Fetching functions
  const fetchPromptsAndResponses = async () => {
    try {
      // Fetch prompts
      const promptsResponse = await fetch('http://localhost:5500/prompts');
      const promptsData = await promptsResponse.json();
  
      // Fetch responses
      const responsesResponse = await fetch('http://localhost:5500/responses');
      const responsesData = await responsesResponse.json();
  
      // Combine prompts and responses
      const combinedData = promptsData.map((promptItem) => {
        // Find the corresponding response
        const responseItem = responsesData.find(responses => responses.response_id === promptItem.prompt_id);
  
        return {
          prompt: promptItem.prompt_question,
          response: responseItem ? responseItem.response_answer : ''
        };
      });
  
      // Update state
      setResponseData(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  

  // Saving functions
  const saveNewPrompt = async (prompt) => {
    try {
      await fetch("http://localhost:5500/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt_question: prompt }),
      });
      console.log({ prompt_question: prompt });
      console.log("Prompt saved successfully");
    } catch (error) {
      console.error("Error saving prompt:", error);
    }
  };

  const saveNewResponse = async (response) => {
    try {
      await fetch("http://localhost:5500/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response_answer: response }),
      });
      console.log({ response_answer: response });
      console.log("Response saved successfully");
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  const clearChat = () => {
    setResponseData([]);
  };

  return (
    <div>
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
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <button onClick={clearChat} style={{ textAlign: "center" }}>
          Clear Chat
        </button>
        <button
          onClick={fetchPromptsAndResponses}
          style={{ textAlign: "center" }}
        >
          Fetch Saved Data
        </button>
        <button
          onClick={() => {
            responseData.forEach(({ prompt, response }) => {
              if (prompt) saveNewPrompt(prompt);
              if (response) saveNewResponse(response);
            });
          }}
          style={{ textAlign: "center" }}
        >
          Save Data
        </button>
      </div>
    </div>
  );
};

export default ResponseComponent;
