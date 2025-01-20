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
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const CAPTURE_SIZE = Math.floor(WINDOW_WIDTH * 0.2);

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    requestPermissions();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const requestPermissions = async () => {
    try {
      console.log('Requesting camera permissions...');
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status:', cameraStatus.status);
      
      if (isMounted.current) {
        setHasPermission(cameraStatus.status === 'granted');
      }
      
      if (cameraStatus.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to use this feature. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request camera permissions');
    }
  };

  const onCameraReady = () => {
    console.log('Camera is ready');
    setIsCameraReady(true);
  };

  const handleFlipCamera = () => {
    if (!isCameraReady) {
      Alert.alert('Error', 'Camera is not ready yet');
      return;
    }
    setType(prevType =>
      prevType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePhoto = async () => {
    console.log('Attempting to take photo...');
    console.log('Camera ready state:', isCameraReady);
    console.log('Camera ref exists:', !!cameraRef.current);

    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera not ready');
      return;
    }

    if (!isCameraReady) {
      Alert.alert('Error', 'Please wait for camera to finish loading');
      return;
    }

    if (!hasPermission) {
      Alert.alert('Error', 'Camera permission not granted');
      return;
    }

    try {
      setIsProcessing(true);
      const options = {
        quality: 0.85,
        base64: false,
        skipProcessing: Platform.OS === 'android',
        exif: false,
      };

      console.log('Taking picture with options:', options);
      const photo = await cameraRef.current.takePictureAsync(options);
      console.log('Photo taken:', photo.uri);
      
      if (isMounted.current) {
        setPhoto(photo.uri);
        setIsPreview(true);
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', `Failed to take picture: ${error.message}`);
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
    <SafeAreaView style={styles.container}>
      {!isPreview ? (
        <View style={styles.cameraContainer}>
          <Camera 
            style={styles.camera} 
            type={type} 
            ref={cameraRef}
            onCameraReady={onCameraReady}
            onMountError={(error) => {
              console.error("Camera mount error:", error);
              Alert.alert("Error", `Failed to start camera: ${error.message}`);
            }}
            useCamera2Api={Platform.OS === 'android'}
          >
            {isCameraReady ? (
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
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Camera is initializing...</Text>
              </View>
            )}
          </Camera>
        </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  camera: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  flipButton: {
    padding: 15,
  },
  captureButton: {
    width: CAPTURE_SIZE,
    height: CAPTURE_SIZE,
    borderRadius: Math.floor(CAPTURE_SIZE / 2),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureCircle: {
    width: Math.floor(CAPTURE_SIZE - 10),
    height: Math.floor(CAPTURE_SIZE - 10),
    borderRadius: Math.floor((CAPTURE_SIZE - 10) / 2),
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