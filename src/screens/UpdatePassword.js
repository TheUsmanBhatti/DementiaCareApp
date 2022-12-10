import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { showMessage, hideMessage } from "react-native-flash-message";
import axios from 'axios';
import { BASE_URL } from './baseURL';
import { useSelector } from 'react-redux';


const UpdatePassword = ({ navigation }) => {

    const user = useSelector(state => state?.user?.userData)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const handleUpdate = async () => {

        if (oldPassword.trim() == '') {
            return showMessage({
                message: "Please enter old password",
                backgroundColor: '#9023c0'
            })
        }
        if (newPassword.trim() == '') {
            return showMessage({
                message: "Please enter new password",
                backgroundColor: '#9023c0'
            })
        }
        if (newPassword.trim().length < 8) {
            return showMessage({
                message: "Password length must be greater than 8",
                backgroundColor: '#9023c0'
            })
        }
        if (confirmPassword.trim() == '') {
            return showMessage({
                message: "Please enter confirm password",
                backgroundColor: '#9023c0'
            })
        }
        if (newPassword.trim() !== confirmPassword.trim()) {
            return showMessage({
                message: "Password not match",
                backgroundColor: '#9023c0'
            })
        }

        try {
            setLoading(true)
            const res = await axios.put(`${BASE_URL}/api/users/update-password/${user?._id}`, {
                oldPassword: oldPassword,
                newPassword: newPassword
            })

            if (res?.data) {
                console.log('Data ', res?.data)
                setLoading(false)
                navigation.goBack()
                return showMessage({
                    message: res?.data?.message,
                    backgroundColor: '#9023c0'
                })
            }
        } catch (error) {
            console.log('Error ', error)
            setLoading(false)
            return showMessage({
                message: error?.response?.data?.message,
                backgroundColor: 'red'
            })

        }
    }

    return (
        <View style={styles.container}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="chevron-back" size={25} color={'#000'} />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 20, color: '#000', marginLeft: 10 }}>Update Password</Text>
            </View>

            <ScrollView>
                <InputField title='Old Password' placeholder='Enter your old password' secureTextEntry={true} onChangeText={setOldPassword} />

                <InputField title='New Password' placeholder='Enter your new password' secureTextEntry={true} onChangeText={setNewPassword} />

                <InputField title='Confirm Password' placeholder='Confirm your password' secureTextEntry={true} onChangeText={setConfirmPassword} />

                <TouchableOpacity
                    onPress={() => handleUpdate()}
                    style={{ backgroundColor: '#9023c0', height: 48, marginTop: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Nunito-Bold' }}>Update</Text>
                </TouchableOpacity>
            </ScrollView>

            {
                loading && <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} color={'#9023c0'} />
                </View>
            }

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15
    },
});


export default UpdatePassword;

const InputField = (props) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Text style={{ fontSize: 17, color: '#2b2b2b', marginBottom: 5, marginTop: 15, fontFamily: 'Nunito-SemiBold' }}>{props.title}</Text>

            <View style={{ justifyContent: 'center' }}>
                <TextInput
                    secureTextEntry={!showPassword}
                    onChangeText={props.onChangeText}
                    placeholderTextColor={'#c5c5c5'}
                    placeholder={props.placeholder}
                    value={props.value}
                    // {...props}
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
                    <Icon name={showPassword ? 'eye' : 'eye-off'} color={'#b5b5b5'} size={22} />
                </TouchableOpacity>}
            </View>

        </>
    )
}
