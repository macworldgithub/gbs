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
import * as Device from 'expo-device';
import { API_BASE_URL } from '../utils/config';
import { storeUserData } from '../utils/storage';



const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { email, deviceId, platform = Platform.OS, deviceName = Device.deviceName || 'Unknown Device' } =
    route.params || {};

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  // Verify OTP
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
    platform,
    deviceName,
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

    // Store full token & user data in AsyncStorage via helper function
    await storeUserData({ token: res.data.token, ...res.data.user });

    // Alert success
    Alert.alert('Success', 'OTP Verified Successfully');

    // Delay navigation by 2 seconds
    setTimeout(() => {
      navigation.replace('Tabs');
    }, 2000);

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
  const handleResend = async () => {
    try {
      await axios.post(`${API_BASE_URL}/user/auth/pre-login`, {
        email,
        // password,
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

      <View style={tw`flex-1 justify-start items-center mt-20 px-6 mt-12`}>
        <Text style={tw`text-xl font-bold mb-2`}>OTP Verification</Text>
        <Text style={tw`text-center text-gray-600 mb-6`}>
          Enter the 6-digit code sent to your email
        </Text>

        <View style={tw`flex-row justify-between w-full px-2 mb-6 mr-10`}>
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

        <TouchableOpacity
          style={tw`bg-red-500 w-full py-3 rounded-xl mb-4`}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            {loading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

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
