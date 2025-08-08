import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function QRCodeScreen({ navigation }) {
  const user = {
    name: 'Olivia Nguyen',
    avatar: require('../../assets/user.png'),
    qrValue: 'https://example.com/user/olivia-nguyen',
  };

  const handleOpenScanner = () => {
    navigation.navigate('Scanner'); 
  };

  const handleBack = () => {
    navigation.navigate('Profile'); 
  };

  return (
    <View style={tw`flex-1 bg-gray-100 px-4 mt-16`}>
      {/* Top bar */}
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-base font-semibold ml-2`}>QR Code</Text>
      </View>

      {/* QR Code */}
      <View style={tw`items-center bg-white rounded-2xl shadow-md p-6 mx-6 mb-6`}>
        <QRCodeSVG value={user.qrValue} size={200} />
      </View>

      {/* User Info */}
      <View style={tw`items-center mb-10`}>
        <Image
          source={user.avatar}
          style={tw`w-12 h-12 rounded-full mb-2`}
        />
        <Text style={tw`text-lg font-semibold`}>{user.name}</Text>
        <Text style={tw`text-sm text-gray-500`}>Scan my QR Code</Text>
      </View>

      {/* Scanner Button */}
      <TouchableOpacity
        onPress={handleOpenScanner}
        style={tw`flex-row items-center justify-center bg-red-500 rounded-full py-3 mx-8`}
      >
        <Ionicons name="qr-code-outline" size={20} color="white" />
        <Text style={tw`text-white font-semibold ml-2`}>Open Code Scanner</Text>
      </TouchableOpacity>
    </View>
  );
}
