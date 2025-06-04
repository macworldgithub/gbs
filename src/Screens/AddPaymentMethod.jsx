import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "tailwind-react-native-classnames";

const AddPaymentMethod = () => {
  const navigation = useNavigation();

  const [paymentMethod, setPaymentMethod] = useState("Master Card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!cardHolder) newErrors.cardHolder = true;
    if (!cardNumber) newErrors.cardNumber = true;
    if (!expiryDate) newErrors.expiryDate = true;
    if (!cvv) newErrors.cvv = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert("Validation Error", "Please fill all fields correctly.");
      return;
    }
    navigation.navigate("PaymentMethod");
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-grow bg-white px-4 pt-10`}>
      {/* Header */}
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity onPress={() => navigation.navigate("PaymentSettings")}>
          <Icon name="arrow-left" size={22} style={tw`text-black mr-3`} />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold`}>Add Payment Method</Text>
      </View>

      {/* Payment Method Dropdown */}
      <Text style={tw`text-sm text-gray-700 mb-1`}>Payment Method</Text>
      <View style={tw`border border-gray-300 rounded mb-4 px-3 py-2`}>
        <RNPickerSelect
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value)}
          items={[
            { label: "Master Card", value: "Master Card" },
            { label: "Visa", value: "Visa" },
            { label: "PayPal", value: "PayPal" },
          ]}
        />
      </View>

      {/* Card Holder Name */}
      <Text style={tw`text-sm text-gray-700 mb-1`}>Card Holder Name</Text>
      <TextInput
        style={tw.style(
          "border rounded px-4 py-3 mb-4",
          errors.cardHolder ? "border-red-500" : "border-gray-300"
        )}
        placeholder="Card Holder Name"
        value={cardHolder}
        onChangeText={setCardHolder}
      />

      {/* Card Number */}
      <Text style={tw`text-sm text-gray-700 mb-1`}>Card Number</Text>
      <TextInput
        style={tw.style(
          "border rounded px-4 py-3 mb-4",
          errors.cardNumber ? "border-red-500" : "border-gray-300"
        )}
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      {/* Expired Date and CVV */}
      <View style={tw`flex-row justify-between`}>
        <View style={tw`w-[48%]`}>
          <Text style={tw`text-sm text-gray-700 mb-1`}>Expired Date</Text>
          <TextInput
            style={tw.style(
              "border rounded px-4 py-3 mb-4",
              errors.expiryDate ? "border-red-500" : "border-gray-300"
            )}
            placeholder="MM/YYYY"
            value={expiryDate}
            onChangeText={setExpiryDate}
          />
        </View>
        <View style={tw`w-[48%]`}>
          <Text style={tw`text-sm text-gray-700 mb-1`}>CVV</Text>
          <TextInput
            style={tw.style(
              "border rounded px-4 py-3 mb-4",
              errors.cvv ? "border-red-500" : "border-gray-300"
            )}
            placeholder="123"
            keyboardType="numeric"
            secureTextEntry={true}
            value={cvv}
            onChangeText={setCvv}
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        style={tw`bg-red-500 rounded-full py-4 mt-52 mb-6`}
      >
        <Text style={tw`text-white text-center font-bold text-base`}
        onPress={() => navigation.navigate("PaymentMethod")}>
          Save
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddPaymentMethod;
