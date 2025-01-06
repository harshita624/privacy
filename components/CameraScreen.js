import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/styles';

const CameraScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaPermission, setHasMediaPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      setIsModalVisible(true); // Show modal if permissions are not granted
    }
  };

  const handleGrantPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const mediaStatus = await MediaLibrary.requestPermissionsAsync();

    if (cameraStatus.status === 'granted' && mediaStatus.status === 'granted') {
      setHasCameraPermission(true);
      setHasMediaPermission(true);
      setIsModalVisible(false);
    } else {
      Alert.alert('Permissions Required', 'Please grant camera and media permissions.');
    }
  };

  if (hasCameraPermission === null || hasMediaPermission === null) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Requesting permissions...</Text>
      </View>
    );
  }

  if (!hasCameraPermission || !hasMediaPermission) {
    return (
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Please grant camera permissions to use this feature.</Text>
          <TouchableOpacity style={styles.modalButton} onPress={handleGrantPermissions}>
            <Text style={styles.modalButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        onCameraReady={() => setIsCameraReady(true)}
      >
        {/* Camera UI and functionality */}
      </Camera>
    </View>
  );
};

export default CameraScreen;
