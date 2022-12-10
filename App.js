//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, LogBox } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import Home from './src/screens/Home';
import Info from './src/screens/Info';
import PhotosDetail from './src/screens/PhotosDetail';

const Stack = createNativeStackNavigator();
import FlashMessage, { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './src/screens/Splash';

import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import EditProfile from './src/screens/EditProfile';
import UpdatePassword from './src/screens/UpdatePassword';
import EmergencyContact from './src/screens/EmergencyContact';

// create a component
const App = () => {
  LogBox.ignoreAllLogs()
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
          <Stack.Screen name='SignIn' component={Login} options={{ headerShown: false }} />
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
          <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name='Info' component={Info} options={{ headerShown: false }} />
          <Stack.Screen name='PhotosDetail' component={PhotosDetail} options={{ headerShown: false }} />
          <Stack.Screen name='EditProfile' component={EditProfile} options={{ headerShown: false }} />
          <Stack.Screen name='UpdatePassword' component={UpdatePassword} options={{ headerShown: false }} />
          <Stack.Screen name='EmergencyContact' component={EmergencyContact} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" style={{ borderRadius: 10, margin: 10 }} ></FlashMessage>
    </Provider>
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

