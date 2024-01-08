import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Recording } from 'expo-av/build/Audio';
import Media from './Media';
import Record from './Record';
const Stack = createNativeStackNavigator();
//Nguyễn Ngô Thế Cường :21521905
const MyGallery = () => {
  return (
   
    <Stack.Navigator>
      
      <Stack.Screen name="My Gallery" component={Media} options={{ headerShown: false }}/>
      <Stack.Screen name="Record Video" component={Record} />
    {/* <Tab.Screen name="Record Video" component={Record} options={{ headerShown: true }}/> */}
    </Stack.Navigator>
    
  )
}

export default MyGallery