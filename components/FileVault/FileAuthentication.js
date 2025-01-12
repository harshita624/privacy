import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const FileAuthentication = ({ navigation }) => {
  const [pin, setPin] = useState('');

  const handlePinChange = (text) => {
    setPin(text);
  };

  const handleSubmit = () => {
    // Check if PIN matches the expected value
    if (pin === '1234') {  // Replace '1234' with your actual logic for PIN verification
      navigation.navigate('AppNavigator');  // Navigate to the main app screen
    } else {
      alert('Invalid PIN');  // If PIN is incorrect, show an error message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter PIN to Authenticate</Text>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={handlePinChange}
        keyboardType="numeric"
        maxLength={4}
        placeholder="Enter 4-digit PIN"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FileAuthentication;
