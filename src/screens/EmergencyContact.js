//import liraries
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, FlatList, Modal, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { showMessage, hideMessage } from "react-native-flash-message";
import axios from 'axios';
import { BASE_URL } from './baseURL';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

// create a component
const EmergencyContact = ({ navigation }) => {

    const user = useSelector(state => state?.user?.userData)

    const [modal, setModal] = useState(false)

    const [name, setName] = useState('')
    const [contact, setContact] = useState('')

    const [contactList, setContactList] = useState()
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState()

    const getContactList = async () => {
        try {

            const res = await axios.get(`${BASE_URL}/api/contacts/user/${user?._id}`)

            console.log('Res ', res)
            if (res?.data) {
                setLoaded(true)
                setContactList(res?.data)
            }
        } catch (error) {
            setLoaded(true)
            setError(error)
        }
    }


    useEffect(() => {
        getContactList()

        return () => {
            setContactList()
            setLoaded()
            setError()
        }
    }, [])


    const handleAdd = async () => {

        if (name == '' || contact == '') {
            return showMessage({
                message: "Please fill the fields",
                backgroundColor: '#9023c0'
            })
        }

        try {
            const res = await axios.post(`${BASE_URL}/api/contacts`, {
                user: user?._id,
                name: name,
                contact: contact
            })

            if (res?.data) {
                getContactList()
                setModal(false)
                return showMessage({
                    message: "Added Successfully",
                    backgroundColor: '#9023c0'
                })
            }
        } catch (error) {
            return showMessage({
                message: error?.response?.data?.message,
                backgroundColor: '#9023c0'
            })
        }
    }


    const deleteContact = async (id) => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/contacts/${id}`)

            if(res?.data) {
                getContactList()
                return showMessage({
                    message: "Deleted Successfully!",
                    backgroundColor: '#9023c0'
                })
            }
        } catch (error) {
            return showMessage({
                message: error?.response?.data?.message,
                backgroundColor: '#9023c0'
            })
        }
    }


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 15 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="chevron-back" size={25} color={'#000'} />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 20, color: '#000', marginLeft: 10 }}>Emergency Contact</Text>
            </View>

            {
                loaded && !!error == false && <FlatList
                    showsVerticalScrollIndicator={false}
                    data={contactList}
                    renderItem={({ item }) => (
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity 
                            onPress={() => Linking.openURL(`tel:${item?.contact}`)}
                            style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#d5d5d5' }}>
                                <Text style={{ fontSize: 16, color: '#000', fontFamily: "Nunito-SemiBold" }}>{item?.name}</Text>
                                <Text style={{ fontSize: 14, color: 'gray', fontFamily: "Nunito-Medium" }}>{item?.contact}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => deleteContact(item?._id)}
                                style={{ position: 'absolute', right: 15 }}>
                                <Icon name='trash-bin-outline' size={25} color={'red'} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            }

            {
                !loaded && <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} color={'#9023c0'} />
                </View>
            }

            {
                !loaded && !!error && <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Nunito-SemiBold', color: '#000' }}>{error?.response?.data?.message}</Text>
                </View>
            }

            <TouchableOpacity
                onPress={() => setModal(true)}
                style={{ backgroundColor: '#9023c0', elevation: 3, position: 'absolute', bottom: 15, right: 15, width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25 }}>
                <Text style={{ fontFamily: 'Nunito-Bold', color: '#fff', fontSize: 30, marginBottom: 5 }}>+</Text>
            </TouchableOpacity>

            <Modal
                visible={modal}
                transparent
                animationType={'slide'}
            >
                <View style={{ flex: 1, justifyContent: 'center', padding: 15, backgroundColor: 'rgba(0,0,0,0.2)' }}>

                    <View style={{ backgroundColor: '#fff', elevation: 3, borderRadius: 15, width: '100%', padding: 15 }}>

                        <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#9023c0' }}>Add New Contact</Text>

                        <InputField title={'Name'} placeholder={'Enter person name'} onChangeText={setName} />

                        <InputField title={'Phone Number'} placeholder={'Enter person phone number'} onChangeText={setContact} />

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => setModal(false)}
                                style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: '#9023c0', height: 48, flex: 1, marginRight: 15, marginTop: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#9023c0', fontSize: 17, fontFamily: 'Nunito-Bold' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleAdd()}
                                style={{ backgroundColor: '#9023c0', height: 48, flex: 1, marginTop: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Nunito-Bold' }}>Add</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </Modal>

        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15
    },
});

//make this component available to the app
export default EmergencyContact;


const InputField = (props) => {

    // const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Text style={{ fontSize: 17, color: '#2b2b2b', marginBottom: 5, marginTop: 15, fontFamily: 'Nunito-SemiBold' }}>{props.title}</Text>

            <View style={{ justifyContent: 'center' }}>
                <TextInput
                    // secureTextEntry={!showPassword}
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


            </View>

        </>
    )
}
