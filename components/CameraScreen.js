import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
  SafeAreaView, 
  Platform,
  Linking,
  ActivityIndicator
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    requestPermissions();
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      if (isMounted.current) {
        setHasPermission(cameraStatus.status === 'granted');
      }
      
      if (cameraStatus.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to use this feature. Please enable it in your device settings.',
          [
            { 
              text: 'OK', 
              onPress: () => console.log('Permission denied')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request camera permissions');
    }
  };

  const handleFlipCamera = () => {
    setType(prevType =>
      prevType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera not ready');
      return;
    }

    if (!hasPermission) {
      Alert.alert('Error', 'Camera permission not granted');
      return;
    }

    try {
      setIsProcessing(true);
      const options = {
        quality: 0.9,
        base64: false,
        skipProcessing: Platform.OS === 'android', // Skip processing only on Android
        exif: false,
      };

      const photo = await cameraRef.current.takePictureAsync(options);
      
      if (isMounted.current) {
        setPhoto(photo.uri);
        setIsPreview(true);
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setIsPreview(false);
  };

  const savePhoto = () => {
    Alert.alert('Success', 'Photo saved successfully!');
    retakePhoto();
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access denied</Text>
        <Text style={styles.permissionSubText}>
          Please enable camera access in your device settings to use this feature.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.permissionButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {!isPreview ? (
        <Camera 
          style={styles.camera} 
          type={type} 
          ref={cameraRef}
          onMountError={(error) => {
            console.error("Camera mount error:", error);
            Alert.alert("Error", "Failed to start camera");
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={handleFlipCamera}
              disabled={isProcessing}
            >
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePhoto}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <View style={styles.captureCircle} />
              )}
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: photo }} 
            style={styles.previewImage}
            resizeMode="contain"
          />
          <View style={styles.previewButtons}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={retakePhoto}
            >
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewButton, styles.saveButton]}
              onPress={savePhoto}
            >
              <Ionicons name="checkmark" size={24} color="white" />
              <Text style={styles.previewButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  flipButton: {
    padding: 15,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  previewButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  permissionSubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  permissionButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CameraScreen;