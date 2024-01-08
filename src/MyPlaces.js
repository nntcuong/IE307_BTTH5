import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('place.db');

export default function MyPlaces({ route, navigation }) {
  const [place, setPlaces] = useState([]);

  const fetchData = () => {
    try {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM place;',
            [],
            (_, { rows }) => {
              const data = rows['_array'];
              setPlaces(data);
            },
            (error) => {
              console.error('Error fetching places:', error);
            }
          );
        },
        
        null,
        null
      );
     
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deletePlaceInDatabase = (id) => {
    try {
      db.transaction(
        (tx) => {
          tx.executeSql('DELETE FROM place WHERE id = ?;', [id]);
        },
        null,
        null
      );
      fetchData(); // Fetch updated data after deletion
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  return (
    <View style={styles.container}>
      {place.length > 0 ? (
        <FlatList
          style={styles.FlatList}
          data={place}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Info', { note: item })}>
              <View style={{ flexDirection: 'row', marginTop: 15, backgroundColor: 'white' }}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.item}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.title}</Text>
                  <TouchableOpacity onPress={() => deletePlaceInDatabase(item.id)}>
                    <Text style={{ color: 'red', fontSize: 18, marginLeft: 10 }}>X</Text>
                  </TouchableOpacity>
                  <Text style={{ marginRight: 40 }}>{item.formattedAddress}</Text>
                  <Text style={{ marginRight: 40 }}>{item.latitude}</Text>
                  <Text style={{ marginRight: 40 }}>{item.longitude}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No places added yet - start adding some!</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  item: {
    padding: 10,
  },
  FlatList: {
    // backgroundColor: 'white',
  },
  image: {
    width: 80,
    height: 120,
    justifyContent: 'center',
  },
});
