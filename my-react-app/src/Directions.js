import React from 'react'; // Import React (if using React <17)
import Header from "./Header";

const Directions = () => {

    return (
      <div>
        <Header />
        <div className="flex justify-center items-center h-screen your-class">
          <div className="mockup-window border bg-base-300 custom-window">
            <h1 className="text-lg font-bold font  text-center text-white px-2 mx-2 mb-2">Things to consider about AI</h1>
            <ul className="list-disc space-y-4 pl-5 text-white font-sans mt-0">
              <li className="chat-bubble chat-bubble-third text-black p-3 rounded-lg max-w-xs mb-2">AI models are trained on large datasets and their performance is heavily dependent on the quality and quantity of the data they've been trained on.</li>
              
              <li className="chat-bubble chat-bubble-third text-black p-3 rounded-lg max-w-xs mb-2">AI systems cannot access real-time external data and depend on pre-trained datasets, lacking current events and information.</li>
              <li className="chat-bubble chat-bubble-third text-black p-3 rounded-lg max-w-xs mb-2">AI lacks the ability to process live data streams or real-time updates, limiting its capacity to provide immediate information on unfolding events..</li>
              
            </ul>
            <h2 className="text-lg font-bold font-sans text-center text-white px-2 mx-2 mb-2 mt-2">
              How to use Audible Assistant
            </h2>
            <ul className="list-disc space-y-4 pl-5 text-white font-sans mt-0">
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To turn on the microphone, click the "Start Recording" button. This will allow OpenAI to begin listening for a prompt.
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                If no speech is deteced for 30 seconds, the microphone will automatically turn off.
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To turn off the microphone, click the "Stop Recording" button.
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                Consider what you're asking. The more complex the question, the longer OpenAI will take to generate a response.
              </li>
              {/* <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To save your conversations, click the "Save Data" button. 
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To clear your chat, click the "Clear Chat" button.
              </li>
              <li className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
                To get your conversation data, click the "Fetch Saved Data" button.
              </li> */}
            </ul>

          </div>
        </div>
      </div>
    );
  }

export default Directions;


