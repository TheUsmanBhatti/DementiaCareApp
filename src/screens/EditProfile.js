//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import RNDateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { showMessage, hideMessage } from "react-native-flash-message";
import { BASE_URL } from './baseURL';
import axios from 'axios';
import { saveUserData } from '../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


// create a component
const EditProfile = () => {

    const user = useSelector(state => state?.user?.userData)
    const dispatch = useDispatch()

    console.log(user?.dob)

    const [profilePic, setProfilePic] = useState('')
    const [name, setName] = useState(user?.name)
    const [email, setEmail] = useState(user?.email)
    const [gender, setGender] = useState(user?.gender)
    const [dob, setDOB] = useState(user?.dob);

    const [showGender, setShowGender] = useState(false)
    const [showDate, setShowDate] = useState(false);


    const [imageUriGallary, setimageUriGallary] = useState()
    const [imageDetail, setimageDetail] = useState()


    const onSelectDate = (event, selectedValue) => {
        const currentDate = selectedValue || new Date();
        setDOB(currentDate);
        setShowDate(false);
    }

    // console.log( `${BASE_URL}${user?.avatar}`)

    const openGallery = () => {

        const options = {

            maxWidth: 500,
            maxHeight: 500,
            quality: 1,
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: true,

        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can also display the image using data:
                const source = 'data:image/jpeg;base64,' + response.assets[0].base64;
                setimageUriGallary(source);
                setimageDetail(response?.assets[0]);

            }
        });
    };

    const handleUpdate = async () => {

        console.log(`${BASE_URL}/api/users/updateInfo/${user?._id}`)

        let formdata = new FormData();

        formdata.append('avatar', {
            uri: imageDetail?.uri,
            name: imageDetail?.fileName,
            type: 'image/jpeg'
        });

        formdata.append('name', name)
        formdata.append('gender', gender)
        formdata.append('dob', Date.parse(dob))


        fetch(`${BASE_URL}/api/users/updateInfo/${user?._id}`,{
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata,
            }).then(res => res.json())
            .then(json => {
                dispatch(saveUserData(json?.user))
                AsyncStorage.setItem('@UserData', JSON.stringify(json?.user))
                showMessage({
                    message: "Profile Updated Successfully!",
                    backgroundColor: '#9023c0'
                })
            })
            .catch(error => {
                console.log('Error ', error?.message);
            });

    }

    return (
        <View style={styles.container}>

            <View style={{ padding: 15 }}>

                <View style={{ width: 120, height: 120, borderRadius: 60, alignSelf: 'center' }}>
                    <Image source={{ uri: imageUriGallary ? imageUriGallary : `${BASE_URL}/${user?.avatar}` }} style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: 'gray' }} />

                    <TouchableOpacity
                        onPress={openGallery}
                        style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: '#9023c0', padding: 7, borderRadius: 25 }}>
                        <Icon name='camera' size={20} color={'#fff'} />
                    </TouchableOpacity>
                </View>

                <InputField title='Name' placeholder='Enter your name' onChangeText={setName} value={name} />
                <InputField title='Email' placeholder='Enter your email' onChangeText={setEmail} value={email} editable={false} />

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
                        value={new Date(dob)}
                        display='default'
                        mode={'date'}
                        onChange={onSelectDate}
                        maximumDate={Date.parse(new Date)}
                    />
                )}

                <TouchableOpacity
                    onPress={() => handleUpdate()}
                    style={{ backgroundColor: '#9023c0', height: 48, marginTop: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Nunito-Bold' }}>Update</Text>
                </TouchableOpacity>

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

        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
export default EditProfile;

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
                    value={props.value}
                    {...props}
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