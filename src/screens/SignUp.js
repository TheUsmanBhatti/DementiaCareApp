//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Pressable } from 'react-native';

import RNDateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { showMessage, hideMessage } from "react-native-flash-message";

// create a component
const SignUp = ({ navigation }) => {

    const [name, setName] = useState('');
    const [gender, setGender] = useState('Select your gender')
    const [dob, setDOB] = useState(new Date());

    const [showGender, setShowGender] = useState(false)
    const [showDate, setShowDate] = useState(false);

    const onSelectDate = (event, selectedValue) => {
        const currentDate = selectedValue || new Date();
        setDOB(currentDate);
        setShowDate(false);
    }

    const handleNext = async () => {
        if (name.trim() == '' || gender == 'Select your gender') {
            return showMessage({
                message: "Please fill the credentials",
                backgroundColor: '#9023c0'
            })
        }
        navigation.navigate('Info', {name, gender, dob: dob})
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.container}>

                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/dementia.jpg')} style={{ height: 150, width: 150, resizeMode: 'contain' }} />
                </View>

                <Text style={{ color: '#9023c0', fontFamily: 'Playfair-Bold', fontSize: 25 }}>Sign Up</Text>

                <InputField title='Name' placeholder='Enter your name' onChangeText={setName} />


                <Text style={{ fontSize: 17, color: '#2b2b2b', marginBottom: 5, marginTop: 15, fontFamily: 'Nunito-SemiBold' }}>Gender</Text>
                <TouchableOpacity
                    onPress={() => setShowGender(true)}
                    style={[styles.inputStyle, { justifyContent: 'center' }]}>
                    <Text style={{ fontFamily: 'Nunito-Regular', color: gender == 'Select your gender' ? '#c5c5c5' : '#000', fontSize: 15 }}>{gender}</Text>
                </TouchableOpacity>


                <Text style={{ fontSize: 17, color: '#2b2b2b', marginBottom: 5, marginTop: 15, fontFamily: 'Nunito-SemiBold' }}>Date of Birth</Text>
                <TouchableOpacity
                    onPress={() => setShowDate(true)}
                    style={[styles.inputStyle, { justifyContent: 'center' }]}>
                    <Text style={{ fontFamily: 'Nunito-Regular', color: '#000', fontSize: 15 }}>{Moment(dob).format('MMM DD, YYYY')}</Text>
                </TouchableOpacity>
                {showDate && (
                    <RNDateTimePicker
                        value={dob}
                        display='default'
                        mode={'date'}
                        onChange={onSelectDate}
                        maximumDate={Date.parse(new Date)}
                    />
                )}

                <TouchableOpacity
                    onPress={() => handleNext()}
                    style={{ backgroundColor: '#9023c0', height: 48, marginTop: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Nunito-Bold' }}>Next</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Text style={{ fontFamily: 'Nunito-Regular', color: '#b5b5b5' }}>Already have and account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={{ fontFamily: 'Nunito-Regular', color: '#9023c0' }}> Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {showGender && (
                <Pressable
                    onPress={() => setShowGender(false)}
                    style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', position: 'absolute', paddingHorizontal: 15 }}>
                    <View style={{ backgroundColor: '#fff', width: '100%', borderRadius: 15, overflow: 'hidden' }}>
                        <TouchableOpacity
                            onPress={() => {
                                setGender('Male')
                                setShowGender(false)
                            }}
                            style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                            <Text style={{ color: '#000', fontSize: 17, fontFamily: 'Nunito-Regular' }}>Male</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setGender('Female')
                                setShowGender(false)
                            }}
                            style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                            <Text style={{ color: '#000', fontSize: 17, fontFamily: 'Nunito-Regular' }}>Female</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setGender('Other')
                                setShowGender(false)
                            }}
                            style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                            <Text style={{ color: '#000', fontSize: 17, fontFamily: 'Nunito-Regular' }}>Other</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            )}
        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 15
    },
    inputStyle: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        fontSize: 15,
        borderWidth: 2,
        borderColor: '#e5e5e5',
        height: 48,
        fontFamily: 'Nunito-Regular'
    }
});

//make this component available to the app
export default SignUp;

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
                    style={styles.inputStyle} />

                {props.secureTextEntry && <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 0, padding: 10 }}>
                    <Icon name={!showPassword ? 'eye' : 'eye-off'} color={'#b5b5b5'} size={22} />
                </TouchableOpacity>}
            </View>

        </>
    )
}