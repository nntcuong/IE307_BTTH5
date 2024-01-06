import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { reverseGeocodeAsync } from 'expo-location';

const Map = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  };

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    // const { latitude, longitude } = coordinate;
    // const address = await reverseGeocodeAsync({
    //   latitude,
    //   longitude,
    // });

    // const newFormattedAddress = address
    //   .map(
    //     (address) =>
    //       `${address.streetNumber} ${address.street}, ${address.city}, ${address.region}, ${address.country}`
    //   )
    //   .join(', ');

    // setFormattedAddress(newFormattedAddress);
    // console.log('Current Address:', newFormattedAddress);

    // // Mở modal khi người dùng nhấn vào màn hình
   
  };

  const handleMarkerPress = () => {
    // Xử lý khi Marker được nhấn
    console.log('Marker pressed:', selectedLocation);

    // Mở modal khi người dùng nhấn vào Marker
   
  };

  const handleSavePress = () => {
    // Handle save press to navigate back and set the selected location
    navigation.navigate('Add a new Place', {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      });
      //navigation.navigate('Add a new Place', {note.location});
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
              onPress={handleMarkerPress}
            />
          )}
        </MapView>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Formatted Address:</Text>
          <Text style={styles.modalText}>{formattedAddress}</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={toggleModal}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Map;
