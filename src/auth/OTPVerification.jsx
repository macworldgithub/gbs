import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Device from 'expo-device'; // For device name (if using Expo)

// Backend URL
const API_BASE_URL = 'http://192.168.100.197:9000';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { email, deviceId } = route.params || {};

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  // ----------------- Verify OTP -----------------
  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      Alert.alert('Error', 'Please enter all 6 digits');
      return;
    }

    const payload = {
      email,
      otp: enteredOtp,
      deviceId,
      rememberDevice: true,
      platform: Platform.OS,
      deviceName: Device.deviceName || 'Unknown Device',
    };

    console.log('📤 Sending Verify OTP Payload:', payload);
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/user/auth/verify-otp-login`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('✅ OTP Verify Response:', res.data);

      // Save token & user
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

      Alert.alert('Success', 'Login successful');
      navigation.replace('Tabs'); // Redirect to main tabs or home screen
    } catch (error) {
      console.error('❌ OTP Verification Error:', error.response?.data || error.message);
      Alert.alert(
        'Failed',
        error.response?.data?.message || 'Invalid or expired OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Resend OTP -----------------
  const handleResend = async () => {
    try {
      await axios.post(`${API_BASE_URL}/user/auth/pre-login`, {
        email,
        password: '', // Password required if backend enforces
        deviceId,
      });
      Alert.alert('Success', 'OTP sent again to your email');
    } catch (error) {
      console.error('❌ Resend OTP Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Could not resend OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-white`}
    >
      <TouchableOpacity style={tw`absolute top-10 left-4 z-10`} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <View style={tw`flex-1 justify-start items-center mt-20 px-6`}>
        <Text style={tw`text-xl font-bold mb-2`}>OTP Verification</Text>
        <Text style={tw`text-center text-gray-600 mb-6`}>
          Enter the 6-digit code sent to your email
        </Text>

        {/* OTP Input Boxes */}
        <View style={tw`flex-row justify-between w-full px-2 mb-6`}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={[
                tw`border-2 text-center text-xl rounded-lg w-12 h-12 mx-1`,
                digit ? tw`border-red-500` : tw`border-gray-300`,
              ]}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(text) => handleChange(text, index)}
              value={digit}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={tw`bg-red-500 w-full py-3 rounded-xl mb-4`}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            {loading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        {/* Resend OTP */}
        <TouchableOpacity
          style={tw`border border-black w-full py-3 rounded-xl`}
          onPress={handleResend}
        >
          <Text style={tw`text-center text-base font-semibold text-gray-700`}>
            Resend OTP
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTPVerification;
