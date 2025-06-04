import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const paymentMethods = [
  {
    id: "1",
    name: "Google Pay",
    email: "f**********n@gmail.com",
    balance: "$1,234.00",
    icon: require("../../assets/google.png"),
  },
  {
    id: "2",
    name: "Apple Pay",
    email: "f**********n@gmail.com",
    balance: "$2,766.00",
    icon: require("../../assets/apple.png"),
  },
  {
    id: "3",
    name: "Visa",
    email: "**** **** **** 1234",
    balance: "$1,876,766.00",
    icon: require("../../assets/visa.png"),
  },
  {
    id: "4",
    name: "Master Card",
    email: "**** **** **** 1234",
    balance: "$2,876,766.00",
    icon: require("../../assets/mastercard.png"),
  },
];

const SelectPaymentMethod = () => {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState("2"); // default selected

//   const handleConfirm = () => {
//     // You can pass the selectedMethod to another screen or perform payment logic
//     alert(`Confirmed Payment with ${selectedMethod}`);
//   };

  const handleConfirm = () => {
  navigation.navigate("PaymentSuccess");
};

  const renderCard = ({ item }) => {
    const isSelected = selectedMethod === item.id;

    return (
      <TouchableOpacity
        onPress={() => setSelectedMethod(item.id)}
        style={tw.style(
          "border rounded-xl mb-4 p-4 flex-row items-center justify-between ",
          isSelected ? "border-red-500 bg-red-50" : "border-gray-200"
        )}
      >
        <View style={tw`flex-row items-center`}>
          <Image source={item.icon} style={{ width: 35, height: 35, marginRight: 12 }} />
          <View>
            <Text style={tw`text-base font-semibold`}>{item.name}</Text>
            <Text style={tw`text-xs text-gray-500`}>{item.email}</Text>
            <Text style={tw`text-red-500 font-bold`}>Balance: {item.balance}</Text>
          </View>
        </View>
        <View>
          {isSelected ? (
            <Icon name="check-circle" size={22} color="#EF4444" />
          ) : (
            <Icon name="circle-thin" size={22} color="#9CA3AF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`flex-1 bg-white px-5 pt-8`}>
      {/* Header */}
      <View style={tw`flex-row items-center mb-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} style={tw`text-black mr-3`} />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold`}>Payment Method</Text>
      </View>

      {/* Title */}
      <Text style={tw`text-sm text-gray-700 mb-3`}>Select Payment Method</Text>

      {/* Payment Methods List */}
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
      />

      {/* Confirm Button */}
      <TouchableOpacity
        onPress={handleConfirm}
        style={tw`bg-red-500 py-3 rounded-xl mb-4`}
      >
        <Text style={tw`text-white text-center font-bold text-base`}>
          Confirm Payment
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectPaymentMethod;
