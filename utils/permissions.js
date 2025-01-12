import { Camera } from 'expo-camera';

export const requestCameraPermission = async () => {
  const { status } = await Camera.requestPermissionsAsync();
  return status;
};
