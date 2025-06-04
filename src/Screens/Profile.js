import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const menuItems = [
  {
    id: '1',
    label: 'Edit Profile',
    icon: 'user-edit',
    navigateTo: 'EditProfile',
  },
  {
    id: '2',
    label: 'Account Security',
    icon: 'shield-alt',
    navigateTo: 'AccountSecurity',
  },
  {
    id: '3',
    label: 'Scan Member',
    icon: 'qrcode',
    navigateTo: 'QRCodeScreen',
  },
  {
    id: '4',
    label: 'Payment Method',
    icon: 'credit-card',
    navigateTo: 'PaymentSettings',
  },
  {
    id: '5',
    label: 'General Settings',
    icon: 'cogs',
    navigateTo: 'GeneralSetting',
  },
  {
    id: '6',
    label: 'Help Centre',
    icon: 'calendar-day',
    navigateTo: 'Help',
  },
];

const Profile = () => {
  const navigation = useNavigation();

  const renderCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.navigateTo)}
      style={tw`px-4 mb-2`}
    >
      <View style={tw`flex-row items-center bg-white rounded-xl px-4 py-3`}>
        <FontAwesome5
          name={item.icon}
          size={18}
          color="red"
          style={tw`mr-4`}
          solid
        />
        <Text style={tw`text-base text-gray-800 flex-1`}>{item.label}</Text>
        <Text style={tw`text-lg text-gray-400`}>{'>'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-100 pt-4`}>
      {/* Header */}
      <View style={tw`px-4 pt-6 flex-row justify-between items-center`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>Profile</Text>
        <TouchableOpacity style={tw`bg-red-100 px-3 py-1 rounded-full`}>
          <Text style={tw`text-red-500`}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Image + Info */}
      <View style={tw`items-center mt-6 mb-4`}>
        <Image
          source={require('../../assets/profile.png')} // Your profile pic here
          style={[tw`mb-2`, { width: 80, height: 80, borderRadius: 40 }]}
        />
        <Text style={tw`text-lg font-bold text-gray-900`}>Franklin Clinton</Text>
        <Text style={tw`text-sm text-gray-500`}>franklinclinton@gmail.com</Text>
      </View>

      {/* Menu Cards */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={tw`pb-10`}
      />

      {/* Version */}
      <Text style={tw`text-center text-xs text-gray-400 mt-auto mb-4`}>
        App version 1.0.0.1
      </Text>
    </View>
  );
};

export default Profile;
