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

const SettingsScreen = ({ navigation, onClose }) => {
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

  
  const handleBackPress = () => {
    // If onClose prop exists (Modal mode), use it
    if (onClose) {
      onClose();
    } else {
      // Otherwise use navigation
      navigation.goBack();
    }
  };
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
        onPress={handleBackPress}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" style={styles.backIcon} />
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
    backgroundColor: '#181818', // Darker gray for background
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  section: {
    marginBottom: 30,
    animation: 'fadeIn 0.4s ease-out', // Subtle fade-in effect for sections
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1abc9c', // Teal for section titles to contrast with dark theme
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: '#121212', // Darker gray for content sections
    borderRadius: 16, // Slightly rounded corners for a clean look
    marginHorizontal: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for a subtle effect
    border: '1px solid #333', // Light border for separation
    animation: 'fadeIn 0.5s ease-out', // Smooth fade-in effect
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular profile picture
    backgroundColor: '#1abc9c', // Teal background for icon
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff', // White text for name for readability
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: '#b0b0b0', // Light gray color for email for subtle contrast
    marginBottom: 12,
  },
  accountBadge: {
    backgroundColor: '#1abc9c', // Teal for account badge to match accents
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  accountType: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Subtle divider between items
    animation: 'fadeIn 0.4s ease-out', // Fade-in effect for settings items
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 18,
    color: '#1abc9c', // Teal color for icons
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff', // White text for title
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#b0b0b0', // Light gray subtitle
    marginTop: 6,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    animation: 'fadeIn 0.4s ease-out',
  },
  logoutText: {
    color: '#ef4444', // Red color for logout button
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  deleteText: {
    color: '#ef4444', // Red for delete button
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#1abc9c', // Teal background for back button
    borderRadius: 50,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for button
    marginBottom: 20,
    animation: 'fadeIn 0.5s ease-out', // Fade-in effect for back button
  },
  backIcon: {
    marginRight: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Professional keyframe animation for sparkling borders
const keyframes = `
@keyframes sparkleBorder {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;


export default SettingsScreen;