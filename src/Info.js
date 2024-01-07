import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const Info = ({ route, navigation }) => {
  //const route = useRoute();
  const { note } = route.params;
  return (
    <View style={styles.container}>
      
        <Image source={{ uri: note.image }} style={styles.image} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', alignItems: 'center' }}>{note.formattedAddress}</Text>
  
     
        <TouchableOpacity onPress={() => navigation.navigate('Map Info', { note})}>
          <View style={{ borderWidth: 2, borderColor: '#87CEEB', flexDirection: 'row' }}>
            <Image source={require('../assets/map2.png')} style={styles.image2}></Image>
            <Text style={{ marginTop: 5, marginRight: 10 }}>View on Map</Text>
          </View>
        </TouchableOpacity>
  
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',

  },
  buttonAdd: {
    backgroundColor: 'orange',
    borderRadius: 25,
    width: 31,
    height: 31,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
  },
  image: {
    width: '100%',
    height: '75%',
  },
  image2: {
    width: 20,
    height: 20,
    marginBottom: 5,
    marginTop: 5,
    marginHorizontal: 5,
  },
});

export default Info