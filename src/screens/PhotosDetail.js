//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';

import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';

// create a component
const PhotosDetail = ({navigation, route}) => {

    const { width, height } = Dimensions.get('window')

    const [speaking, setSpeaking] = useState(false)

    const photosData = route.params.item

    if(speaking){
        Tts.getInitStatus().then(() => {
            Tts.speak(photosData?.description);
          });
    }else{
        Tts.stop();
    }

    return (
        <ScrollView style={styles.container}>

            <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{backgroundColor: '#fff', padding: 5, borderRadius: 50, position: 'absolute', top: 20, left: 20, zIndex: 10}} >
                <Icon name='chevron-back' size={25} color='#9023c0' />
            </TouchableOpacity>

            <FlatList
                showsHorizontalScrollIndicator={false}
                data={photosData?.images}
                horizontal
                pagingEnabled
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <Image source={{ uri: `http://192.168.0.110:3333${item}` }} style={{ width: width * 0.949, height: height * 0.6, margin: 10, backgroundColor: 'gray', borderRadius: 15 }} />
                    </TouchableOpacity>
                )}
            />


            <View style={{ padding: 10 }}>

                <TouchableOpacity
                    onPress={() => {
                        setSpeaking(!speaking)
                     }}
                    style={{padding: 10, backgroundColor: '#9023c0', borderRadius: 50, position: 'absolute', right: 15}}
                >
                    <Icon name= {speaking ? 'stop' : 'md-volume-high'} size={20} color={'#fff'} />
                </TouchableOpacity>

                <Text style={{ fontSize: 20, fontFamily: 'Playfair-SemiBold', color: '#9023c0', marginTop: 10 }}>{photosData?.title}</Text>

                <Text style={{ fontFamily: 'Nunito-Regular', marginTop: 5, marginBottom: 15, color: '#b02aeb' }}>{photosData?.description}</Text>

                <Text style={{ fontFamily: 'Nunito-Regular', marginTop: 5, marginBottom: 15, color: '#000' }}>
                    <Text style={{ fontFamily: 'Nunito-Bold' }}>Created On: </Text>
                    <Text>{Moment(photosData?.createdAt).format('MMM DD, YYYY  |  hh:mm A')}</Text>
                </Text>
            </View>

        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // padding: 10
    },
});

//make this component available to the app
export default PhotosDetail;
