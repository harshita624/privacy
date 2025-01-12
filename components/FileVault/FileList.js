import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { decryptFile } from '../../utils/encryptionService';  // Decryption logic

const FileList = () => {
  const [files, setFiles] = useState([{ name: 'Sample File', encryptedData: 'encryptedDataHere' }]);  // Mock data

  const handleFileDecrypt = (encryptedData) => {
    const decryptedFile = decryptFile(encryptedData);
    console.log('Decrypted File:', decryptedFile);
    // Handle the decrypted file (e.g., display, download, etc.)
  };

  return (
    <View>
      {files.map((file, index) => (
        <View key={index}>
          <Text>{file.name}</Text>
          <Button title="View File" onPress={() => handleFileDecrypt(file.encryptedData)} />
        </View>
      ))}
    </View>
  );
};

export default FileList;
