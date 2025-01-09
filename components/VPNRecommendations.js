import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const VPNRecommendations = () => {
  // Example list of VPN services with basic details
  const vpnList = [
    { id: '1', name: 'ExpressVPN', description: 'Fast, secure, and user-friendly VPN.' },
    { id: '2', name: 'NordVPN', description: 'Secure VPN with double encryption.' },
    { id: '3', name: 'CyberGhost', description: 'User-friendly VPN with strong privacy protection.' },
    { id: '4', name: 'Surfshark', description: 'Affordable VPN with no device limits.' },
    { id: '5', name: 'Private Internet Access', description: 'Privacy-focused VPN with great features.' }
  ];

  const [selectedVPN, setSelectedVPN] = useState(null);

  // Function to handle selection of a VPN from the list
  const handleVPNSelect = (vpn) => {
    setSelectedVPN(vpn);
  };

  // Render selected VPN details
  const renderVPNDetails = () => {
    if (!selectedVPN) return null;

    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.vpnName}>{selectedVPN.name}</Text>
        <Text>{selectedVPN.description}</Text>
        {/* Add more details or actions here, like a "Learn More" button */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VPN Recommendations</Text>

      {/* List of VPNs */}
      <FlatList
        data={vpnList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.vpnItem}
            onPress={() => handleVPNSelect(item)}
          >
            <Text style={styles.vpnName}>{item.name}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      {renderVPNDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  vpnItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  vpnName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default VPNRecommendations;
