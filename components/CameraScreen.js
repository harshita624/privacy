import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/styles';

const CameraScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaPermission, setHasMediaPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null); // Ref for the Camera
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    requestPermissions();
  }, []);

  // Request Camera and Media Library permissions
  const requestPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const mediaStatus = await MediaLibrary.requestPermissionsAsync();

    setHasCameraPermission(cameraStatus.status === 'granted');
    setHasMediaPermission(mediaStatus.status === 'granted');

    if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and media library permissions are required. Please enable them in your settings.'
      );
    }
  };

  // Capture a photo
  const handleTakePhoto = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          exif: true,
        });
        setCapturedPhoto(photo.uri);
        setIsModalVisible(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo.');
      }
    } else {
      Alert.alert('Camera not ready', 'Please wait for the camera to initialize.');
    }
  };

  // Save photo to media library
  const handleSavePhoto = async () => {
    if (hasMediaPermission && capturedPhoto) {
      try {
        const asset = await MediaLibrary.createAssetAsync(capturedPhoto);
        const album =
          (await MediaLibrary.getAlbumAsync('EnigmaLens')) ||
          (await MediaLibrary.createAlbumAsync('EnigmaLens', asset, false));
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        Alert.alert('Photo Saved', 'Photo saved to EnigmaLens album.');
        setIsModalVisible(false);
        setCapturedPhoto(null);
      } catch (error) {
        Alert.alert('Error', 'Failed to save photo.');
      }
    } else {
      Alert.alert('Permission Denied', 'Media library access is required to save photos.');
    }
  };

  // Toggle between front and back camera
  const toggleCameraType = () => {
    setCameraType((prev) =>
      prev === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  // Toggle flash mode
  const toggleFlashMode = () => {
    setFlashMode((prev) =>
      prev === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
    );
  };

  // Handle UI when permissions are not granted
  if (hasCameraPermission === null || hasMediaPermission === null) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Requesting permissions...</Text>
      </View>
    );
  }

  if (!hasCameraPermission || !hasMediaPermission) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Permissions are required to use the camera. Please enable them in your settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Camera
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        onCameraReady={() => setIsCameraReady(true)}
        ref={cameraRef} // Assign the camera reference
      >
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleFlashMode}>
            <Ionicons
              name={flashMode === Camera.Constants.FlashMode.off ? 'flash-off' : 'flash'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCameraType}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
      <View style={styles.bottomControls}>
        <TouchableOpacity onPress={handleTakePhoto}>
          <Ionicons name="camera" size={36} color="white" />
        </TouchableOpacity>
      </View>
      {isModalVisible && (
        <Modal animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: capturedPhoto }} style={styles.modalImage} />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSavePhoto}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CameraScreen;
