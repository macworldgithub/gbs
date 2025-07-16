// import React, { useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
// } from 'react-native';
// import tw from 'tailwind-react-native-classnames';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useNavigation } from '@react-navigation/native';
// const InboxOTP = ( ) => {
//   const [otp, setOtp] = useState(['', '', '', '', '','' ]);
//   const inputs = useRef([]);
// const navigation = useNavigation();
//   const handleChange = (text, index) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);
//     if (text && index < 5) {
//       inputs.current[index + 1].focus();
//     }
//   };

//   const handleResend = () => {
//     console.log('Resend OTP');
//   };

//   const handleCallCenter = () => {
//     console.log('Call Center');
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={tw`flex-1 bg-white`}
//     >
//       {/* Top Back Button */}
//       <TouchableOpacity
//         style={tw`absolute top-10 left-4 z-10`}
//         onPress={() => navigation.goBack()}
//       >
//         <Icon name="arrow-left" size={24} color="#000" />
//       </TouchableOpacity>

//       <View style={tw`flex-1 justify-start items-center mt-16 px-6 pt-16`}>
//         {/* Image on top */}
//         <Image
//           source={require('../../assets/NewPass.png')}
//           style={tw`w-16 h-16 mb-4`}
//           resizeMode="contain"
//         />

//         <Text style={tw`text-xl font-bold mb-2`}>Check Your Mailbox</Text>
//         <Text style={tw`text-center text-gray-600 mb-6`}>
//           Please enter the 4 digit OTP code that we sent to your{'\n'}
//           email (f**********n@gmail.com)
//         </Text>

//         {/* OTP Inputs */}
//         <View style={tw`flex-row justify-between w-full px-6 mb-4 mr-16`}>
//       {otp.map((digit, index) => (
//         <TextInput
//           key={index}
//           ref={(el) => (inputs.current[index] = el)}
//           style={[
//             tw`border-2 text-center text-xl rounded-lg w-12 h-12 mx-1`,
//             digit ? tw`border-red-500` : tw`border-gray-300`,
//           ]}
//           maxLength={1}
//           keyboardType="numeric"
//           onChangeText={(text) => handleChange(text, index)}
//           value={digit}
//         />
//       ))}
//     </View>
//       </View>

//       {/* Bottom Buttons */}
//       <View style={tw`px-6 pb-6`}>
//         <TouchableOpacity
//           style={tw`bg-red-500 w-full py-3 rounded-xl mb-4`}
//           onPress={handleResend}
//         >
//           <Text style={tw`text-white text-center font-semibold text-base`}
//                                 onPress={() => navigation.navigate("CreateNewPass")}>
//             Resend OTP
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={tw`border border-gray-300 w-full py-3 rounded-xl`}
//           onPress={handleCallCenter}
//         >
//           <Text style={tw`text-center text-base font-semibold text-gray-700`}>
//             Call Center
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default InboxOTP;



import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { sendForgotPasswordOtp } from '../utils/api'; // ✅ Make sure this exists

const InboxOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email;

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (text === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    // If all digits are entered, auto navigate to next screen
    if (otp.every((digit) => digit !== '')) {
      const fullOtp = otp.join('');
      console.log('Entered OTP:', fullOtp);
      navigation.navigate('CreateNewPass', { email, otp: fullOtp }); // You can pass otp if needed
    }
  }, [otp]);

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please go back and re-enter.');
      return;
    }

    try {
      await sendForgotPasswordOtp(email);
      Alert.alert('Success', 'A new OTP has been sent to your email.');
    } catch (error) {
      console.error('Resend OTP failed:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to resend OTP.');
    }
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
          Please enter the 6 digit OTP code we sent to your{'\n'}
          email ({email?.replace(/(.{1}).*(@.*)/, '$1********$2')})
        </Text>

        {/* OTP Inputs */}
        <View style={tw`flex-row justify-between w-full px-6 mb-4 mr-16`}>
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
      </View>

      {/* Bottom Buttons */}
      <View style={tw`px-6 pb-6`}>
        <TouchableOpacity
          style={tw`bg-red-500 w-full py-3 rounded-xl mb-4`}
          onPress={handleResend}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
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
