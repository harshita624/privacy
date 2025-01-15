import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera } from 'expo-camera';

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [hasPermission, setHasPermission] = useState(null);
  const [deviceQueue, setDeviceQueue] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0); // Track the current device in the queue

  // Sample devices trying to access camera
  useEffect(() => {
    const devices = [
      { id: 'device1', name: 'Device 1' },
      { id: 'device2', name: 'Device 2' },
      { id: 'device3', name: 'Device 3' },
    ];
    setDeviceQueue(devices);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1.2,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();

    // Simulate granting access to the first device in the queue
  }, []);

  // Function to grant access to the current device
  const grantCameraAccess = async (device) => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setHasPermission(true);
      Alert.alert(`${device.name} has been granted access!`);
    } else {
      setHasPermission(false);
      Alert.alert(`${device.name} was denied access.`);
    }

    // Move to the next device after granting access
    moveToNextDevice();
  };

  // Move to the next device in the queue
  const moveToNextDevice = () => {
    if (currentDeviceIndex < deviceQueue.length - 1) {
      // Increase the index to point to the next device in the queue
      setCurrentDeviceIndex(currentDeviceIndex + 1);
    } else {
      Alert.alert('All devices have been granted access.');
    }
  };

  const currentDevice = deviceQueue[currentDeviceIndex]; // Get the current device from the queue

  return (
    <View style={styles.homeContainer}>
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <Animated.Text style={[styles.title, { transform: [{ scale: scaleAnim }] }]}>
          Enigma Lens
        </Animated.Text>
        <Text style={styles.subtitle}>Capture moments with privacy</Text>

        {currentDevice ? (
          <View style={styles.deviceContainer}>
            <Text style={styles.deviceName}>Current Device: {currentDevice.name}</Text>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => grantCameraAccess(currentDevice)}
              activeOpacity={0.7}
            >
              <Text style={styles.navigationButtonText}>Grant Access</Text>
              <Ionicons name="checkmark" size={20} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noDeviceText}>No devices in queue.</Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background for modern look
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#2C2C2C', 
    borderRadius: 20, // More rounded corners for a sleek feel
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10, // Raised effect for depth
  },
  title: {
    fontSize: 34, // Adjusted for a more balanced look
    fontWeight: 'bold', // Stronger emphasis on the title
    color: '#00B0FF', // Bright, modern accent color
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#B0B0B0', // Softer gray for subtitle
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  deviceContainer: {
    alignItems: 'center',
    marginTop: 25,
  },
  deviceName: {
    fontSize: 24, // Slightly larger for better readability
    color: '#00B0FF',
    marginBottom: 18,
    fontWeight: '600',
  },
  navigationButton: {
    backgroundColor: '#00B0FF',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30, // More rounded edges
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    elevation: 6,
    shadowColor: '#00B0FF', // Matching the accent color for consistency
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12, // Increased spacing between text and icon
  },
  buttonIcon: {
    marginLeft: 12,
  },
  noDeviceText: {
    fontSize: 18,
    color: '#B0B0B0',
    marginTop: 30,
    textAlign: 'center',
  },
});


export default HomeScreen;
