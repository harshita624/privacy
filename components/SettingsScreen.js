import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const SettingSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const SettingItem = ({ icon, title, subtitle, onPress, value, type = 'navigate' }) => (
  <TouchableOpacity 
    style={styles.settingItem} 
    onPress={onPress}
    disabled={type === 'toggle'} // Disable press for toggle items
  >
    <View style={styles.settingItemLeft}>
      <Ionicons name={icon} size={24} color="#6366f1" style={styles.settingIcon} />
      <View>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.settingItemRight}>
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#374151', true: '#6366f1' }}
          thumbColor={value ? '#fff' : '#94a3b8'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
      )}
    </View>
  </TouchableOpacity>
);

const SettingsScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [userName, setUserName] = useState('John Doe');
  const [accountType, setAccountType] = useState('Free');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  
  const [settings, setSettings] = useState({
    biometricEnabled: false,
    appLock: true,
    antiScreenshot: false,
    darkMode: true,
    notificationsEnabled: true
  });

  useEffect(() => {
    loadUserData();
    loadSettings();
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricAvailable(available);
  };

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const name = await AsyncStorage.getItem('userName');
      const type = await AsyncStorage.getItem('accountType');
      
      if (email) setUserEmail(email);
      if (name) setUserName(name);
      if (type) setAccountType(type);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
      
      // Handle specific setting changes
      if (key === 'biometricEnabled' && value) {
        const result = await LocalAuthentication.authenticateAsync();
        if (!result.success) {
          // Revert the setting if authentication fails
          updateSetting('biometricEnabled', false);
          Alert.alert('Authentication Failed', 'Unable to enable biometric authentication.');
        }
      }
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('isAuthenticated', 'false');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error deleting account:', error);
            }
          }
        }
      ]
    );
  };

  const handleEmergencyMode = () => {
    Alert.alert(
      'Emergency Mode',
      'Activating emergency mode will alert your trusted contacts. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Activate',
          style: 'destructive',
          onPress: () => {
            // Implement emergency mode logic
            navigation.navigate('EmergencyMode');
          }
        }
      ]
    );
  };

  const handleBackupRestore = () => {
    Alert.alert(
      'Backup & Restore',
      'Choose an action',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Backup Now', onPress: () => navigation.navigate('Backup') },
        { text: 'Restore Data', onPress: () => navigation.navigate('Restore') }
      ]
    );
  };

  const openPrivacyPolicy = async () => {
    const url = 'https://your-app-privacy-policy.com';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handleCustomerSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose contact method',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => Linking.openURL('mailto:support@yourapp.com') },
        { text: 'Chat', onPress: () => navigation.navigate('SupportChat') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#6366f1" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Profile Section */}
      <SettingSection title="Profile Information">
        <TouchableOpacity 
          style={styles.profileHeader}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.profileIcon}>
            <Ionicons name="person-circle" size={60} color="#6366f1" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
            <View style={styles.accountBadge}>
              <Text style={styles.accountType}>{accountType}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </SettingSection>

      {/* Security Settings */}
      <SettingSection title="Security">
        <SettingItem
          icon="key-outline"
          title="Change PIN"
          onPress={() => navigation.navigate('ChangePIN')}
        />
        {isBiometricAvailable && (
          <SettingItem
            icon="finger-print-outline"
            title="Biometric Authentication"
            type="toggle"
            value={settings.biometricEnabled}
            onPress={(value) => updateSetting('biometricEnabled', value)}
          />
        )}
        <SettingItem
          icon="shield-checkmark-outline"
          title="Two-Factor Authentication"
          onPress={() => navigation.navigate('2FASettings')}
        />
      </SettingSection>

      {/* Privacy Controls */}
      <SettingSection title="Privacy">
        <SettingItem
          icon="lock-closed-outline"
          title="App Lock"
          type="toggle"
          value={settings.appLock}
          onPress={(value) => updateSetting('appLock', value)}
        />
        <SettingItem
          icon="eye-off-outline"
          title="Anti-Screenshot"
          type="toggle"
          value={settings.antiScreenshot}
          onPress={(value) => updateSetting('antiScreenshot', value)}
        />
      </SettingSection>

      {/* Preferences */}
      <SettingSection title="Preferences">
        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          type="toggle"
          value={settings.darkMode}
          onPress={(value) => updateSetting('darkMode', value)}
        />
        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          type="toggle"
          value={settings.notificationsEnabled}
          onPress={(value) => updateSetting('notificationsEnabled', value)}
        />
        <SettingItem
          icon="language-outline"
          title="Language"
          subtitle="English"
          onPress={() => navigation.navigate('Language')}
        />
      </SettingSection>

      {/* Support */}
      <SettingSection title="Support">
        <SettingItem
          icon="help-circle-outline"
          title="FAQ"
          onPress={() => navigation.navigate('FAQ')}
        />
        <SettingItem
          icon="bug-outline"
          title="Report an Issue"
          onPress={() => navigation.navigate('ReportIssue')}
        />
        <SettingItem
          icon="chatbubble-outline"
          title="Customer Support"
          onPress={handleCustomerSupport}
        />
        <SettingItem
          icon="document-text-outline"
          title="Privacy Policy"
          onPress={openPrivacyPolicy}
        />
      </SettingSection>

      {/* Additional Features */}
      <SettingSection title="Additional Features">
        <SettingItem
          icon="cloud-upload-outline"
          title="Backup and Restore"
          onPress={handleBackupRestore}
        />
        <SettingItem
          icon="people-outline"
          title="Trusted Contacts"
          onPress={() => navigation.navigate('TrustedContacts')}
        />
        <SettingItem
          icon="warning-outline"
          title="Emergency Mode"
          onPress={handleEmergencyMode}
        />
      </SettingSection>

      {/* Account Actions */}
      <SettingSection title="Account">
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </SettingSection>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#374151',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  accountBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  accountType: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    marginLeft: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 16,
    marginLeft: 16,
  },
});

export default SettingsScreen;