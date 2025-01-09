import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';

const PrivacyDashboard = () => {
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    microphone: false,
    storage: false,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const mediaPermission = await MediaLibrary.requestPermissionsAsync();
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    const { status: microphoneStatus } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);

    setPermissions({
      camera: cameraPermission.status === 'granted',
      storage: mediaPermission.status === 'granted',
      location: locationPermission.status === 'granted',
      microphone: microphoneStatus === 'granted'
    });
  };

  const checkStoragePermission = async () => {
    try {
      const { status: existingStatus } = await MediaLibrary.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await MediaLibrary.requestPermissionsAsync(true);
        finalStatus = status;
      }
      
      setPermissions(prev => ({
        ...prev,
        storage: finalStatus === 'granted'
      }));
    } catch (error) {
      console.error('Storage permission error:', error);
    }
  };

  // Use effect to check storage permission when the component mounts
  useEffect(() => {
    checkStoragePermission();
  }, []);

  const handlePermissionRequest = async (permission) => {
    try {
      let status;
      switch (permission) {
        case 'camera':
          const cameraResult = await Camera.requestCameraPermissionsAsync();
          status = cameraResult.status;
          break;
        case 'storage':
          const mediaResult = await MediaLibrary.requestPermissionsAsync();
          status = mediaResult.status;
          break;
        case 'location':
          const locationResult = await Location.requestForegroundPermissionsAsync();
          status = locationResult.status;
          break;
        case 'microphone':
          const microphoneResult = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
          status = microphoneResult.status;
          break;
      }
      
      setPermissions(prev => ({
        ...prev,
        [permission]: status === 'granted'
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to request permission');
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'data_privacy':
        Alert.alert('Data Privacy', 'Your data is encrypted and stored securely on your device.');
        break;
      case 'security':
        Alert.alert('Security Settings', 'Configure your app security settings here.');
        break;
      case 'policy':
        Alert.alert('Privacy Policy', 'View our detailed privacy policy and terms of service.');
        break;
    }
  };

  const renderPermissionStatus = (permission) => {
    return (
      <View style={styles.permissionItem}>
        <Ionicons 
          name={permissions[permission] ? 'checkmark-circle' : 'close-circle'} 
          size={24} 
          color={permissions[permission] ? '#4CAF50' : '#F44336'}
        />
        <Text style={styles.permissionText}>
          {permission.charAt(0).toUpperCase() + permission.slice(1)}
        </Text>
        {!permissions[permission] && (
          <TouchableOpacity 
            style={styles.grantButton}
            onPress={() => handlePermissionRequest(permission)}
          >
            <Text style={styles.grantButtonText}>Grant</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Privacy Dashboard</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Device Permissions</Text>
        {renderPermissionStatus('camera')}
        {renderPermissionStatus('location')}
        {renderPermissionStatus('microphone')}
        {renderPermissionStatus('storage')}
      </View>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => handleAction('data_privacy')}
      >
        <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
        <Text style={styles.actionButtonText}>Data Privacy Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => handleAction('security')}
      >
        <Ionicons name="lock-closed-outline" size={24} color="#fff" />
        <Text style={styles.actionButtonText}>Security Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => handleAction('policy')}
      >
        <Ionicons name="document-text-outline" size={24} color="#fff" />
        <Text style={styles.actionButtonText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 15,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  grantButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  grantButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default PrivacyDashboard;
