import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PaymentSuccess = () => {
  const navigation = useNavigation();

  const handleCheckTicket = () => {
    navigation.navigate("MyTicket"); // Change to your actual screen name
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      {/* Success Text */}
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 8 }}>
        Payment Success!
      </Text>
      <Text style={{ color: "#6b7280", textAlign: "center", marginBottom: 48 }}>
        Please check your ticket in the My Ticket menu
      </Text>

      {/* Button */}
      <TouchableOpacity
        onPress={handleCheckTicket}
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          backgroundColor: "#ef4444",
          paddingVertical: 16,
          borderRadius: 9999,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 16 }}>
          Check Ticket
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentSuccess;
