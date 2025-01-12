import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../components/HomeScreen';
import CameraScreen from '../components/CameraScreen';
import PrivacyDashboard from '../components/PrivacyDashboard';
import VPNRecommendations from '../components/VPNRecommendations';
import VPNService from '../components/VPNService';
import PinAuthenticationScreen from '../components/PinAuthenticationScreen';

const Tab = createBottomTabNavigator();

const CustomHeader = ({ scene, userName }) => {
  const routeName = scene?.route?.name || '';
  
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{routeName}</Text>
      {userName && (
        <View style={styles.userContainer}>
          <Ionicons name="person-circle-outline" size={24} color="#6366f1" />
          <Text style={styles.userName}>{userName}</Text>
        </View>
      )}
    </View>
  );
};

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    checkUserAccount();
  }, []);

  const checkUserAccount = async () => {
    try {
      // Only check if user account exists, don't check authentication
      const userEmail = await AsyncStorage.getItem('userEmail');
      setHasAccount(!!userEmail);
      
      // Reset authentication state on app start
      await AsyncStorage.setItem('isAuthenticated', 'false');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error checking user account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <PinAuthenticationScreen 
        setIsAuthenticated={setIsAuthenticated}
        setUserName={setUserName}
        hasAccount={hasAccount}  // Pass this to PinAuthenticationScreen
      />
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        header: ({ scene }) => (
          <CustomHeader scene={scene} userName={userName} />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Privacy Dashboard') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'VPN Recommendations') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'VPN Service') {
            iconName = focused ? 'wifi' : 'wifi-outline';
          }

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
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Privacy Dashboard" component={PrivacyDashboard} />
      <Tab.Screen name="VPN Recommendations" component={VPNRecommendations} />
      <Tab.Screen name="VPN Service" component={VPNService} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2937',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 8,
    paddingBottom: 8,
    height: Platform.OS === 'ios' ? 88 : 56,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    padding: 8,
    borderRadius: 20,
  },
  userName: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default AppNavigator;