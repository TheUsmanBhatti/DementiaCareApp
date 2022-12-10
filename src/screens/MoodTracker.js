//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image, PermissionsAndroid, Alert, ActivityIndicator } from 'react-native';

import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window')

import axios from 'axios';
import { BASE_URL } from './baseURL';

// create a component
const MoodTracker = () => {

  const [imageUriGallary, setimageUriGallary] = useState()
  const [imageDetail, setimageDetail] = useState()
  const [loaded, setLoaded] = useState(true);
  const [error, setError] = useState();

  const [loading, setLoading] = useState(false)

  const [base64, setBase64] = useState('')

  const [resImage, setResImage] = useState('')

  const openCamera = async () => {
    let options = {
      maxHeight: 1000,
      maxWidth: 1000,
      quality: 1,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64: true,
    };

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        launchCamera(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
          } else {
            // You can also display the image using data:
            const source = {
              uri: 'data:image/jpeg;base64,' + response.assets[0].base64
            };
            // console.log(response?.assets[0])
            setimageUriGallary(source);
            setBase64(response.assets[0].base64)
            setimageDetail(response?.assets[0]);
          }
        });
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const openGallery = () => {

    const options = {
      maxHeight: 1000,
      maxWidth: 1000,
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
        const source = {
          uri: 'data:image/jpeg;base64,' + response.assets[0].base64
        };
        setimageUriGallary(source);
        setBase64(response.assets[0].base64)
        setimageDetail(response?.assets[0]);

      }
    });
  };


  const uploadImage = async () => {

    try {
      setLoading(true)
      console.log('Loading ....')
      const res = await axios.post(`${BASE_URL}/modeloutput`, {
        base64string: base64
      })

      if (res?.data) {
        // console.log('Res   ', res?.data?.image)

        const source = {
          uri: 'data:image/jpeg;base64,' + res?.data?.image
        };

        setLoading(false)
        setResImage(source)
        console.log('Loading Complete')
      }

    } catch (error) {
      setLoading(false)
      console.log('Loading Complete')
      console.log('Error  --- ', error)
    }
  }


  return (
    <View style={{ flex: 1 }}>

      <ScrollView style={styles.container}>


        <Image source={imageUriGallary ? imageUriGallary : null} style={{ width: '100%', height: 450, backgroundColor: 'gray', marginBottom: 15, borderRadius: 15 }} />


        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={openCamera}
            style={{ backgroundColor: '#9023c0', flex: 1, marginRight: 10, borderRadius: 10, padding: 10 }}>
            <Text style={{ color: '#fff', alignSelf: 'center' }}>Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openGallery}
            style={{ backgroundColor: '#9023c0', flex: 1, borderRadius: 10, padding: 10 }}>
            <Text style={{ color: '#fff', alignSelf: 'center' }}>Open Gallery</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={uploadImage}
          style={{ backgroundColor: '#9023c0', borderRadius: 10, padding: 10, marginVertical: 10, alignSelf: 'center' }}>
          <Text style={{ color: '#fff', alignSelf: 'center' }}>Upload</Text>
        </TouchableOpacity>

        {console.log(resImage)}

        {
          resImage && <Image source={resImage ? resImage : null} style={{ width: '100%', height: 450, backgroundColor: 'gray', marginBottom: 15, borderRadius: 15 }} />
        }
      </ScrollView>

      {
        loading && <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff4f' }}>
          <Text style={{fontSize: 16, fontFamily: 'Nunito-Bold', color: '#9023c0'}}>Processing...</Text>

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
    backgroundColor: '#fff'
  },
});

//make this component available to the app
export default MoodTracker;
