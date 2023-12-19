import React from 'react'; // Import React (if using React <17)
import Header from "./Header";

const Directions = () => {

    return (
      <div>
        <Header />
        <div className="flex justify-center items-center h-screen bg-custom-700">
          <div className="mockup-window border bg-base-300 custom-window">
            <h1 className="text-lg font-bold font  text-center text-white px-2 mx-2 mb-2">Things to consider about AI</h1>
            <ul className="list-disc space-y-4 pl-5 text-white font-sans mt-0">
              <li className="chat-bubble chat-bubble-third text-black p-3 rounded-lg max-w-xs mb-2">AI models are trained on large datasets and their performance is heavily dependent on the quality and quantity of the data they've been trained on. If the data is biased or incomplete, the AI's responses and decisions can be flawed.</li>
              <li className="chat-bubble chat-bubble-third text-black p-3 rounded-lg max-w-xs mb-2">AI can struggle with tasks that are too far removed from its training data or require a deep understanding of specific, nuanced topics. It can perform well on general topics but may falter on very specialized or novel queries.</li>
              <li className="chat-bubble chat-bubble-third text-black p-3 rounded-lg max-w-xs mb-2">AI systems typically do not have real-time access to external data sources or events. They rely on pre-existing datasets they were trained on, which may not include the most current events or information.</li>
              <li className="chat-bubble chat-bubble-third text-black p-3 rounded-lg max-w-xs mb-2">AI cannot process live data streams or real-time updates from news, social media, or other sources. This means they cannot provide information or analysis on events as they unfold.</li>
              {/* Additional list items */}
            </ul>
            <h2 className="text-lg font-bold font-sans text-center text-white px-2 mx-2 mb-2 mt-2">
              How to use Audible Assistant
            </h2>
            <ul className="list-disc space-y-4 pl-5 text-white font-sans mt-0">
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To turn on the microphone, click the "Start Recording" button. This will allow OpenAI to begin listening for a prompt.
                The microphone will be turned on automatically when the button is clicked.
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                You will have 30 seconds to ask a prompt, after that the microphone will automatically be turned off. To turn the microphone back on click the "Start Recording" button again and the timer will reset.
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To turn off the microphone, click the "Stop Recording" button. A "Microphone turned off" message will be displayed.
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                Consider what you're asking. The more complex the question, the longer OpenAI will take to generate a response.
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To save your conversations, click the "Save Data" button. 
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To clear your chat, click the "Clear Chat" button.
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To get your conversation data, click the "Fetch Saved Data" button.
              </li>
            </ul>

          </div>
        </div>
      </div>
    );
  }

export default Directions;


