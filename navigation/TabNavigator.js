import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import HomeScreen from '../components/HomeScreen';  // Ensure this path is correct
import CameraScreen from '../components/CameraScreen';  // Ensure this path is correct

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          const iconName = route.name === 'Home' ? 'home' : 'camera';
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
    </Tab.Navigator>
  );
};

export default TabNavigator;


