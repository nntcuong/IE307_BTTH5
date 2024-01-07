import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList } from 'react-native';
import React, { useContext,useState, useRef,useEffect } from 'react';
//import { MediaLibrary } from 'expo-media-library';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
export default function Media({navigation}) {
  const [media, setMedia] = useState([]);
  const [numColumns, setNumColumns] = useState(2);
  
  useEffect(() => {
    (async () => {
      await getMediaAssets();
    })();
  }, []);

  const getMediaAssets = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const mediaAssets = await MediaLibrary.getAssetsAsync();
      setMedia(mediaAssets.assets);
    }
  };
  const handlePress = async () => {
    // Perform the logic for taking a photo here
    // ...

    // After taking the photo, refresh the media list
    await getMediaAssets();
  };
  const toggleNumColumns = () => {
    setNumColumns((prevNumColumns) => (prevNumColumns === 2 ? 1 : 2));
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.08, backgroundColor: 'white', flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
        <Text style={{ justifyContent: 'center', alignSelf: 'center', fontSize: 17, marginLeft: 15, fontWeight: 'bold' }}>My Gallery</Text>
       <TouchableOpacity onPress={() => navigation.navigate('Record Video')}>
        <Image source={require('../assets/record.png')} style={styles.icon}>
        </Image>
        </TouchableOpacity>
      </View>
      <View style={{flex:0.92}}>
      <FlatList
        data={media}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            {item.mediaType === 'video' ? (
              <Video
              source={{ uri: item.uri }}
              style={{ width: 100, height: 100 }}
              resizeMode="cover"
              useNativeControls
            />
              
            ) : (
              <Image
                source={{ uri: item.uri }}
                style={{ width: 180, height: 135,marginTop:10,alignContent:'center' }}
              />
            )}
          </TouchableOpacity>
        )}
      />
      </View>
    </View>
  );
}

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
