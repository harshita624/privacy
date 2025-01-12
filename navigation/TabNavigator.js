import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import HomeScreen from '../components/HomeScreen';  // Ensure this path is correct
import CameraScreen from '../components/CameraScreen';  // Ensure this path is correct
import PrivacyDashboard from '../components/PrivacyDashboard';  // Ensure this path is correct
import VPNRecommendations from '../components/VPNRecommendations';  // Import VPNRecommendations
import VPNService from '../components/VPNService';  // Import VPNService

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, size }) => {
        const iconName =
          route.name === 'Home'
            ? 'home'
            : route.name === 'Camera'
            ? 'camera'
            : route.name === 'Privacy Dashboard'
            ? 'shield'
            : route.name === 'VPN Recommendations'
            ? 'shield-checkmark'
            : 'wifi';
        return (
          <Ionicons
            name={`${iconName}${focused ? '' : '-outline'}`}
            size={size}
            color={focused ? '#6366f1' : '#94a3b8'}
          />
        );
      },
      tabBarActiveTintColor: '#6366f1',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        backgroundColor: '#1f2937',
        borderTopWidth: 0,
        elevation: 0,
      },
      headerStyle: {
        backgroundColor: '#1f2937',
        elevation: 0,
      },
      headerTintColor: '#fff',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
    <Tab.Screen name="Privacy Dashboard" component={PrivacyDashboard} />
    <Tab.Screen name="VPN Recommendations" component={VPNRecommendations} /> {/* VPN Recommendations tab */}
    <Tab.Screen name="VPN Service" component={VPNService} /> {/* VPN Service tab */}
  </Tab.Navigator>
);

export default TabNavigator;
