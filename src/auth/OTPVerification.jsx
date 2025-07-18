// import React, { useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import tw from 'tailwind-react-native-classnames';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const OTPVerification = () => {
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const inputs = useRef([]);
//   const navigation = useNavigation();
//   const route = useRoute();

//   const { email } = route.params || {};

//   const handleChange = (text, index) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);
//     if (text && index < 5) {
//       inputs.current[index + 1].focus();
//     }
//   };

//   const handleVerify = async () => {
//     const enteredOtp = otp.join('');
//     if (enteredOtp.length < 6) {
//       Alert.alert('Error', 'Please enter all 6 digits');
//       return;
//     }

//     try {
//       const res = await axios.post('http://localhost:9000/auth/send-otp', {
//         email,
//         otp: enteredOtp,
//       });

//       await AsyncStorage.setItem('token', res.data.token);
//       await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

//       navigation.replace('Tabs');
//     } catch (error) {
//       console.error('OTP Verification Error:', error);
//       Alert.alert('Failed', 'Invalid or expired OTP');
//     }
//   };

//   const handleResend = async () => {
//     try {
//       await axios.post('http://localhost:9000/auth/send-otp', { email });
//       Alert.alert('Success', 'OTP sent again to your email');
//     } catch (error) {
//       console.error('Resend OTP Error:', error);
//       Alert.alert('Error', 'Could not resend OTP');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={tw`flex-1 bg-white`}
//     >
//       <TouchableOpacity style={tw`absolute top-10 left-4 z-10`} onPress={() => navigation.goBack()}>
//         <Icon name="arrow-left" size={24} color="#000" />
//       </TouchableOpacity>

//       <View style={tw`flex-1 justify-start items-center mt-20 px-6`}>
//         <Text style={tw`text-xl font-bold mb-2`}>OTP Verification</Text>
//         <Text style={tw`text-center text-gray-600 mb-6`}>
//           Enter the 6-digit code sent to your email
//         </Text>

//         <View style={tw`flex-row justify-between w-full px-2 mb-6`}>
//           {otp.map((digit, index) => (
//             <TextInput
//               key={index}
//               ref={(el) => (inputs.current[index] = el)}
//               style={[
//                 tw`border-2 text-center text-xl rounded-lg w-12 h-12 mx-1`,
//                 digit ? tw`border-red-500` : tw`border-gray-300`,
//               ]}
//               maxLength={1}
//               keyboardType="numeric"
//               onChangeText={(text) => handleChange(text, index)}
//               value={digit}
//             />
//           ))}
//         </View>

//         <TouchableOpacity style={tw`bg-red-500 w-full py-3 rounded-xl mb-4`} onPress={handleVerify}>
//           <Text style={tw`text-white text-center font-semibold text-base`}>Verify</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={tw`border border-black w-full py-3 rounded-xl`}
//           onPress={handleResend}
//         >
//           <Text style={tw`text-center text-base font-semibold text-gray-700`}>Resend OTP</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default OTPVerification;

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  const handleVerifyOtp = async () => {
    try {
      const savedPayload = await AsyncStorage.getItem('loginPayload');
      const parsedPayload = JSON.parse(savedPayload);

      const verifyPayload = {
        email: parsedPayload.email,
        otp,
        deviceId: parsedPayload.deviceId,
        rememberDevice: true,
        platform: parsedPayload.platform,
        deviceName: parsedPayload.deviceName,
      };

      const res = await axios.post(
        'https://yourapi.com/user/auth/verify-otp-login',
        verifyPayload
      );

      if (res?.data?.token) {
        console.log('✅ OTP Verified:', res.data);
        await AsyncStorage.setItem('userToken', res.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.user));
        navigation.navigate('Home'); // navigate to your home screen
      } else {
        Alert.alert('Unexpected server response');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error.message);
      Alert.alert('OTP Failed', error?.response?.data?.message || 'Server Error');
    }
  };

  return (
    <View className="p-4">
      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        className="border p-2 my-2 rounded"
      />
      <Button title="Verify OTP" onPress={handleVerifyOtp} />
    </View>
  );
};

export default OTPVerification;
