import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
// Remove the following line if useNavigation is not used
import { useNavigation } from '@react-navigation/native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('place.db');
export default function AddPlace({ route, navigation }) {

  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationImage, setLocationImage] = useState(null);
  const [image, setImage] = useState(null);
  // const  [latitude,setLatitude]=useState('');
//   const [latitude, setLatitude] = useState(null);
// const [longitude, setLongitude] = useState(null);
//const { latitude, longitude } = route.params;
// if (route.params === null) {
//   setLatitude(null);
//   setLongitude(null);
// } 
// else {
//   const { latitude: newLatitude, longitude: newLongitude } = route.params;
//   setLatitude(newLatitude);
//   setLongitude(newLongitude);
// }




  const handleTextInputChange = (text) => {
    setTitle(text);
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập ảnh',
          'Bạn cần cấp quyền truy cập thư viện ảnh để có thể chọn ảnh.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);
  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("URI of the selected image:", result.uri);
      setImage(result.uri);
    }
  };
  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("URI of the taken image:", result.uri);
      setImage(result.uri);
    } else if (result.cancelled && result.errorCode === 'E_PERMISSION_MISSING') {
      Alert.alert(
        'Quyền truy cập camera',
        'Bạn cần cấp quyền truy cập camera để có thể sử dụng chức năng này.',
        [{ text: 'OK' }]
      );
    }
  };

  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Handle permission not granted
      } else {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      }
    })();
  }, []);

  const locateUser = async () => {
    const location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
  };
  const [region, setRegion] = useState(null);

  // useEffect(() => {

  //   getCurrentLocation();
  // }, []);
  const [formattedAddress, setFormattedAddress] = useState('');
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setRegion({
          //...region,
          latitude: latitude, // Update latitude
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421, // Update longitude
        });

        const address = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const newFormattedAddress = address
          .map(
            (address) =>
              `${address.streetNumber} ${address.street}, ${address.city}, ${address.region}, ${address.country}`
          )
          .join(', ');

        setFormattedAddress(newFormattedAddress);
        console.log('Current Address:', newFormattedAddress);
      } else {
        console.log('Permission to access location was denied');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };
  // useEffect(() => {
  //   if (route.params && route.params.customLatitude && route.params.customLongitude) {
  //     // Set the values of customLatitude and customLongitude
  //     const { customLatitude, customLongitude } = route.params;
  //     // Use these values as needed in your component
  //     // For example, you might want to call getCustomLocation with these values
  //     getCustomLocation(customLatitude, customLongitude);
  //   }
  // }, [route.params]);
  // const customLatitude = 16.462126;
  // const customLongitude = 107.592976;
  const { latitude = 0, longitude = 0 } = route.params || {};
const customLatitude = latitude;
const customLongitude = longitude;
const getCustomLocation = async (customLatitude, customLongitude) => {
  navigation.navigate('Map');

  try {
    if (typeof customLatitude === 'number' && typeof customLongitude === 'number') {
      const latitude = customLatitude;
      const longitude = customLongitude;

      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const newFormattedAddress = address
        .map(
          (address) =>
            `${address.streetNumber} ${address.street}, ${address.city}, ${address.region}, ${address.country}`
        )
        .join(', ');

      setFormattedAddress(newFormattedAddress);
      console.log('Custom Location Address:', newFormattedAddress);
    } else {
      console.error('Invalid latitude or longitude values');
    }
  } catch (error) {
    console.error('Error getting custom location:', error);
  }
};


  const addPlace = () => {
    const newPlace = {
      title: title,
      formattedAddress: formattedAddress,
    };

    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO place (title, image, formattedAddress, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
          [title, image, formattedAddress, customLatitude, customLongitude],
          (_, { insertId }) => {
            console.log('Place saved with ID:', insertId);
            console.log('Current Address:', formattedAddress);

            Alert.alert('Success', 'Đã thêm địa điểm thành công!', [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK Pressed');
                  navigation.navigate('My Places');
                },
              },
            ]);
          },
          (error) => {
            console.error('Error saving place:', error);
          }
        );
      },
      null,
      null
    );
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Title
          {/* //    <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text> */}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập vào đây"
          onChangeText={handleTextInputChange}
          value={title}
        />
      </View>
      <View style={{ flex: 0.4 }}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.noImageContainer}>
              <Text>No image taken yet</Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginTop: 10 }}>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.greenBorder}>

              <Image source={require('../assets/image.png')} style={styles.image2}>

              </Image>
              <Text style={styles.text}>Pick Image</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={takeImage}>
            <View style={styles.greenBorder}>

              <Image source={require('../assets/camera.png')} style={styles.image2}>

              </Image>
              <Text style={styles.text}>Take Image</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
      <View style={{ flex: 0.4, marginTop: 60, }}>
        <View style={{ flex: 0.8 }}>

          {region ? (
            <View style={{ flex: 1 }}>
              <MapView style={{ flex: 2 }} region={region}>
                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
              </MapView>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={styles.noImageContainer}>
                <Text>No location picked yet</Text>
              </View>
            </View>
          )}
        </View>
        <View style={{ flex: 0.2, marginTop: 70, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginTop: 10, }}>
          <TouchableOpacity onPress={getCurrentLocation}>
          {/* <TouchableOpacity> */}
            <View style={styles.greenBorder}>

              <Image source={require('../assets/map.png')} style={styles.image2}>

              </Image>
              <Text style={styles.text}>Locate User</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.navigate('Map')}> */}
          <TouchableOpacity onPress={() => getCustomLocation(customLatitude, customLongitude)}>
            <View style={styles.greenBorder}>

              <Image source={require('../assets/map2.png')} style={styles.image2}>

              </Image>
              <Text style={styles.text}>Pick on Map</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>


      <View style={{ flex: 0.1, marginTop: 20 }}>
        <Button title="Add Place" onPress={addPlace}>

        </Button>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 340,
    height: 260,
    marginBottom: 20,
  },
  noImageContainer: {
    width: 380,
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  greenBorder: {
    borderWidth: 2,
    borderColor: '#00BFFF',
    padding: 3,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    justifyContent: 'center',
    fontSize: 13,
    textAlignVertical: 'center',
    marginRight: 20,

  },
  image2: {
    width: 25,
    height: 25,
    marginLeft: 15,
  },
  noLocationContainer: {
    width: "98%", height: 180, alignSelf: 'center',
    backgroundColor: '#808080'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
  },


});
