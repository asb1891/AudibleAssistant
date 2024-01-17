import React, {useState, useEffect, useCallback} from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import ResponseComponent from "./src/ResponseComponent"

function App () {
  const [ws, setWs] = useState(null)
  const [newWs, setNewWs] = useState(null)
  const [shouldReconnect, setShouldReconnect] = useState(true)
  const [responseData, setResponseData] = useState([])
  const [countdown, setCountdown] = useState(30) // Adjust as needed
  const [userInput, setUserInput] = useState('')

  const connectWebSocket = useCallback(() => {
    if (!shouldReconnect) return

    const newWsInstance = new WebSocket("ws://192.1.92:6789")

    newWsInstance.onopen = () => {
      console.log("WebSocket Connected");
      newWsInstance.send("hello from the client side")
    }

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
    <ScrollView>
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
  </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontFamily:'Arial Rounded MT Bold',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10
  }
  // Add other styles as needed
})
export default App
