//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, NativeModules, ScrollView, ActivityIndicator } from 'react-native';

import { validate } from 'react-email-validator';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { showMessage, hideMessage } from "react-native-flash-message";
import { BASE_URL } from './baseURL';


const { RNNetworkInfo } = NativeModules;
// create a component
let ip = null;

const Info = ({ navigation, route }) => {

    const { name, dob, gender } = route.params;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false)

    // const getAddress = async () => {
    //     const wifiIP = await RNNetworkInfo.getWIFIIPV4Address();
    //     if (wifiIP && wifiIP !== '0.0.0.0') {
    //         console.log('IP   ', wifiIP);
    //     }
    // }
    // getAddress()


    const handleSignUp = async () => {
        try {
            
            if (email.trim() == '') {
                return showMessage({
                    message: "Please enter your email",
                    backgroundColor: '#9023c0'
                })
            }
            if (!validate(email.trim())) {
                return showMessage({
                    message: "Please enter valid Email",
                    backgroundColor: '#9023c0'
                })
            }
            if (password.trim() == '') {
                return showMessage({
                    message: "Please enter your password",
                    backgroundColor: '#9023c0'
                })
            }
            if (password.trim().length < 8) {
                return showMessage({
                    message: "Password length must be greater than 8",
                    backgroundColor: '#9023c0'
                })
            }
            if (password.trim() != confirmPassword.trim()) {
                return showMessage({
                    message: "Please enter your same password",
                    backgroundColor: '#9023c0'
                })
            }

            setLoading(true)
            const response = await axios.post(`${BASE_URL}/api/users/signup`, {
                "email": email.trim().toLowerCase(),
                "password": password.trim(),
                "name": name.trim(),
                "dob": dob,
                "gender": gender.trim().toLowerCase()
            })

            if (response?.data) {
                setLoading(false)
                showMessage({
                    message: "Your account is created successfully, please login",
                    backgroundColor: '#9023c0'
                })
                navigation.navigate('SignIn')
            }

        } catch (error) {
            setLoading(false)
            console.log('Error  ', error)
            showMessage({
                message: error?.response?.data?.message,
                backgroundColor: '#9023c0'
            })
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.container}>

                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/dementia.jpg')} style={{ height: 150, width: 150, resizeMode: 'contain' }} />
                </View>

                <Text style={{ color: '#9023c0', fontFamily: 'Playfair-Bold', fontSize: 25 }}>Sign Up</Text>

                <InputField title='Email' placeholder='Enter your email' onChangeText={setEmail} />

                <InputField title='Password' placeholder='Enter your password' onChangeText={setPassword} secureTextEntry={true} />

                <InputField title='Confirm Password' placeholder='Confirm your password' onChangeText={setConfirmPassword} secureTextEntry={true} />

                <TouchableOpacity
                    onPress={() => handleSignUp()}
                    style={{ backgroundColor: '#9023c0', height: 48, marginTop: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Nunito-Bold' }}>Sign Up</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Text style={{ fontFamily: 'Nunito-Regular', color: '#b5b5b5' }}>Already have and account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={{ fontFamily: 'Nunito-Regular', color: '#9023c0' }}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {
                loading && <View style={{height: '100%', width: '110%', justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(255,255,255, 0.5)'}}>
                    <ActivityIndicator size={'large'} color={'#9023c0'}/>
                </View>
            }
        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 15
    },
});

//make this component available to the app
export default Info;

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