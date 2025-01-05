import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, TouchableOpacity, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Camera } from 'expo-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from hiding

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Welcome to Privacy App</Text>
      <Text style={styles.subtitle}>Manage your privacy settings easily.</Text>
      <Button
        title="Go to Camera"
        onPress={() => navigation.navigate('Camera')}
        color="#4CAF50"
      />
    </View>
  );
};

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [camera, setCamera] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getPermission();
  }, []);

  const handleTakePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setCapturedPhoto(photo.uri);
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCapturedPhoto(null);
  };

  if (hasPermission === null) {
    return <Text style={styles.loadingText}>Requesting permission...</Text>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No access to camera. Please grant permission to take photos.</Text>
        <Button
          title="Retry"
          onPress={() => Camera.requestCameraPermissionsAsync().then(({ status }) => setHasPermission(status === 'granted'))}
          color="#4CAF50"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onCameraReady={() => setIsCameraReady(true)}
        ref={(ref) => setCamera(ref)}
      />
      {isCameraReady && (
        <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
          <Ionicons name="camera" size={40} color="#fff" />
        </TouchableOpacity>
      )}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
          <View style={styles.modalButtons}>
            <Button title="Close" onPress={handleCloseModal} color="#FF5252" />
            <Button title="Save" onPress={() => Alert.alert('Photo saved!')} color="#4CAF50" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => {
    SplashScreen.hideAsync(); // Hide splash screen
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Camera') {
              iconName = 'camera';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8', // Light, neutral background
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e88e5', // Modern blue for primary color
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#616161', // Subtle gray for secondary text
    textAlign: 'center',
    marginBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#1e88e5', // Matches the title color
    borderRadius: 50,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#9e9e9e', // Subtle gray
    textAlign: 'center',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9eaea', // Light red for error background
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d32f2f', // Red for errors
    textAlign: 'center',
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  capturedImage: {
    width: '80%',
    height: '60%',
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '70%',
    marginTop: 16,
  },
  modalButton: {
    backgroundColor: '#1e88e5',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});


export default App;
