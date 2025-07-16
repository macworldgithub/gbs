import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { sendForgotPasswordOtp } from '../utils/api'; 

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleConfirm = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return;
    }

    try {
      const res = await sendForgotPasswordOtp(email);
      Alert.alert('Success', 'OTP has been sent to your email');
      navigation.navigate('InboxOTP', { email }); // ✅ Navigate with email
    } catch (error) {
      console.error('Send OTP failed:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-white`}
    >
      {/* Back Arrow */}
      <TouchableOpacity
        style={tw`absolute top-10 left-4 z-10`}
        onPress={() => navigation.navigate('Signin')}
      >
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={tw`mt-16 justify-center px-6 pt-20`}>
        {/* Top Image */}
        <View style={tw`items-center mb-4`}>
          <Image
            source={require('../../assets/Forgot.png')}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={tw`text-2xl font-bold text-center mb-2`}>
          Forgot Your Password?
        </Text>

        {/* Subtitle */}
        <Text style={tw`text-center text-gray-600 mb-6`}>
          Please enter your email address account to send the OTP verification to reset your password
        </Text>

        {/* Input */}
        <View style={tw`border border-red-500 rounded-lg flex-row items-center px-3 py-2`}>
          <Icon name="envelope" size={20} color="#EF4444" />
          <TextInput
            style={tw`ml-2 flex-1 text-base`}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>

      {/* Confirm Button Fixed Bottom */}
      <View style={tw`px-6 pb-6`}>
        <TouchableOpacity style={tw`bg-red-500 py-3 rounded-lg`} onPress={handleConfirm}>
          <Text style={tw`text-white text-center font-semibold`}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPass;
