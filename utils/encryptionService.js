import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;  // Store in .env.local

export const encryptFile = (fileData) => {
  const encrypted = CryptoJS.AES.encrypt(fileData, SECRET_KEY).toString();
  return encrypted;
};

export const decryptFile = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
