import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions
} from "react-native";

const screenWidth = Dimensions.get('window').width;
function ResponseComponent({ ws, newWs, countdown, setCountdown, responseData, setResponseData }) {

  const [isRecording, setIsRecording] = useState(false);
  const [showMicOffMessage, setShowMicOffMessage] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    let timer;
    if (isRecording && countdown > 0) {
      setShowMicOffMessage(false);
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 || !isRecording) {
      setIsRecording(false);
      setShowMicOffMessage(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, setCountdown, isRecording]);

  const handleChange = (newValue) => {
    setInput(newValue);
  };

  const startRecording = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        command: "start_recording",
        userInput: input,
      });

      ws.send(message);
      setIsRecording(true);
      setShowMicOffMessage(false);
    } else {
      console.log("WebSocket is not connected.");
    }
  };

  const stopRecording = () => {
    if (newWs && newWs.readyState === WebSocket.OPEN) {
      newWs.send("stop_recording");
    } else {
      console.log("Second WebSocket is not connected.");
    }
    setIsRecording(false);
    setShowMicOffMessage(true);
  };

  const handleButtonClick = () => {
    setCountdown(30); // Set your desired countdown duration here
    startRecording();
  };
  const clearChat = () => {
    setResponseData([]);
  };
  

  return (
  <View style={styles.container}>
    <View style={styles.innerContainer}>
      {/* Buttons and Countdown Container */}
      <View style={styles.buttonContainer}>
        {/* Images and Messages */}
        {showMicOffMessage ? (
          <Image
            source={require("my-app/assets/no-microphone.gif")}
            style={styles.image}
          />
        ) : (
          isRecording &&
          countdown !== null && (
            <Image
              source={require("my-app/assets/podcast.gif")}
              style={styles.image}
            />
          )
        )}
        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <Button onPress={handleButtonClick} title="Mic On" color="blue" />
          <Button onPress={stopRecording} title="Mic Off" color="orange" />
        </View>

        <TextInput
          style={styles.input}
          onChangeText={handleChange}
          value={input}
          placeholder="Type Here"
        />
      </View>

      <ScrollView style={styles.messagesContainer}>
        {/* Container for messages */}
        {responseData.length > 0 ? (
          responseData.map(({ prompt, response }, index) => (
            <View key={index} >
              <Text style={styles.messageBubbleSent}>{prompt}</Text>
              <Text style={styles.messageBubbleReceived}>{response}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.messageBubbleSent}>Placeholder Text</Text>
        )}
      </ScrollView>

      <View style={styles.bottomButtons}>
        <Button onPress={clearChat} title="Clear Chat" color="orange" />
        {/* Add other buttons */}
      </View>
    </View>
  </View>
);
}

export default ResponseComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    // other styles
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bottomButtons: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  messagesContainer: {
    marginTop: 12,
    
  },
  messageBubbleSent: {
    padding: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    marginTop: 12,
    marginLeft: 16,
    marginRight: 10,
    lineHeight: 15,
    borderRadius: 4,
    color: 'white',
    backgroundColor: '#0B93F6',
    alignSelf: 'flex-end',
    maxWidth: screenWidth * 0.7,
  },
  messageBubbleReceived: {
    padding: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    marginTop: 12,
    marginLeft: 10,
    marginRight: 16,
    lineHeight: 15,
    borderRadius: 4,
    color: 'white',
    backgroundColor: '#0B93F6',
    alignSelf: 'flex-start',
  },
  },
);