//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import Home from './src/screens/Home';
import Info from './src/screens/Info';
import PhotosDetail from './src/screens/PhotosDetail';

const Stack = createNativeStackNavigator();
import FlashMessage, { showMessage } from "react-native-flash-message";

// create a component
const App = () => {

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='SignIn' component={Login} options={{ headerShown: false }} />
          <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name='Info' component={Info} options={{ headerShown: false }} />
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
          <Stack.Screen name='PhotosDetail' component={PhotosDetail} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" style={{ borderRadius: 10, margin: 10 }} ></FlashMessage>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf0ee',
    padding: 15,
    justifyContent: 'center'
  },
});

//make this component available to the app
export default App;

