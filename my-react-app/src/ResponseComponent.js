
import React, { useState, useEffect } from 'react';

function ResponseComponent({ prompt,  message , responseData }) {
    // const [responseData, setResponseData] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const newWs = new WebSocket('ws://localhost:6789');
    
        newWs.onopen = () => {
            console.log('WebSocket Connected');
            newWs.send("get_response");
        };

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
        overflow: 'auto', // Changed to make the chatbox scrollable
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9)',
        background: '#DFDFEF', 
        fontFamily: 'Helvetica Neue',
        fontSize: '1.5em',
        color: '#414141',
        lineHeight: '2em',
        padding: '10px' // Optional, for some spacing inside the chatbox
    };
    

    const chatBubbleStyle = {
        backgroundColor: 'rgba(32,178,170, 0.4)', // White with transparency
        padding: '10px 15px', // Space inside the bubble
        borderRadius: '20px', // Rounded corners
        maxWidth: '70%', // Maximum width of a bubble
        margin: '10px', // Space around each bubble
        wordWrap: 'break-word',
        textAlign: 'left',
        fontSize: '16px',
        lineHeight: '1.5',
        marginLeft: 'auto',
        marginRight: '0' // To ensure text breaks properly inside the bubble
    };
    const responseStyle = {
        backgroundColor: 'rgba(188,143,143, 0.4)', // White with transparency
        padding: '10px 15px', // Space inside the bubble
        borderRadius: '20px', // Rounded corners
        maxWidth: '70%', // Maximum width of a bubble
        margin: '10px', // Space around each bubble
        wordWrap: 'break-word',
        textAlign: 'left',
        fontSize: '16px',
        lineHeight: '1.5',
        marginLeft: '0',
        marginRight: 'auto'
    }

    const chatHeaderStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        fontStyle: 'italic',
        padding: '10px 15px',
        borderRadius: '20px',
        maxWidth: '70%',
        margin: '10px',
        wordWrap: 'break-word',
    };

    return (
        <div style={chatBoxStyle}>
            <h2 style={chatHeaderStyle}>OpenAI Chat</h2>
            {/* Render each prompt and response in separate bubbles */}
            {responseData.length > 0 ? (
            responseData.map(({ prompt, response }, index) => (
                <React.Fragment key={index}>
                    {prompt && <div style={chatBubbleStyle}>{prompt}</div>}
                    {response && <div style={responseStyle}>{response}</div>}
                </React.Fragment>
                ))
            ) : (
                <div>Please Ask a Question!</div>
            )}
        </div>
    );
            }

export default ResponseComponent;