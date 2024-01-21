import React, {useState, useEffect, useCallback} from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import ResponseComponent from "./src/ResponseComponent"

function App () {
  const [ws, setWs] = useState(null) //Websocket state
  const [newWs, setNewWs] = useState(null) //Second websocket state
  const [shouldReconnect, setShouldReconnect] = useState(true) // Reconnect state
  const [responseData, setResponseData] = useState([]) // Array of messages from OpenAI to display on the screen
  const [countdown, setCountdown] = useState(30) // Timer countdown state
  const [userInput, setUserInput] = useState('')

  //Connecting to the websocket server
  
  const connectWebSocket = useCallback(() => {
    if (!shouldReconnect) return

    const newWsInstance = new WebSocket("ws://192.168.1.92:6789")

    newWsInstance.onopen = () => {
      console.log("WebSocket Connected");
      newWsInstance.send("hello from the client side")
    }
    // creating an array of messages from OpenAI to display on the screen
    newWsInstance.onmessage = (event) => {
      console.log("Message from server:", event.data)
      const [prompt, response] = event.data.split("\n")// Handling incoming messages
      setResponseData((prevData) => [...prevData, { prompt, response }])
      setCountdown(30) // Resetting countdown on receiving message
    };

    newWsInstance.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      if (shouldReconnect) {
        setTimeout(connectWebSocket, 5000) // Reconnect after 3 seconds
      }
    }

    setWs(newWsInstance)
  }, [shouldReconnect])

  useEffect(() => {
    connectWebSocket()
    return () => {
      setShouldReconnect(false)
      ws?.close()
    };
  }, [connectWebSocket, ws])

  //Connecting to the second websocket server, which handles Stop Recording functionality
  const connectSecondWebSocket = useCallback(() => {
    if (!shouldReconnect) return

    const secondWSInstance = new WebSocket("ws://192.168.1.92:5678")

    secondWSInstance.onopen = () => {
      console.log("Second WS Connected to Server")
    };

    secondWSInstance.onclose = () => {
      console.log("Second WebSocket closed, attempting to reconnect...")
      if (shouldReconnect) {
        setTimeout(connectSecondWebSocket, 5000) // Reconnect after 3 seconds
      }
    }

    setNewWs(secondWSInstance)
  }, [shouldReconnect])

  useEffect(() => {
    connectSecondWebSocket()
    return () => {
      setShouldReconnect(false)
      newWs?.close()
    };
  }, [connectSecondWebSocket, newWs])

  return (
  <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.titleText}>Audible Assistant</Text>
        {/* <LoginComponent /> */}
      </View>
      <>
        {/* <HeaderComponent /> */}
        <ResponseComponent
          userInput={userInput}
          ws={ws}
          setWs={setWs}
          newWs={newWs}
          setNewWs={setNewWs}
          countdown={countdown}
          setCountdown={setCountdown}
          responseData={responseData}
          setResponseData={setResponseData}
        />
      </>
  </View>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {

  },
  titleText: {
    flex: 1,
    fontFamily:'Arial Rounded MT Bold',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    paddingVertical: 30,
  }
  // Add other styles as needed
})
export default App
