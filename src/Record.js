import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity,Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
//Nguyễn Ngô Thế Cường :21521905
export default function Record({navigation}) {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [record, setRecord] = useState(null);
  const video = React.useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [status, setStatus] = React.useState({});
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');
    })();
  }, []);

  const takeVideo = async () => {
    if (camera) {
      setIsRecording(true);
      const data = await camera.recordAsync({
        maxDuration: 10
      });
      setIsRecording(false);
      setRecord(data.uri);
      console.log(data.uri);
    }
  };
//Nguyễn Ngô Thế Cường :21521905
  const stopVideo = () => {
    if (camera) {
      camera.stopRecording();
      setIsRecording(false);
    }
  };

  const reRecord = () => {
    setRecord(null);
  };

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const saveVideo = async () => {
    if (record) {
      const asset = await MediaLibrary.createAssetAsync(record);
     
      console.log('Video saved to gallery:', asset);
             navigation.navigate('My Gallery');
        
        Alert.alert('Success', 'Video saved successfully!');
    }
  };
  //Nguyễn Ngô Thế Cường :21521905
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        {record ? (
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: record,
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          />
        ) : (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.fixedRatio}
            type={type}
          >
            {/* //Nguyễn Ngô Thế Cường :21521905 */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              {isRecording ? (
                <TouchableOpacity
                  style={{ alignItems: 'center', marginBottom: 30 }}
                  onPress={() => stopVideo()}
                >
                  <Image source={require('../assets/stop.png')} style={styles.image2} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ alignItems: 'center', marginBottom: 30 }}
                  onPress={() => takeVideo()}
                >
                  <Image source={require('../assets/start.png')} style={styles.image2} />
                </TouchableOpacity>
              )}
            </View>
          </Camera>
        )}
{/* //Nguyễn Ngô Thế Cường :21521905 */}
        {record && (
          <View style={{ alignItems: 'center',flexDirection:'row',marginTop:5,alignSelf:'center'}}>
            <TouchableOpacity onPress={() => reRecord()} style={{width:120,height:40,backgroundColor:'red',borderRadius:10}}>
              <Text style={{alignSelf:'center',marginTop:5,fontSize:17,color:'white',fontWeight:'bold'}}>R-Record</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => saveVideo()} style={{width:80,height:40,backgroundColor:'blue',borderRadius:10}}>
              <Text style={{alignSelf:'center',marginTop:5,fontSize:17,color:'white',fontWeight:'bold'}}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  fixedRatio: {
    flex: 1,
  },
  video: {
    alignSelf: 'center',
    width: 860,
    height: 680,
},
  image2: {
    width: 50,
    height: 50,
  },
});
