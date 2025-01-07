import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text style={styles.loadingText}>Requesting Camera Permission...</Text>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Denied</Text>
        <Text style={styles.permissionMessage}>Please enable camera permissions in your settings.</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Screen</Text>
      <Camera style={styles.camera} ref={(ref) => setCamera(ref)} />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#00B0FF',
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: '60%',
    backgroundColor: 'gray',
    borderRadius: 20,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#00B0FF',
    padding: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FF0000',
    marginBottom: 15,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 18,
    color: '#B0B0B0',
    marginBottom: 30,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#00B0FF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 10,
    elevation: 4,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default CameraScreen;

