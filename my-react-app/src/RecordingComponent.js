import React from 'react';

function RecordingComponent({ ws, startRecording }) {
    // Function to handle the start recording action
    // const startRecording = () => {
    //     // Check if the WebSocket instance exists and is in the OPEN state
    //     if (ws && ws.readyState === WebSocket.OPEN) {
            
    //         // Send a message to the WebSocket server to start recording
    //         ws.send("start_recording");
    //     } else {
    //         // Log a message if the WebSocket is not connected
    //         console.log("WebSocket is not connected.");
    //     }
    // };

    // Render the component
    return (
        <div style={{
            display: 'flex', 
            justifyContent: 'center', // Centers the button horizontally
            alignItems: 'center', // Centers the button vertically
            height: '10vh', // Sets the height of the container
        }}>
            <button style={{
                padding: '10px 20px', // Example padding, adjust as needed
                // Add any other button styles here
            }} onClick={startRecording}>
                Turn on Microphone
            </button>
        </div>
    );
}

export default RecordingComponent;
