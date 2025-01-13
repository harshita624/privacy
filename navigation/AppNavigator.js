import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { 
  View, 
  ActivityIndicator, 
  Text, 
  StyleSheet, 
  Platform, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../components/HomeScreen';
import CameraScreen from '../components/CameraScreen';
import PrivacyDashboard from '../components/PrivacyDashboard';
import VPNRecommendations from '../components/VPNRecommendations';
import VPNService from '../components/VPNService';
import PinAuthenticationScreen from '../components/PinAuthenticationScreen';
import SettingsScreen from '../components/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomHeader = ({ scene, userName, onUserPress }) => {
  const routeName = scene?.route?.name || '';
  
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{routeName}</Text>
      {userName && (
        <TouchableOpacity 
          style={styles.userContainer} 
          onPress={onUserPress}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle-outline" size={24} color="#6366f1" />
          <Text style={styles.userName}>{userName}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const TabNavigator = ({ userName, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
          header: ({ scene }) => (
            <CustomHeader 
              scene={scene} 
              userName={userName}
              onUserPress={() => setShowSettings(true)}
            />
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

      <Modal
        visible={showSettings}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <SettingsScreen
          onClose={() => setShowSettings(false)}
          userName={userName}
          onLogout={onLogout}
        />
      </Modal>
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
      const userEmail = await AsyncStorage.getItem('userEmail');
      const savedUserName = await AsyncStorage.getItem('userName');
      setHasAccount(!!userEmail);
      if (savedUserName) {
        setUserName(savedUserName);
      }
      
      await AsyncStorage.setItem('isAuthenticated', 'false');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error checking user account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    await AsyncStorage.setItem('isAuthenticated', 'false');
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
        hasAccount={hasAccount}
      />
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
        {props => (
          <TabNavigator 
            {...props} 
            userName={userName}
            onLogout={handleLogout}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
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