import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  FlatList,
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
          <Button onPress={handleButtonClick} title="Mic On" color="blue"/>
          <Button onPress={stopRecording} title="Mic Off" color="red" />
        </View>

        <TextInput
          style={styles.input}
          onChangeText={handleChange}
          value={input}
          placeholder="Customize OpenAI -> ex: Talk to me like I'm a 3 year old"
        />
      </View>
      <FlatList
  data={responseData}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View>
      <Text style={styles.messageBubbleSent}>{item.prompt}</Text>
      <Text style={styles.messageBubbleReceived}>{item.response}</Text>
    </View>
  )}
  ListEmptyComponent={() => (
    <>
      <Text style={styles.messageBubbleSent}>Welcome to Audible Assistant!</Text>
      <Text style={styles.messageBubbleReceived}>Turn on the microphone to begin your conversation!</Text>
      <Text style={styles.messageBubbleSent}>You can customize how you want OpenAI to respond by setting it up above!</Text>
    </>
  )}
  style={styles.messagesContainer}
/>
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
    justifyContent: "space-between", // Changed to flex-start to align children to the top
    backgroundColor: '#fff', // Assuming a white background
  },
  image: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginLeft: 175,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  bottomButtons: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginLeft: 115,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    maxWidth: screenWidth * 0.4,
    marginTop: 10,
  },
  offButton: {
  },
  onButton: {
  },

  messagesContainer: {
    paddingHorizontal: 10, // Add horizontal padding
    marginTop: 10,
    backgroundColor: '#e9967a',
    borderRadius: 4,
    marginVertical: 10,
    height: 500,
    borderWidth: 2,
    borderColor: 'black',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  messageBubbleSent: {
    fontFamily: 'Arial Hebrew',
    padding: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    marginTop: 24,
    marginLeft: 16,
    marginRight: 2,
    lineHeight: 15,
    borderRadius: 1,
    color: 'white',
    backgroundColor: '#0B93F6',
    alignSelf: 'flex-end',
    maxWidth: screenWidth * 0.75,
    marginHorizontal: 10,
  },
  messageBubbleReceived: {
    fontFamily: 'Arial Hebrew',
    padding: 10,
    paddingHorizontal: 15,
    marginBottom: 4,
    marginTop: 12,
    marginLeft: 1,
    marginRight: 16,
    lineHeight: 15,
    borderRadius: 4,
    color: 'white',
    backgroundColor: '#696969',
    alignSelf: 'flex-start',
    maxWidth: screenWidth * 0.75,
    marginHorizontal: 10,
  },
  innerContainer: {
    paddingHorizontal: 10, // Add horizontal padding
  },
  input: {
    backgroundColor: 'lightgrey',
    borderRadius: 4,
    maxHeight: 75,
    padding: 10,
  }
  },
);