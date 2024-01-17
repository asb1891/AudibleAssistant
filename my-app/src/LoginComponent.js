import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth0 } from '@auth0/auth0-react';

const LoginComponent = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <View style={styles.container}>
        <View style={styles.window}>
          <View style={styles.content}>
            <View style={styles.buttonContainer}>
              <Button
                title="Sign in"
                onPress={() =>
                  loginWithRedirect({
                    authorizationParams: {
                      redirect_uri: "http://localhost:3000",
                    },
                  })
                }
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.bubble}>
                Welcome to Audible Assistant! An app designed to lend an ear
              </Text>
              <Text style={[styles.bubble, styles.disclaimer]}>
                Disclaimer: Clicking the 'Sign In' button will redirect you to a 3rd party
                authentication system
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  window: {
    borderWidth: 1,
    backgroundColor: '#e0e0e0',
    // Add other styling similar to 'mockup-window' and 'bg-base-300'
  },
  content: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    // Add other styling similar to 'bg-base-50'
  },
  buttonContainer: {
    justifyContent: 'center',
    // Additional styling for the button container
  },
  textContainer: {
    marginTop: 10,
    alignItems: 'center',
    // Additional styling for the text container
  },
  bubble: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    maxWidth: 250,
    marginBottom: 10,
    // Add other styling similar to 'chat-bubble'
  },
  disclaimer: {
    backgroundColor: '#ffcc00',
    // Additional styling for the disclaimer bubble
  },
  // Add any other necessary styles
});

export default LoginComponent;
