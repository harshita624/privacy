import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';  // Correct path to TabNavigator
import PrivacyDashboard from '../components/PrivacyDashboard';  // Correct path to PrivacyDashboard

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    {/* Main screen with TabNavigator */}
    <Stack.Screen
      name="Main"
      component={TabNavigator}
      options={{ headerShown: false }} // Hide the header for tab navigator
    />
    {/* Add PrivacyDashboard as a screen in the stack */}
    <Stack.Screen
      name="Privacy Dashboard"
      component={PrivacyDashboard}
      options={{ title: 'Privacy Dashboard' }} // Optional custom title
    />
  </Stack.Navigator>
);

export default AppNavigator;
