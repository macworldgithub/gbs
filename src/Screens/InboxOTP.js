import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
const InboxOTP = ( ) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
const navigation = useNavigation();
  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleResend = () => {
    console.log('Resend OTP');
  };

  const handleCallCenter = () => {
    console.log('Call Center');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-white`}
    >
      {/* Top Back Button */}
      <TouchableOpacity
        style={tw`absolute top-10 left-4 z-10`}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <View style={tw`flex-1 justify-start items-center mt-16 px-6 pt-16`}>
        {/* Image on top */}
        <Image
          source={require('../../assets/NewPass.png')}
          style={tw`w-16 h-16 mb-4`}
          resizeMode="contain"
        />

        <Text style={tw`text-xl font-bold mb-2`}>Check Your Mailbox</Text>
        <Text style={tw`text-center text-gray-600 mb-6`}>
          Please enter the 4 digit OTP code that we sent to your{'\n'}
          email (f**********n@gmail.com)
        </Text>

        {/* OTP Inputs */}
        <View style={tw`flex-row justify-between w-full px-6 mb-4`}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              style={tw`border-2 border-gray-300 text-center text-xl rounded-lg w-12 h-12 mx-1 ${
                digit ? 'border-red-500' : ''
              }`}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(text) => handleChange(text, index)}
              value={digit}
            />
          ))}
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={tw`px-6 pb-6`}>
        <TouchableOpacity
          style={tw`bg-red-500 w-full py-3 rounded-xl mb-4`}
          onPress={handleResend}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}
                                onPress={() => navigation.navigate("CreateNewPass")}>
            Resend OTP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`border border-gray-300 w-full py-3 rounded-xl`}
          onPress={handleCallCenter}
        >
          <Text style={tw`text-center text-base font-semibold text-gray-700`}>
            Call Center
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InboxOTP;
