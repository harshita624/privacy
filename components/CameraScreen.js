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
    backgroundColor: '#121212', // Dark gray for background
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
    marginBottom: 40, // Adjust margin to make the buttons stand out more
  },
  flipButton: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly more transparent for a modern look
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: '#000', // Subtle shadow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // Elevation for Android
  },
  captureButton: {
    padding: 20,
    backgroundColor: '#1abc9c', // Teal for a fresh, modern look
    borderRadius: 50,
    shadowColor: '#000', // Subtle shadow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4, // Elevation for Android
  },
  photoContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 18,
    color: '#fff', // White text for contrast on dark background
    marginBottom: 10,
    fontWeight: '600', // Slightly bolder for readability
  },
  capturedPhoto: {
    width: 300,
    height: 300,
    borderRadius: 15, // Slightly more rounded for a modern feel
    borderWidth: 2,
    borderColor: '#1abc9c', // Teal border to match the accent color
    marginTop: 20,
  },
});


export default CameraScreen;

