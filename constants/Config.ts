// API Configuration
// For Android, use your computer's IP address instead of localhost
// You can find your IP by running 'ipconfig' on Windows or 'ifconfig' on Mac/Linux
export const API_BASE_URL = __DEV__ 
  ? 'http://172.20.10.2:8000' // Android emulator
  : 'http://172.20.10.2:8000'; // iOS simulator

// Alternative: Use your computer's actual IP address for physical devices
// export const API_BASE_URL = 'http://192.168.1.XXX:8000'; // Replace with your IP

export const API_ENDPOINTS = {
  LOGIN: '/api/users/login',
  REGISTER: '/api/users/activate',
  VERIFY_LOGIN_OTP: '/api/users/verify-login-otp',
  VERIFY_ACTIVATION_OTP: '/api/users/verify-activation-otp',
  NOTIFICATIONS: '/api/users/notifications',
}; 