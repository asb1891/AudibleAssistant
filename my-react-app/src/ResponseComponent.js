import React, { useState, useEffect } from "react";
import "./index.css";

function ResponseComponent({ message, startRecording, stopRecording }) {
  const [ws, setWs] = useState(null);
  const [responseData, setResponseData] = useState([]);
  const [countdown, setCountdown] = useState(null);

  console.log(prompt);
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      // Optional: Add any action you want to perform when the countdown reaches zero
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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
      setCountdown(45)
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(newWs);

    return () => newWs.close();
  }, []);

  const handleButtonClick = () => {
    setCountdown(45);
    startRecording();
  };

  // Fetching functions
  const fetchPromptsAndResponses = async () => {
    try {
      // Fetch prompts
      const promptsResponse = await fetch("http://localhost:5500/prompts");
      const promptsData = await promptsResponse.json();

      // Fetch responses
      const responsesResponse = await fetch("http://localhost:5500/responses");
      const responsesData = await responsesResponse.json();

      // Combine prompts and responses
      const combinedData = promptsData.map((promptItem) => {
        // Find the corresponding response
        const responseItem = responsesData.find(
          (responses) => responses.response_id === promptItem.prompt_id
        );

        return {
          prompt: promptItem.prompt_question,
          response: responseItem ? responseItem.response_answer : "",
        };
      });

      // Update state
      setResponseData(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    <div className="flex justify-center items-center h-screen bg-custom-700">
      <div className="flex flex-col items-center gap-4">
        {/* Countdown Display */}

        <div className="flex gap-2 justify-center">
          <button onClick={handleButtonClick} className="btn">
            Start Recording
          </button>
          <button onClick={stopRecording} className="btn">
            Stop Recording
          </button>
        </div>
        <span className="countdown font-sans text-2xl">
          {countdown !== null &&
            `${countdown} seconds until microphone turns off`}
        </span>
        <div className="mockup-window border bg-base-300 custom-window w-full p-4 overflow-y-auto">
          {/* Container for messages */}
          {responseData.length > 0 ? (
            responseData.map(({ prompt, response }, index) => (
              <React.Fragment key={index}>
                {prompt && (
                  <div className="w-full p-2 flex justify-end">
                    <div className="chat-bubble chat-bubble-third text-black p-3 rounded-lg max-w-xs mb-2">
                      {prompt}
                    </div>
                  </div>
                )}
                {response && (
                  <div className="w-full p-2 flex justify-start">
                    <div className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                      {response}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2 text-center p-4">
              Click on the ./Directions link in the navigation bar to learn more
              about AI and how to use Audible Assistant
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <button className="btn" onClick={clearChat}>
            Clear Chat
          </button>
          <button className="btn" onClick={fetchPromptsAndResponses}>
            Fetch Saved Data
          </button>
          <button
            className="btn"
            onClick={() => {
              responseData.forEach(({ prompt, response }) => {
                if (prompt) saveNewPrompt(prompt);
                if (response) saveNewResponse(response);
              });
            }}
          >
            Save Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResponseComponent;
