import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList } from 'react-native';
import React, { useContext,useState, useRef,useEffect } from 'react';

import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
export default function Media({navigation}) {
  const [media, setMedia] = useState([]);
 //Nguyễn Ngô Thế Cường :21521905
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === 'granted') {
        const mediaAssets = await MediaLibrary.getAssetsAsync({ first: 10, mediaType: ['photo', 'video'] });
        setMedia(mediaAssets.assets);
      }
    })();
  }, []);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
        {item.mediaType === 'photo' ? (
          <Image source={{ uri: item.uri }} style={{ width: 180, height: 200, margin: 5 }} />
        ) : (
          // You can customize the video thumbnail or use a placeholder image.
          <Image source={{ uri: 'https://example.com/placeholder-video-thumbnail.jpg' }} style={{ width: 150, height: 150, margin: 5 }} />
        )}
      </TouchableOpacity>
    );
  };
  //Nguyễn Ngô Thế Cường :21521905
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.08, backgroundColor: 'white', flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
        <Text style={{ justifyContent: 'center', alignSelf: 'center', fontSize: 17, marginLeft: 15, fontWeight: 'bold' }}>My Gallery</Text>
       <TouchableOpacity onPress={() => navigation.navigate('Record Video')}>
        <Image source={require('../assets/record.png')} style={styles.icon}>
        </Image>
        </TouchableOpacity>
      </View>
      <View style={{flex:0.92,alignItems:'center'}}>
      <FlatList
        data={media}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
      </View>
    </View>
  );
}
//Nguyễn Ngô Thế Cường :21521905
const styles = StyleSheet.create({
  container: {
    flex: 1,


  },
  icon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    tintColor: 'red',
    marginTop: 10,
    marginRight: 15,
  }
});
