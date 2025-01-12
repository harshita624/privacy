import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import FileUpload from './FileUpload';  // File upload component
import FileList from './FileList';      // File list component

const FileVault = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <View>
      <Text>Welcome to your Secure File Vault</Text>
      <Button title="Upload File" onPress={() => setShowUpload(true)} />
      {showUpload && <FileUpload />}
      <FileList />  {/* List the files */}
    </View>
  );
};

export default FileVault;
