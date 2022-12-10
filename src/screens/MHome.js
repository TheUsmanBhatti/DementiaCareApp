//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal, TextInput, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { showMessage, hideMessage } from "react-native-flash-message";
// create a component
import Moment from 'moment';

const { width, height } = Dimensions.get('window')

import axios from 'axios';
import { BASE_URL } from './baseURL';

const MHome = ({ navigation, user }) => {

    const [modal, setModal] = useState(false)

    const [images, setImages] = useState()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [loading, setLoading] = useState(false)

    const [photosList, setPhotosList] = useState();
    const [loaded, setLoaded] = useState(true);
    const [error, setError] = useState();

    const [ref, setRef] = useState(true)

    const openGallery = async () => {

        const options = {
            maxHeight: 1000,
            maxWidth: 1000,
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: true,
            selectionLimit: 10
        };

        await launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can also display the image using data:
                const source = {
                    uri: 'data:image/jpeg;base64,' + response.assets.base64
                };

                // setimageUriGallary(source);
                // setimageDetail(response?.assets);

                setImages(response.assets)

            }
        });
    };

    const handleUploadPhotos = async () => {
        try {

            setLoading(true)

            if (title == '') {
                console.log('Tit')
                setLoading(false)
                return alert('Please enter title')
            }
            if (description == '') {
                setLoading(false)
                return alert('Please enter description')
            }
            if (images == undefined) {
                setLoading(false)
                return alert('Please enter images')
            }


            let formdata = new FormData();

            images != undefined && images.map(i => {
                formdata.append('images', {
                    uri: i?.uri,
                    name: i?.fileName,
                    type: 'image/jpeg'
                });
            })

            formdata.append('title', title)
            formdata.append('description', description)
            formdata.append('user', user?._id)

            console.log('FormData  ', formdata)

            fetch(`${BASE_URL}/api/photos`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata,
            })
                .then(res => res.json())
                .then(json => {

                    setImages()
                    setTitle('')
                    setLoading(false)
                    setDescription('')
                    showMessage({
                        message: "Photos Uploaded Successfully!",
                        backgroundColor: '#9023c0'
                    })
                    setRef(!ref)
                    setModal(false)
                })
                .catch(error => {
                    console.log(error);
                });

        } catch (error) {
            setLoading(false)
            console.log('Error  ', error)
        }

    }


    const getPhotosList = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/photos/user/${user?._id}`)

            if (response?.data) {
                return response?.data
            }
        } catch (error) {
            return error
        }
    }

    useEffect(() => {

        getPhotosList().then(photos => {
            setPhotosList(photos)
        })
            .catch(err => setError(err))
            .finally(() => {
                setLoaded(true);
            });

        return () => {
            setPhotosList();
            setLoaded();
            setError()
        }

    }, [ref])


    // {loaded && !error && console.log('Photos List  ', photosList)}

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{uri: `${BASE_URL}/${user?.avatar}`}} style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'gray' }} />

                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, color: '#9023c0', fontFamily: 'Playfair-Regular' }}>Hi,</Text>
                    <Text style={{ fontSize: 20, color: '#9023c0', fontFamily: 'Playfair-Bold' }}>{user?.name}</Text>
                </View>
            </View>

            <Text style={{ fontSize: 20, color: '#9023c0', fontFamily: 'Nunito-Bold', marginVertical: 10 }}>My Photos</Text>

            {loaded && !error && photosList && <FlatList
                data={photosList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PhotosDetail', {item})}
                        style={{ marginVertical: 5, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d5d5d5', borderRadius: 10, padding: 7, flexDirection: 'row' }}>
                        <Image source={{uri: `${BASE_URL}/${item?.images[0]}`}} style={{ width: 80, height: 80, backgroundColor: 'gray', borderRadius: 10 }} />
                        <View style={{ marginLeft: 7, flex: 1, justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Nunito-Bold', color: '#9023c0', fontSize: 16 }}>{item?.title}</Text>

                            <Text numberOfLines={2} style={{ fontFamily: 'Nunito-Regular', color: '#367438', fontSize: 13 }}>{item?.description}</Text>
                            <Text numberOfLines={2} style={{ fontFamily: 'Nunito-Bold', color: '#367438', fontSize: 13 }}>{Moment(item?.createdAt).format('MMM DD, YYYY  |  hh:mm A')}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />}

            {
                !loaded && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color={'#9023c0'} size={'large'} />
                </View>
            }

            {
                !loaded && !!error && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{error?.response?.data?.message}</Text>
                </View>
            }

            <TouchableOpacity
                onPress={() => setModal(true)}
                style={{ backgroundColor: '#9023c0', elevation: 3, position: 'absolute', bottom: 5, right: 0, width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25 }}>
                <Text style={{ fontFamily: 'Nunito-Bold', color: '#fff', fontSize: 30, marginBottom: 5 }}>+</Text>
            </TouchableOpacity>


            <Modal
                visible={modal}
                animationType={'slide'}
            >
                <View style={{ flex: 1, padding: 15 }}>

                    <Text style={{ color: '#9023c0', fontFamily: 'Playfair-SemiBold', fontSize: 20, marginBottom: 15 }}>Add Your Photos</Text>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >

                        <Text style={{ color: '#9023c0', fontFamily: 'Nunito-Bold', fontSize: 17, marginBottom: 5 }}>Title</Text>
                        <TextInput
                            onChangeText={setTitle}
                            style={{ borderWidth: 2, marginBottom: 10, borderRadius: 10, padding: 10, borderColor: '#9023c0', fontFamily: 'Nunito-Regular', fontSize: 16 }}
                            placeholder='Enter photos title'
                            placeholderTextColor={'gray'}
                        />

                        <Text style={{ color: '#9023c0', fontFamily: 'Nunito-Bold', fontSize: 17, marginBottom: 5 }}>Description</Text>
                        <TextInput
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={5}
                            textAlignVertical={'top'}
                            style={{ borderWidth: 2, marginBottom: 10, borderRadius: 10, padding: 10, borderColor: '#9023c0', fontFamily: 'Nunito-Regular', fontSize: 16 }}
                            placeholder='Enter photos description'
                            placeholderTextColor={'gray'}
                        />

                        <TouchableOpacity
                            onPress={openGallery}
                            style={{ padding: 10, borderRadius: 10, backgroundColor: '#9023c0', alignSelf: 'flex-end' }}>
                            <Icon name='camera' color={'#fff'} size={30} />
                        </TouchableOpacity>


                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 10 }}>
                            {
                                images != undefined && images.map((i, index) => (

                                    <Image key={index} source={{ uri: 'data:image/jpeg;base64,' + i?.base64 }} style={{ width: width * 0.28, height: width * 0.28, borderRadius: 10, borderWidth: 1, backgroundColor: 'gray', margin: 3 }} />

                                ))
                            }
                        </View>

                    </ScrollView>

                    <View style={{ flexDirection: 'row', width: '100%', marginBottom: -10, marginTop: 5 }}>
                        <TouchableOpacity
                            onPress={() => setModal(false)}
                            style={{ borderWidth: 2, backgroundColor: '#fff', flex: 1, marginRight: 10, borderColor: '#9023c0', borderRadius: 10, padding: 10 }}>
                            <Text style={{ color: '#9023c0', fontSize: 16, fontFamily: 'Nunito-SemiBold', alignSelf: 'center' }}>Close</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleUploadPhotos()}
                            style={{ flex: 1, backgroundColor: '#9023c0', borderRadius: 10, padding: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Nunito-SemiBold', alignSelf: 'center' }}>Save</Text>
                        </TouchableOpacity>
                    </View>


                </View>

                {
                    loading && <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(255,255,255,0.7)' }}><ActivityIndicator size={'large'} color={'#9023c0'} /></View>
                }
            </Modal>



        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default MHome;
