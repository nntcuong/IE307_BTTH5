import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { reverseGeocodeAsync } from 'expo-location';
 //Nguyễn Ngô Thế Cường :21521905
const Map = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [newFormattedAddress, setNewFormattedAddress] = useState('');
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
    const { latitude, longitude } = coordinate;
  
  };
   //Nguyễn Ngô Thế Cường :21521905
  const [markerTitle, setMarkerTitle] = useState('Initial Marker Title');
  const handleMarkerPress = async () => {
    try {
      const address = await reverseGeocodeAsync({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });

      if (address && address.length > 0) {
        const formattedAddress = address
          .map(
            (addressComponent) =>
              `${addressComponent.streetNumber} ${addressComponent.street}, ${addressComponent.city}, ${addressComponent.region}, ${addressComponent.country}`
          )
          .join(', ');

        setNewFormattedAddress(formattedAddress);
        console.log('Current Address:', formattedAddress);
        setMarkerTitle(formattedAddress);
      } else {
        console.log('No address found for the selected location.');
      }
    } catch (error) {
      console.error('Error while reverse geocoding:', error);
    }
  };
  const handleSavePress = () => {
    
    navigation.navigate('Add a new Place', {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      });
     
  };
 //Nguyễn Ngô Thế Cường :21521905
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleMarkerPressTitle = (title) => {
    setMarkerTitle(title);
  };
  //const [markerTitle, setMarkerTitle] = useState(formattedAddress);
  
  useEffect(() => {
    setMarkerTitle(formattedAddress);
  }, [formattedAddress]);
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
              title={markerTitle}
              onPress={() => {
                handleMarkerPress();
             
              }}
            />
          )}
        </MapView>
      )}
 {/* //Nguyễn Ngô Thế Cường :21521905 */}
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
 //Nguyễn Ngô Thế Cường :21521905
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
   //Nguyễn Ngô Thế Cường :21521905
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Map;
