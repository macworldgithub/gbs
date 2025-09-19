// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
// } from 'react-native';
// import tw from 'tailwind-react-native-classnames';
// const OTPSuccess = () => {
//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={tw`flex-1 bg-white`}
//     >
//       <View style={tw`flex-1 justify-start items-center px-6 pt-16 mt-36`}>
//         <Image
//           source={require('../../assets/Reset_Icon.png')}
//           style={tw`w-28 h-28 mb-8`}
//           resizeMode="contain"
//         />

//         <Text style={tw`text-xl font-bold mb-2`}>Verification Success</Text>
      
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default OTPSuccess;


import React, { useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';

const OTPSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { nextScreen = 'Tabs' } = route.params || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(nextScreen);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, nextScreen]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-white`}
    >
      <View style={tw`flex-1 justify-start items-center px-6 pt-16 mt-36`}>
        <Image
          source={require('../../assets/Reset_Icon.png')}
          style={tw`w-28 h-28 mb-8`}
          resizeMode="contain"
        />

        <Text style={tw`text-xl font-bold mb-2 text-green-600`}>
          Verification Success
        </Text>
        <Text style={tw`text-gray-500 text-sm mb-4`}>
          Redirecting to Home...
        </Text>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTPSuccess;
