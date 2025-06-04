import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
const ResetPass = () => {
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

        <Text style={tw`text-xl font-bold mb-2`}>Verification Success</Text>
      
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetPass;
