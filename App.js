import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, Modal, Animated, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.homeContainer}>
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Enigma Lens</Text>
        <Text style={styles.subtitle}>Capture moments with privacy</Text>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.navigationButtonText}>Enter Camera</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [mediaPermission, setMediaPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [camera, setCamera] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    (async () => {
      // Request both camera and media library permissions
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      
      setHasPermission(cameraStatus.status === 'granted');
      setMediaPermission(mediaStatus.status === 'granted');
      
      // If permissions are denied, show alert with instructions
      if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'This app needs camera and media library access to function properly. Please enable them in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() }
          ]
        );
      }
    })();
  }, []);

  const openSettings = async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleTakePhoto = async () => {
    if (camera && isCameraReady) {
      try {
        const photo = await camera.takePictureAsync({
          quality: 1,
          exif: true,
        });
        setCapturedPhoto(photo.uri);
        setIsModalVisible(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
    }
  };

  const handleSavePhoto = async () => {
    if (mediaPermission && capturedPhoto) {
      try {
        const asset = await MediaLibrary.createAssetAsync(capturedPhoto);
        await MediaLibrary.createAlbumAsync('EnigmaLens', asset, false);
        Alert.alert('Success', 'Photo saved to EnigmaLens album!');
        handleCloseModal();
      } catch (error) {
        Alert.alert('Error', 'Failed to save photo. Please try again.');
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const toggleFlashMode = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCapturedPhoto(null);
  };

  if (hasPermission === null || mediaPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing camera...</Text>
      </View>
    );
  }

  if (hasPermission === false || mediaPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Camera or Media Library access denied</Text>
        <TouchableOpacity style={styles.retryButton} onPress={openSettings}>
          <Text style={styles.retryButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        onCameraReady={() => setIsCameraReady(true)}
        ref={(ref) => setCamera(ref)}
      >
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlashMode}>
            <Ionicons
              name={flashMode === Camera.Constants.FlashMode.off ? 'flash-off' : 'flash'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraType}>
            <Ionicons name="camera-reverse" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Camera>
      
      {isCameraReady && (
        <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      )}

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSavePhoto}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = route.name === 'Home' ? 'home' : 'camera';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            backgroundColor: '#1f2937',
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
            paddingBottom: 8,
          },
          headerStyle: {
            backgroundColor: '#1f2937',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    padding: 12,
    borderRadius: 50,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    backgroundColor: '#6366f1',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  capturedImage: {
    width: '90%',
    height: '70%',
    borderRadius: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  modalButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#6366f1',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App;