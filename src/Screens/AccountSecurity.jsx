import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import tw from 'tailwind-react-native-classnames';

const AccountSecurity = () => {
  const navigation = useNavigation();
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);

  const toggleFingerprint = () => {
    setIsFingerprintEnabled((prev) => !prev);
  };

  const handleUpdatePassword = () => {
    navigation.navigate('UpdatePassword'); // Make sure this route exists
  };

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-4 pt-6 flex-row items-center mt-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-black ml-4`}>Account Security</Text>
      </View>

      {/* Content */}
      <View style={tw`mt-6 px-4 space-y-4`}>
        {/* Update Password */}
        <TouchableOpacity
          onPress={handleUpdatePassword}
          style={tw`bg-white shadow-sm border border-gray-100 rounded-xl p-4 flex-row justify-between items-center`}
        >
          <Text style={tw`text-base text-black`}>Update Password</Text>
          <FontAwesome5 name="chevron-right" size={14} color="gray" />
        </TouchableOpacity>

        {/* Fingerprint Login */}
        <View style={tw`bg-white shadow-sm border border-gray-100 rounded-xl p-4`}>
          <View style={tw`flex-row justify-between items-center mb-1`}>
            <Text style={tw`text-base text-black`}>Fingerprint Log In</Text>
            <Switch
              trackColor={{ false: '#ccc', true: '#f87171' }}
              thumbColor="#fff"
              ios_backgroundColor="#ccc"
              onValueChange={toggleFingerprint}
              value={isFingerprintEnabled}
            />
          </View>
          <Text style={tw`text-xs text-gray-500`}>
            Activation will allow anyone with Fingerprint access to this device, to login to your account
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AccountSecurity;
