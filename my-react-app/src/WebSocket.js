import React, { useState, useEffect } from 'react';

function WebSocketComponent() {
    const [message, setMessage] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Create WebSocket connection
        const socket = new WebSocket('ws://localhost:6789');
        setWs(socket);

        // Connection opened
        socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        // Listen for messages
        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            setMessage(event.data);
        };

        // Connection closed
        socket.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        // Handle any errors that occur
        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        // Clean up on unmount
        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>WebSocket Communication</h1>
            {message && <p>Received Message: {message}</p>}
        </div>
    );
}

export default WebSocketComponent;