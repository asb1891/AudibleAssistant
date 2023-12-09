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
      <div>
        <div>
          <div className="mockup-window border bg-base-300 custom-window">
            <h1 className="flex justify-center px-4 py-5 bg-base-50"></h1>
            <div>
              {" "}
              {/* Container for messages */}
              {responseData.length > 0 ? (
                responseData.map(({ prompt, response }, index) => (
                  <React.Fragment key={index}>
                    {prompt && (
                      <div className="chat chat-end">
                        {" "}
                        {/* Align right */}
                        <div className="chat-bubble">{prompt}</div>
                      </div>
                    )}
                    {response && (
                      <div className="chat-start mb-2">
                        <div className="chat-bubble">{response}</div>
                      </div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="chat chat-end">
                  <div className="chat-bubble">
                    Run the program and begin your prompt with the word
                    "question" to trigger OpenAI
                  </div>
                </div>
              )}
            </div>
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
    </div>
  );
}

export default ResponseComponent;
