import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Camera } from 'expo-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFlipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);  // Store the captured photo URI
    } else {
      Alert.alert('Camera Error', 'Unable to capture photo.');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={handleFlipCamera}
          >
            <Ionicons name="ios-camera-reverse" size={40} color="white" />
          </TouchableOpacity>

          {/* Capture Photo Button */}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>

      {/* Display captured photo */}
      {photo && (
        <View style={styles.photoContainer}>
          <Text style={styles.photoLabel}>Captured Photo:</Text>
          <Image source={{ uri: photo }} style={styles.capturedPhoto} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    marginBottom: 30,
  },
  captureButton: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
  },
  photoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  capturedPhoto: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});

export default CameraScreen;

