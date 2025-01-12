import React, { useState } from 'react';
import { View, Button, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';  // Use Expo document picker
import { encryptFile } from '../../utils/encryptionService';  // Encryption logic

const FileUpload = () => {
  const [fileUri, setFileUri] = useState(null);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') {
      setFileUri(result.uri);  // Store file URI
      const fileData = await fetch(result.uri).then((res) => res.blob());  // Read file data
      const encryptedFile = encryptFile(fileData);  // Encrypt the file
      console.log('Encrypted File:', encryptedFile);
      // Store the encrypted file securely (e.g., local storage or backend)
    }
  };

  return (
    <View>
      <Button title="Pick Document" onPress={pickDocument} />
      {fileUri && <Text>File selected: {fileUri}</Text>}
    </View>
  );
};

export default FileUpload;
