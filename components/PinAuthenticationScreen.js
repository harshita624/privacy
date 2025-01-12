// PinAuthenticationScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const PinAuthenticationScreen = ({ setIsAuthenticated, setUserName }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pin: '',
    confirmPin: ''
  });
  const [isNewUser, setIsNewUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  useEffect(() => {
    checkExistingAccount();
  }, []);

  const checkExistingAccount = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        setHasAccount(true);
        setIsNewUser(false);
        setFormData(prev => ({ ...prev, email: storedEmail }));
      }
    } catch (error) {
      console.error('Error checking existing account:', error);
    }
  };

  // Hash function for PIN
  const hashPin = (pin) => {
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePin = (pin) => {
    return pin.length >= 6 && /^\d+$/.test(pin);
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      email: hasAccount ? formData.email : '',
      pin: '',
      confirmPin: ''
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { name, email, pin, confirmPin } = formData;

      if (!validateEmail(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }

      if (!validatePin(pin)) {
        Alert.alert('Invalid PIN', 'PIN must be at least 6 digits');
        return;
      }

      if (isNewUser) {
        if (!name) {
          Alert.alert('Missing Name', 'Please enter your name');
          return;
        }

        if (pin !== confirmPin) {
          Alert.alert('PIN Mismatch', 'PINs do not match');
          return;
        }

        const hashedPin = hashPin(pin);
        await AsyncStorage.multiSet([
          ['userName', name],
          ['userEmail', email],
          ['userPin', hashedPin],
          ['isAuthenticated', 'true']
        ]);

        setUserName(name);
        Alert.alert('Success', 'Account created successfully!');
        setIsAuthenticated(true);
      } else {
        const storedPin = await AsyncStorage.getItem('userPin');
        const hashedInputPin = hashPin(pin);

        if (hashedInputPin !== storedPin) {
          Alert.alert('Error', 'Invalid PIN');
          setFormData(prev => ({ ...prev, pin: '' }));
          return;
        }

        const storedName = await AsyncStorage.getItem('userName');
        await AsyncStorage.setItem('isAuthenticated', 'true');
        setUserName(storedName);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {isNewUser ? 'Create Account' : 'Welcome Back'}
        </Text>
        <Text style={styles.subHeaderText}>
          {isNewUser 
            ? 'Please fill in your details to create an account' 
            : 'Please enter your PIN to continue'}
        </Text>
      </View>

      <View style={styles.form}>
        {isNewUser && (
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#6366f1" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter Name"
              placeholderTextColor="#9ca3af"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              style={styles.input}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#6366f1" style={styles.inputIcon} />
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor="#9ca3af"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value.toLowerCase())}
            style={[styles.input, !isNewUser && styles.disabledInput]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={isNewUser && !hasAccount}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#6366f1" style={styles.inputIcon} />
          <TextInput
            placeholder="Enter PIN (minimum 6 digits)"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPin}
            value={formData.pin}
            onChangeText={(value) => handleInputChange('pin', value)}
            style={styles.input}
            keyboardType="numeric"
            maxLength={8}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPin(!showPin)}
          >
            <Ionicons 
              name={showPin ? "eye-outline" : "eye-off-outline"} 
              size={24} 
              color="#6366f1" 
            />
          </TouchableOpacity>
        </View>

        {isNewUser && (
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#6366f1" style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm PIN"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showConfirmPin}
              value={formData.confirmPin}
              onChangeText={(value) => handleInputChange('confirmPin', value)}
              style={styles.input}
              keyboardType="numeric"
              maxLength={8}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowConfirmPin(!showConfirmPin)}
            >
              <Ionicons 
                name={showConfirmPin ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="#6366f1" 
              />
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {isNewUser ? 'Create Account' : 'Verify PIN'}
            </Text>
          </TouchableOpacity>
        )}

        {!hasAccount && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setIsNewUser(!isNewUser);
              resetForm();
            }}
          >
            <Text style={styles.toggleButtonText}>
              {isNewUser ? 'Already have an account? Login' : 'New user? Create account'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  header: {
    padding: 20,
    marginTop: Platform.OS === 'ios' ? 40 : 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: '#fff',
  },
  disabledInput: {
    opacity: 0.7,
  },
  eyeIcon: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 16,
    padding: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#6366f1',
    fontSize: 16,
  },
  loader: {
    marginTop: 24,
  }
});

export default PinAuthenticationScreen;