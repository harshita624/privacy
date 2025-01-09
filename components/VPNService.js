import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const VPNService = () => {
  // State to track VPN connection status
  const [isVPNActive, setIsVPNActive] = useState(false);

  // Function to toggle VPN connection
  const toggleVPN = () => {
    setIsVPNActive((prevState) => !prevState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Built-In VPN Service</Text>
      <Text style={styles.description}>
        {isVPNActive ? 'Your VPN is currently active and protecting your connection.' : 'The VPN is currently inactive. Click below to start the VPN.'}
      </Text>

      {/* Button to start/stop the VPN */}
      <Button 
        title={isVPNActive ? 'Stop VPN' : 'Start VPN'}
        onPress={toggleVPN}
        color="#6366f1"
      />
      
      {/* Optionally, you can add more detailed information or actions here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
});

export default VPNService;
