import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const paymentMethods = [
  {
    id: '1',
    type: 'Google Pay',
    icon: require('../../assets/google.png'),
    email: 'f*********n@gmail.com',
    balance: '$1,234.00',
  },
  {
    id: '2',
    type: 'Apple Pay',
    icon: require('../../assets/apple.png'),
    email: 'f*********n@gmail.com',
    balance: '$2,766.00',
  },
  {
    id: '3',
    type: 'Visa',
    icon: require('../../assets/visa.png'),
    email: '**** **** **** 1234',
    balance: '$1,876,766.00',
  },
  {
    id: '4',
    type: 'Master Card',
    icon: require('../../assets/mastercard.png'),
    email: '**** **** **** 1234',
    balance: '$2,876,766.00',
  },
];

export default function PaymentSettings() {
  const navigation = useNavigation();

  const handleAddPayment = () => {
    navigation.navigate('AddPaymentMethod');
  };

  const handlePressItem = (item) => {
    Alert.alert(`${item.type}`, `Balance: ${item.balance}`);
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePressItem(item)}
      style={tw`bg-white rounded-xl p-4 flex-row justify-between items-center mb-4 mx-4 shadow`}
    >
      <View style={tw`flex-row items-center`}>
        <Image source={item.icon} style={tw`w-10 h-10 mr-3`} resizeMode="contain" />
        <View>
          <Text style={tw`text-base font-semibold`}>{item.type}</Text>
          <Text style={tw`text-xs text-gray-500`}>{item.email}</Text>
          <Text style={tw`text-sm text-red-500 font-semibold mt-1`}>
            Balance: {item.balance}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="gray" />
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-100 pt-8`}>
      {/* Header */}
      <View style={tw`px-4 pt-6 flex-row items-center mb-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-black ml-4`}>
          Payment Settings
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-4`}
      />

      {/* Add Payment Button */}
      <TouchableOpacity
        onPress={handleAddPayment}
        style={tw`bg-red-500 mx-6 mb-6 py-4 rounded-full items-center`}
      >
        <Text style={tw`text-white font-semibold text-base`}>
          Add Payment Method
        </Text>
      </TouchableOpacity>
    </View>
  );
}
