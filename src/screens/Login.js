//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
// create a component
import { showMessage, hideMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './baseURL';
import { saveUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';


const Login = ({ navigation }) => {

    const dispatch = useDispatch()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false)

    const handleSignIn = async () => {
        try {
            setLoading(true)

            if (email.trim() == '') {
                setLoading(false)
                return showMessage({
                    message: "Please enter your email",
                    backgroundColor: '#9023c0'
                })
            }
            if (password.trim() == '') {
                setLoading(false)
                return showMessage({
                    message: "Please enter your password",
                    backgroundColor: '#9023c0'
                })
            }


            const response = await axios.post(`${BASE_URL}/api/users/signin`, {
                "email": email.trim().toLowerCase(),
                "password": password.trim(),
            })

            if (response?.data?.signIn == true) {
                setLoading(false)

                const userData = await AsyncStorage.setItem('@UserData', JSON.stringify(response?.data?.user))
                const user = response?.data?.user;
                dispatch(saveUserData(user))
                navigation.reset({ index: 0, routes: [{ name: 'Home', params: {user} }] })
            }

        } catch (error) {
            setLoading(false)
            return showMessage({
                message: error?.response?.data?.message,
                backgroundColor: '#9023c0'
            })
        }
    }


    return (
        <View style={styles.container}>

            <View style={{ alignItems: 'center' }}>
                <Image source={require('../assets/images/dementia.jpg')} style={{ height: 150, width: 150, resizeMode: 'contain' }} />
            </View>

            <Text style={{ color: '#9023c0', fontFamily: 'Playfair-Bold', fontSize: 25 }}>Sign In</Text>

            <InputField title='Email' placeholder='Enter your email' onChangeText={setEmail} />

            <InputField title='Password' placeholder='Enter your password' onChangeText={setPassword} secureTextEntry={true} />

            <TouchableOpacity
                onPress={() => handleSignIn()}
                style={{ backgroundColor: '#9023c0', height: 48, marginTop: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Nunito-Bold' }}>Sign In</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Text style={{ fontFamily: 'Nunito-Regular', color: '#b5b5b5' }}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={{ fontFamily: 'Nunito-Regular', color: '#9023c0' }}> Sign Up</Text>
                </TouchableOpacity>
            </View>

            {
                loading && <View style={{height: '100%', width: '110%', justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(255,255,255, 0.5)'}}>
                    <ActivityIndicator size={'large'} color={'#9023c0'}/>
                </View>
            }
        </View>
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
export default Login;

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