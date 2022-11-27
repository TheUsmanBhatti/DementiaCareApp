//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MHome from './MHome';
import MoodTracker from './MoodTracker';
import Profile from './Profile';


import AsyncStorage from '@react-native-async-storage/async-storage';
// create a component
const Home = ({ navigation, route }) => {

    const [tab, setTab] = useState('home');
    // const [user, setUser] = useState()

    // const getUserData = async () => {
    //     const data = await AsyncStorage.getItem('userDataA');
    //     setUser(JSON.parse(data))
    // }
    // getUserData()
    const user = route.params


    return (
        <View style={styles.container}>

            <View style={{ flex: 1 }}>
                {
                    tab == 'home' ? (
                        <MHome navigation={navigation} user={user && user} />
                    ) :
                        tab == 'mt' ? (
                            <MoodTracker navigation={navigation} user={user && user} />
                        ) : (
                            <Profile navigation={navigation} user={user && user} />
                        )
                }
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity
                    disabled={tab == 'home' ? true : false}
                    onPress={() => setTab('home')}
                    style={[styles.btnStyle, { backgroundColor: tab == 'home' ? '#9023c0' : '#fff' }]}>
                    <Icon name='home-outline' size={20} color={tab == 'home' ? '#fff' : '#9023c0'} />
                    <Text style={[styles.btnLabel, { color: tab == 'home' ? '#fff' : '#9023c0' }]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={tab == 'mt' ? true : false}
                    onPress={() => setTab('mt')}
                    style={[styles.btnStyle, { backgroundColor: tab == 'mt' ? '#9023c0' : '#fff' }]}>
                    <Icon name='happy-outline' size={20} color={tab == 'mt' ? '#fff' : '#9023c0'} />
                    <Text style={[styles.btnLabel, { color: tab == 'mt' ? '#fff' : '#9023c0' }]}>M. T.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={tab == 'profile' ? true : false}
                    onPress={() => setTab('profile')}
                    style={[styles.btnStyle, { backgroundColor: tab == 'profile' ? '#9023c0' : '#fff' }]}>
                    <Icon name='person-outline' size={20} color={tab == 'profile' ? '#fff' : '#9023c0'} />
                    <Text style={[styles.btnLabel, { color: tab == 'profile' ? '#fff' : '#9023c0' }]}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff'
    },
    btnContainer: {
        backgroundColor: '#fff',
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        overflow: 'hidden'
    },
    btnStyle: {
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    btnLabel: {
        marginLeft: 5,
        fontFamily: 'Nunito-Regular',
        fontSize: 16,
    }
});

//make this component available to the app
export default Home;
