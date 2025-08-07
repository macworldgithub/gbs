import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const countries = [
  { code: '+1', name: 'USA' },
  { code: '+92', name: 'Pakistan' },
  { code: '+91', name: 'India' },
];

const EditProfile = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('Franklin Clinton');
  const [email, setEmail] = useState('franklinclinton@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('123456789');
  const [selectedCode, setSelectedCode] = useState('+92');
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  const handleEditIconPress = () => {
    Alert.alert('Change Profile Picture', 'Add image picker functionality here.');
  };

  const handleCountrySelect = (code) => {
    setSelectedCode(code);
    setCountryModalVisible(false);
  };

  return (
    <View style={tw`flex-1 bg-white `}>
      <ScrollView contentContainerStyle={tw`pb-20`}>
        {/* Header */}
        <View style={tw`px-4 pt-6 flex-row items-center mt-4`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={16} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-semibold text-black ml-4`}>Edit Profile</Text>
        </View>

        {/* Profile Image */}
        <View style={tw`items-center mt-6 mb-4 relative`}>
          <Image
            source={require('../../assets/profile.png')}
            style={[{ width: 80, height: 80, borderRadius: 40 }, tw`bg-red-100`]}
          />
          <TouchableOpacity
            style={[
              tw`absolute bg-red-500 rounded-full p-1`,
              { bottom: 0, right: 110 },
            ]}
            onPress={handleEditIconPress}
          >
            <FontAwesome5 name="lock" size={12} color="white" />
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={tw`px-4`}>
          <Text style={tw`text-sm text-gray-600 mb-1`}>Full name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={[
              tw`border px-4 py-2 rounded-lg mb-4`,
              { borderColor: 'red' },
            ]}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Email</Text>
          <TextInput
            value={email}
            editable={false}
            style={tw`border border-gray-300 bg-gray-100 px-4 py-2 rounded-lg mb-4`}
          />

          <Text style={tw`text-sm text-gray-600 mb-1`}>Phone number</Text>
          <View
            style={tw`flex-row items-center border border-gray-300 rounded-lg px-4 mb-4`}
          >
            <TouchableOpacity
              onPress={() => setCountryModalVisible(true)}
              style={tw`flex-row items-center`}
            >
              <FontAwesome5 name="flag" size={16} color="red" />
              <Text style={tw`ml-1 text-black`}>{selectedCode}</Text>
              <FontAwesome5
                name="chevron-down"
                size={12}
                color="gray"
                style={tw`ml-1`}
              />
            </TouchableOpacity>

            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="number-pad"
              style={tw`ml-3 py-2 flex-1`}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button - fixed at bottom */}
      <View style={tw`px-4 pb-4 absolute bottom-0 left-0 right-0`}>
        <TouchableOpacity style={tw`bg-red-500 py-3 rounded-full`}>
          <Text style={tw`text-center text-white font-semibold`}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* Country Picker Modal */}
      <Modal visible={countryModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={tw`flex-1 bg-black bg-opacity-40 justify-center items-center`}
          activeOpacity={1}
          onPressOut={() => setCountryModalVisible(false)}
        >
          <View style={tw`bg-white rounded-lg w-3/4 p-4`}>
            <Text style={tw`text-lg font-bold mb-2`}>Select Country Code</Text>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.code}
                onPress={() => handleCountrySelect(country.code)}
                style={tw`py-2`}
              >
                <Text>{`${country.name} (${country.code})`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default EditProfile;
