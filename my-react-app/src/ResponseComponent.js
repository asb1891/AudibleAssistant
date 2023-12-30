import React, { useState, useEffect } from "react";
import InputComponent from "./InputComponent";
import "./index.css";

function ResponseComponent({ ws, setWs, newWs, setNewWs, countdown, setCountdown, responseData, setResponseData }) {

  const [isRecording, setIsRecording] = useState(false);
  const [showMicOffMessage, setShowMicOffMessage] = useState(false);


  useEffect(() => {
    let timer;
    if (isRecording && countdown > 0) {
      setShowMicOffMessage(false); // Ensure the message is not shown while countdown is active
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 || !isRecording) {
      setIsRecording(false);
      setShowMicOffMessage(true); // Show the message when the countdown ends or recording stops
    }
    return () => clearTimeout(timer);
  }, [countdown, setCountdown, isRecording]);

  const startRecording = () => {
    console.log("startRecording function called");
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("start_recording");
      setIsRecording(true);
      setShowMicOffMessage(false); // Reset the message display when recording starts
    } else {
      console.log("WebSocket is not connected.");
    }
  };

  const stopRecording = () => {
    console.log("stopRecording function called");
    if (newWs && newWs.readyState === WebSocket.OPEN) {
      newWs.send("stop_recording");
    } else {
      console.log("Second WebSocket is not connected.");
    }
    setIsRecording(false);
    setShowMicOffMessage(true); // Show the message when recording is manually stopped
  };

  const handleButtonClick = () => {
    setCountdown(30); // Set your desired countdown duration here
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
    <div className="flex justify-center items-center h-screen your-class min-h-screen w-fulla">
      
      <div className="flex flex-col items-center gap-4">
        {/* Button and Countdown Container */}
        <div className="flex flex-col items-center mt-4">
          {/* Message */}
          {showMicOffMessage ? (
            <div>
              <img
                src="/no-microphone.gif"
                alt="microphone off"
                style={{ width: "60px", height: "auto" }}
              />
            </div>
          ) : (
            isRecording &&
            countdown !== null && (
              <div>
                <img
                  src="/podcast.gif"
                  alt="Podcast Gif"
                  style={{ width: "60px", height: "auto" }}
                />
              </div>
            )
          )}

          {/* Buttons */}
          <div className="flex gap-2 justify-center mt-2">
            <button
              onClick={handleButtonClick}
              className="btn btn-outline btn-sm  btn-info"
            >
              Mic On
            </button>
            <button
              onClick={stopRecording}
              className="btn btn-outline btn-sm btn-warning"
            >
              Mic Off
            </button>
          </div>
          <InputComponent />
        </div>

        <div className="mockup-window border-solid border-2 border-zinc-700 bg-base-300 custom-window w-full p-4 overflow-y-auto">
          {/* Container for messages */}
          {responseData.length > 0 ? (
            responseData.map(({ prompt, response }, index) => (
              <React.Fragment key={index}>
                {prompt && (
                  <div className="w-full flex justify-end">
                    <div className="chat-bubble chat-bubble-third text-black rounded-lg max-w-xs mb-2">
                      {prompt}
                    </div>
                  </div>
                )}
                {response && (
                  <div className="w-full flex justify-start response-style2">
                    <div className="chat-bubble chat-bubble-secondary bg-yellow-300 rounded-lg max-w-xs mb-2">
                      {response}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="chat-bubble chat-bubble-third text-black bg-yellow-300 rounded-lg max-w-xs mb-2 text-center">
              Go to the Directions page in the navigation bar to learn more
              about AI and how to use Audible Assistant
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-4 mb-14">
          <button
            className="btn btn-outline btn-sm btn-warning"
            onClick={clearChat}
          >
            Clear Chat
          </button>
          <button
            className="btn btn-outline btn-sm btn-info"
            onClick={fetchPromptsAndResponses}
          >
            Fetch Saved Chats
          </button>
          <button
            className="btn btn-outline btn-sm btn-success"
            onClick={() => {
              responseData.forEach(({ prompt, response }) => {
                if (prompt) saveNewPrompt(prompt);
                if (response) saveNewResponse(response);
              });
            }}
          >
            Save Chats
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResponseComponent;
