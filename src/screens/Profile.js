//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
// create a component
import Moment from 'moment';
import { BASE_URL } from './baseURL';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ user, navigation }) => {

    const [name, setName] = useState('')

    console.log(`${BASE_URL}${user?.avatar}`)

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>

                <Image source={{ uri: `${BASE_URL}/${user?.avatar}` }} style={{ width: 120, height: 120, backgroundColor: 'gray', alignSelf: 'center', borderRadius: 100, marginVertical: 30 }} />

                <View style={{ backgroundColor: 'rgba(144, 35, 192, 0.1)', borderRadius: 15 }}>
                    <View style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                        <Text style={{ width: '50%', fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000' }}>Name</Text>
                        <Text style={{ width: '50%', fontFamily: 'Nunito-Regular', fontSize: 16, color: '#000' }}>{user?.name}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                        <Text style={{ width: '50%', fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000' }}>Email</Text>
                        <Text style={{ width: '50%', fontFamily: 'Nunito-Regular', fontSize: 16, color: '#000' }}>{user?.email}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                        <Text style={{ width: '50%', fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000' }}>Gender</Text>
                        <Text style={{ width: '50%', fontFamily: 'Nunito-Regular', fontSize: 16, color: '#000' }}>{user?.gender}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <Text style={{ width: '50%', fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000' }}>Date of Birth</Text>
                        <Text style={{ width: '50%', fontFamily: 'Nunito-Regular', fontSize: 16, color: '#000' }}>{Moment(user?.dob).format('MMM DD, YYYY')}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate('EmergencyContact')}
                    style={{ backgroundColor: 'rgba(144, 35, 192, 0.2)', padding: 10, borderRadius: 10, marginTop: 15 }}>
                    <Text style={{ width: '50%', fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000' }}>Emergency Contact</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('EditProfile')}
                    style={{ backgroundColor: 'rgba(144, 35, 192, 0.2)', padding: 10, borderRadius: 10, marginVertical: 15 }}>
                    <Text style={{ width: '50%', fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000' }}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('UpdatePassword')}
                    style={{ backgroundColor: 'rgba(144, 35, 192, 0.2)', padding: 10, borderRadius: 10 }}>
                    <Text style={{ width: '50%', fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000' }}>Update Password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => {
                        await AsyncStorage.clear()
                        navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] })
                    }}

                    style={{ backgroundColor: 'rgba(144, 35, 192, 0.2)', padding: 10, borderRadius: 10, marginVertical: 15 }}>
                    <Text style={{ width: '50%', fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000' }}>Logout</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default Profile;


const InputField = (props) => {

    const [showPassword, setShowPassword] = useState(false);


    return (
        <>
            <Text style={{ fontSize: 17, color: '#2b2b2b', marginBottom: 5, marginTop: 15, fontFamily: 'Nunito-SemiBold' }}>{props.title}</Text>

            <View style={{ justifyContent: 'center' }}>
                <TextInput
                    secureTextEntry={showPassword ? props.secureTextEntry : false}
                    onChangeText={props.onChangeText}
                    placeholderTextColor={'#c5c5c5'}
                    placeholder={props.placeholder}
                    style={{
                        backgroundColor: '#fff',
                        padding: 10,
                        borderRadius: 10,
                        fontSize: 15,
                        borderWidth: 2,
                        borderColor: '#e5e5e5',
                        height: 48,
                        fontFamily: 'Nunito-Regular'
                    }} />

                {props.secureTextEntry && <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 0, padding: 10 }}>
                    <Icon name={!showPassword ? 'eye' : 'eye-off'} color={'#b5b5b5'} size={22} />
                </TouchableOpacity>}
            </View>

        </>
    )
}