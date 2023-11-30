import React, { useState, useEffect } from 'react';

function ResponseComponent({message}, {prompt}) {
    const [responseData, setResponseData] = useState(null);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const newWs = new WebSocket('ws://localhost:6789'); // Replace with your WebSocket server URL
    
        newWs.onopen = () => {
            console.log('WebSocket Connected');
            newWs.send("get_response"); // Request the response data
        };
        newWs.onmessage = (event) => {
            console.log('Message from server:', event.data);
            // Directly use the received text string
            setResponseData(event.data);
        // newWs.onmessage = (event) => {
        //     console.log('Message from server:', event.data);
        //     try {
        //         // Attempt to parse the incoming message as JSON
        //         const parsedData = JSON.parse(event.data);
        //         setResponseData(parsedData);
        //     } catch (error) {
        //         console.error('Error parsing JSON:', error);
        //         // Handle non-JSON messages or set a default state
        //         setResponseData({ message: event.data });
        //     }
        // };
        }
        newWs.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    
        setWs(newWs);
    
        return () => newWs.close();
    }, []);

    const chatBoxStyle = {
        background: 'linear-gradient(0deg, #1E2C3D 0%, #3E364E 100%)',
        margin: '100px auto',
        maxWidth: '500px',
        height: '650px',
        boxShadow: '0 5px 30px rgba(0, 0, 0, 0.3)',
        // border: '1px solid #000', // Uncomment if you need the border
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9)',
        background: '#DFDFEF', // This will override the previous background property
        fontFamily: 'Helvetica Neue',
        fontSize: '1.5em', // Choose either 10px or 1.5em, depending on your need
        color: '#414141',
        lineHeight: '2em',
    };

    const chatBubbleStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with transparency
        padding: '10px 15px', // Space inside the bubble
        borderRadius: '20px', // Rounded corners
        maxWidth: '70%', // Maximum width of a bubble
        margin: '10px', // Space around each bubble
        wordWrap: 'break-word', // To ensure text breaks properly inside the bubble
    };

    const chatHeaderStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: '10px 15px',
        borderRadius: '20px',
        maxWidth: '70%',
        margin: '10px',
        wordWrap: 'break-word',
    };

    return (
        <div style={chatBoxStyle}>
            <h2 style= {chatHeaderStyle}>OpenAI Chat</h2>
            {/* Display prompt in a bubble (if needed) */}
            {/* {prompt && (
                <div style={chatBubbleStyle}>Prompt: {prompt}</div>
            )} */}
            {/* Display message in a bubble */}
            {responseData ? (
                <div style={chatBubbleStyle}>{responseData}</div>
            ) : (
                <div>Please Ask a Question!</div>
            )}
        </div>
    );
}

export default ResponseComponent;