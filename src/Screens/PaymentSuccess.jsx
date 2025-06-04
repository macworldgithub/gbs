import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";

const PaymentSuccess = () => {
  const navigation = useNavigation();

  const handleCheckTicket = () => {
    navigation.navigate("MyTicket"); // Change to your actual screen name
  };

  return (
    <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
      {/* Icon */}
      <Image
        source={require("../../assets/paymentSuccess.png")} // Replace with actual path
        style={{ width: 100, height: 100, marginBottom: 30 }}
        resizeMode="contain"
      />

      {/* Success Text */}
      <Text style={tw`text-xl font-bold text-black mb-2`}>Payment Success!</Text>
      <Text style={tw`text-gray-600 text-center mb-12`}>
        Please check your ticket in the My Ticket menu
      </Text>

      {/* Button */}
      <TouchableOpacity
        onPress={handleCheckTicket}
        style={tw`absolute bottom-6 left-6 right-6 bg-red-500 py-4 rounded-full`}
      >
        <Text style={tw`text-white text-center font-semibold text-base`}>
          Check Ticket
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentSuccess;
