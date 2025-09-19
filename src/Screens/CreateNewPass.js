import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { resetForgotPassword } from "../utils/api";

const CreateNewPass = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!email || !otp || !newPassword) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    try {
      await resetForgotPassword({ email, otp, newPassword });
      Alert.alert("Success", "Password reset successfully.");
      navigation.navigate("Tabs");
    } catch (error) {
      console.error("Reset failed:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to reset password."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1 bg-white`}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={tw`absolute top-10 left-4 z-10`}
      >
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <View style={tw`flex-1 justify-start items-center px-6 pt-16 mt-16`}>
        <Image
          source={require("../../assets/NewPass.png")}
          style={tw`w-16 h-16 mb-4`}
          resizeMode="contain"
        />
        <Text style={tw`text-xl font-bold mb-2`}>Reset Your Password </Text>
        <Text style={tw`text-center text-gray-600 mb-6`}>
          Please fill all fields to reset your password
        </Text>

        {/* Email */}
        <View
          style={tw`flex-row items-center border-2 border-gray-300 rounded-xl px-3 py-2 mb-4 w-full`}
        >
          <Icon name="envelope" size={20} color="#EF4444" />
          <TextInput
            style={tw`ml-2 flex-1`}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* OTP */}
        <View
          style={tw`flex-row items-center border-2 border-gray-300 rounded-xl px-3 py-2 mb-4 w-full`}
        >
          <Icon name="key" size={20} color="#EF4444" />
          <TextInput
            style={tw`ml-2 flex-1`}
            placeholder="Enter OTP"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
        </View>

        {/* New Password */}
        <View
          style={tw`flex-row items-center border-2 border-gray-300 rounded-xl px-3 py-2 mb-10 w-full`}
        >
          <Icon name="lock" size={20} color="#EF4444" />
          <TextInput
            style={tw`ml-2 flex-1`}
            placeholder="New Password"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Button */}
      <View style={tw`px-6 pb-6`}>
        <TouchableOpacity
          style={tw`bg-red-500 w-full py-3 rounded-xl`}
          onPress={handleSubmit}
        >
          <Text style={tw`text-white text-center font-semibold text-base`}>
            Confirm Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateNewPass;
