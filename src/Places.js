import { StatusBar } from 'expo-status-bar';
import React , { useContext }from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import AddPlace from './AddPlace';
import MyPlaces from './MyPlaces';
import { NavigationContainer } from '@react-navigation/native';
import Map from './Map';
export default function Places({ navigation }) {
  return (
  
    <Stack.Navigator>
      <Stack.Screen
        name="My Places"
        component={MyPlaces}
        options={{
          headerRight: () => (
            <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate('Add a new Place')}>
               <Image source={require('../assets/add.png')} style={styles.add}/>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Add a new Place" component={AddPlace} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAdd: {
  
    marginRight:15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  add: {

   height:40,
   height:40,

  },
});
