import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignupUser } from "../utils/api";
import { Picker } from "@react-native-picker/picker";

export default function Signup() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [interestedIn, setInterestedIn] = useState("");
  const [state, setState] = useState("VIC");

  const handleSignup = async () => {
    try {
      if (
        !name ||
        !email ||
        !password ||
        !phone ||
        !businessName ||
        !shortBio ||
        !interestedIn ||
        !state
      ) {
        Alert.alert("All fields are required!");
        return;
      }

      // Additional validation for password (e.g., minimum length)
      if (password.length < 6) {
        Alert.alert("Password must be at least 6 characters long!");
        return;
      }

      // Format phone for Australian numbers (add +61 if starts with 04 and 10 digits)
      let formattedPhone = phone.replace(/\s/g, ""); // Remove spaces
      if (formattedPhone.startsWith("04") && formattedPhone.length === 10) {
        formattedPhone = "+61" + formattedPhone.substring(1);
      } else if (
        formattedPhone.startsWith("4") &&
        formattedPhone.length === 9
      ) {
        formattedPhone = "+61" + formattedPhone;
      }
      // If already has +, assume it's formatted
      if (!formattedPhone.startsWith("+")) {
        Alert.alert(
          "Please enter a valid Australian phone number (e.g., 0412345678)"
        );
        return;
      }

      const interestsArray = interestedIn
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      if (interestsArray.length === 0) {
        Alert.alert("Please enter at least one interest!");
        return;
      }

      const payload = {
        name,
        email,
        password,
        phone: formattedPhone, // Use formatted phone
        businessName,
        shortBio,
        interestedIn: interestsArray,
        state,
      };

      console.log("Payload Sent:", payload); // For debugging

      const response = await SignupUser(payload);
      console.log("API Response:", response);
      Alert.alert("Your account created successfully"); // Add logging for response

      // ✅ Fixed: API returns user object directly (no nested 'user'), check for _id or success indicator
      if (response && response._id) {
        await AsyncStorage.setItem("user", JSON.stringify(response));
        await AsyncStorage.setItem("email", response.email || email); // Use response email (lowercased by backend)
        navigation.navigate("Signin");
      } else {
        Alert.alert("Signup incomplete", "Invalid response from server");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      Alert.alert("Signup Failed", errorMessage);
    }
  };

  // Debug logs (remove in production)
  console.log("State selected:", state);
  console.log("Interested In:", interestedIn);
  console.log("Short Bio:", shortBio);
  console.log("Business Name:", businessName);
  console.log("Phone:", phone);
  console.log("Password:", password);
  console.log("Email:", email);
  console.log("Name:", name);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1 bg-white`}
    >
      <ScrollView
        contentContainerStyle={tw`px-6 pt-8 pb-20`}
        showsVerticalScrollIndicator={false}
      >
        <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>
          Create new
        </Text>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>account</Text>
        <Text style={tw`text-sm text-gray-500 mb-6`}>
          Already have an account?{" "}
          <Text
            style={tw`text-red-500 font-semibold`}
            onPress={() => navigation.navigate("Signin")}
          >
            Sign In
          </Text>
        </Text>
        {/* Name */}
        <View
          style={tw`flex-row items-center border rounded-xl px-4 py-1 mb-2`}
        >
          <Ionicons name="person-outline" size={20} color="gray" />
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="black"
            style={tw`ml-2 flex-1 text-sm text-gray-700`}
            value={name}
            onChangeText={setName}
          />
        </View>
        {/* Email */}
        <View
          style={tw`flex-row items-center border rounded-xl px-4 py-1 mb-2`}
        >
          <Ionicons name="mail-outline" size={20} color="gray" />
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="black"
            style={tw`ml-2 flex-1 text-sm text-gray-700`}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        {/* Password */}
        <View
          style={tw`flex-row items-center border rounded-xl px-4 py-1 mb-2`}
        >
          <Ionicons name="lock-closed-outline" size={20} color="gray" />
          <TextInput
            placeholder="Enter your password (min 6 chars)"
            placeholderTextColor="black"
            style={tw`ml-2 flex-1 text-sm text-gray-700`}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {/* Phone */}
        <View
          style={tw`flex-row items-center border rounded-xl px-4 py-1 mb-2`}
        >
          <Ionicons name="call-outline" size={20} color="gray" />
          <TextInput
            placeholder="Enter your phone number (e.g., 0412345678)"
            placeholderTextColor="black"
            style={tw`ml-2 flex-1 text-sm text-gray-700`}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        {/* Business Name */}
        <View
          style={tw`flex-row items-center border rounded-xl px-4 py-1 mb-2`}
        >
          <Ionicons name="business-outline" size={20} color="gray" />
          <TextInput
            placeholder="Enter your business name"
            placeholderTextColor="black"
            style={tw`ml-2 flex-1 text-sm text-gray-700`}
            value={businessName}
            onChangeText={setBusinessName}
          />
        </View>
        {/* Short Bio */}
        <View style={tw`border rounded-xl px-4 py-1 mb-2`}>
          <TextInput
            placeholder="Write a short bio"
            placeholderTextColor="black"
            style={tw`text-sm text-gray-700`}
            value={shortBio}
            onChangeText={setShortBio}
            multiline
            numberOfLines={3}
          />
        </View>
        {/* Interested In */}
        <View
          style={tw`flex-row items-center border rounded-xl px-4 py-1 mb-2`}
        >
          <Ionicons name="heart-outline" size={20} color="gray" />
          <TextInput
            placeholder="Your interests (comma separated)"
            placeholderTextColor="black"
            style={tw`ml-2 flex-1 text-sm text-gray-700`}
            value={interestedIn}
            onChangeText={setInterestedIn}
          />
        </View>
        {/* State Dropdown */}
        <View style={tw`border rounded-xl px-4 py-1 mb-4`}>
          <Text style={tw`text-gray-700 text-sm mb-1 ml-1`}>Select State</Text>
          <Picker
            selectedValue={state}
            onValueChange={(itemValue) => setState(itemValue)}
            style={tw`text-sm text-gray-700`}
          >
            <Picker.Item label="VIC" value="VIC" />
            <Picker.Item label="NSW" value="NSW" />
            <Picker.Item label="QLD" value="QLD" />
            <Picker.Item label="SA" value="SA" />
            <Picker.Item label="WA" value="WA" />
          </Picker>
        </View>
        {/* Remember Me */}
        <View style={tw`flex-row items-center mb-6`}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={tw`mr-2`}
          >
            <Ionicons
              name={rememberMe ? "checkbox-outline" : "square-outline"}
              size={24}
              color={rememberMe ? "#EF4444" : "gray"}
            />
          </TouchableOpacity>
          <Text style={tw`text-sm text-gray-700`}>Remember me</Text>
        </View>
        {/* Signup Button */}
        <TouchableOpacity
          style={tw`bg-red-500 py-3 rounded-xl mb-6`}
          onPress={handleSignup}
        >
          <Text style={tw`text-white text-center font-semibold`}>Sign Up</Text>
        </TouchableOpacity>
        {/* Footer Text */}
        <Text style={tw`text-xs text-gray-400 text-center px-6 mb-6`}>
          By clicking “Sign Up” you agree to Recognote's{" "}
          <Text style={tw`text-red-500`}>Term of Use</Text> and{" "}
          <Text style={tw`text-red-500`}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
