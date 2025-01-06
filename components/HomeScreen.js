import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/styles';

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

export default HomeScreen;