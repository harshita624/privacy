import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './navigation/AppNavigator'; // Ensure the path is correct
import { ScrollView, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync(); // Prevent auto-hide of splash screen

const App = () => {
  useEffect(() => {
    // Simulating a loading process before hiding the splash screen
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for 2 seconds
      } catch (e) {
        console.warn(e);
      } finally {
        SplashScreen.hideAsync(); // Hide splash screen when ready
      }
    };

    prepare();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator /> {/* This will handle the navigation */}
    </NavigationContainer>
  );
};

export default App;
