/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Client, Message } from 'react-native-paho-mqtt';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component {
  componentDidMount() {
    //Set up an in-memory alternative to global localStorage
    const myStorage = {
      setItem: (key, item) => {
        myStorage[key] = item;
      },
      getItem: (key) => myStorage[key],
      removeItem: (key) => {
        delete myStorage[key];
      },
    };

    // Create a client instance
    const client = new Client({ uri: 'wss://m13.cloudmqtt.com:34250/', clientId: "android_" + parseInt(Math.random() * 100, 10), storage: myStorage });
    var options = {
      useSSL: true,
      userName: "jepjknnb",
      password: "B9Io8J5H88fP",
    }


    client.on('connectionLost', (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
      }
    });
    client.on('messageReceived', (message) => {
      console.log(message.payloadString);
    });

    client.connect(options)
      .then(() => {
        console.log('onConnect');
        return client.subscribe('control/bump');
      })
      .then(() => {
        const message = new Message('bump');
        message.destinationName = 'control/bump';
        client.send(message);
      })
      .catch((responseObject) => {
        console.log(responseObject);
        if (responseObject.errorCode !== 0) {
          console.log('onConnectionLost:' + responseObject.errorMessage);
        }
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
