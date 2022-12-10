//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { saveUserData } from '../redux/userSlice';

// create a component
const Splash = ({ navigation }) => {

  const dispatch = useDispatch()

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('@UserData');
        const user = JSON.parse(data)

        !!user?.email && dispatch(saveUserData(user))

        setTimeout(() => {
          !!user?.email
            ? navigation.reset({ index: 0, routes: [{ name: 'Home', params: { user } }] })
            : navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] })
        }, 2000)

      } catch (error) {
        console.log('Error  ', error)
      }
    }

    getUserData()

  }, [])

  return (
    <View style={styles.container}>

      <Image source={require('../assets/images/dementia.jpg')} style={{ width: 150, height: 150, resizeMode: 'contain', marginBottom: 10, marginTop: -50 }} />

      <ActivityIndicator size={'large'} color={'#9023c0'}/>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
});

//make this component available to the app
export default Splash;
