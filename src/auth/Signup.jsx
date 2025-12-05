import React, { useState, useEffect } from "react";
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
  const [agreeCodeOfConduct, setAgreeCodeOfConduct] = useState(false);
  const [agreeMemberValues, setAgreeMemberValues] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [interestedIn, setInterestedIn] = useState("");
  const [state, setState] = useState("VIC");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [packages, setPackages] = useState([]);

  const businessRoles = [
    "business",
    "business_executive",
    "chairmans_club",
    "top_tier_business",
  ];

  const getRoleNameById = (id) => {
    const pkg = packages.find((p) => p._id === id);
    return pkg ? pkg.name : "user";
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          "https://gbs.westsidecarcare.com.au/roles"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();
        // API returns array of objects with _id, name, label
        setPackages(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
        Alert.alert("Failed to load packages");
      }
    };
    fetchPackages();
  }, []);

  const roleName = selectedPackageId ? getRoleNameById(selectedPackageId) : "";
  const isBusinessRole = businessRoles.includes(roleName);

  const handleSignup = async () => {
    try {
      // Required fields including package
      if (
        !name ||
        !email ||
        !password ||
        !phone ||
        !shortBio ||
        !interestedIn ||
        !state ||
        !selectedPackageId
      ) {
        Alert.alert("All fields are required, including package selection!");
        return;
      }
      // Business name required only for specific roles
      if (isBusinessRole && !businessName) {
        Alert.alert("Business name is required for this package!");
        return;
      }
      // Password min length
      if (password.length < 6) {
        Alert.alert("Password must be at least 6 characters long!");
        return;
      }
      // Format phone for Australian numbers
      let formattedPhone = phone.replace(/\s/g, ""); // Remove spaces
      if (formattedPhone.startsWith("04") && formattedPhone.length === 10) {
        formattedPhone = "+61" + formattedPhone.substring(1);
      } else if (
        formattedPhone.startsWith("4") &&
        formattedPhone.length === 9
      ) {
        formattedPhone = "+61" + formattedPhone;
      }
      // Validate phone starts with +
      if (!formattedPhone.startsWith("+")) {
        Alert.alert(
          "Please enter a valid Australian phone number (e.g., 0412345678)"
        );
        return;
      }
      // Require agreement to both policies
      if (!agreeCodeOfConduct || !agreeMemberValues) {
        Alert.alert(
          "Required",
          "You must agree to the Code of Conduct and GBS Member Values to continue."
        );
        return;
      }
      // Parse interests
      const interestsArray = interestedIn
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      if (interestsArray.length === 0) {
        Alert.alert("Please enter at least one interest!");
        return;
      }
      // Build payload (role name for signup, businessName only if business role)
      const finalRoleName = getRoleNameById(selectedPackageId);
      const payload = {
        name,
        email,
        password,
        phone: formattedPhone,
        role: finalRoleName, // Use name for signup
        shortBio,
        interestedIn: interestsArray,
        state,
        ...(isBusinessRole && { businessName }), // Conditional
      };
      console.log("Payload Sent:", payload); // Debug
      const response = await SignupUser(payload);
      console.log("API Response:", response); // Debug
      Alert.alert("Your account created successfully");
      // Save to AsyncStorage if success (_id indicates created user)
      if (response && response._id) {
        await AsyncStorage.setItem("user", JSON.stringify(response));
        await AsyncStorage.setItem("email", response.email || email);
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
  console.log("Selected Package ID:", selectedPackageId);
  console.log("Packages:", packages);

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
        {/* Package Selection Dropdown - At the top */}
        <View style={tw`border rounded-xl px-4 py-1 mb-4`}>
          <Text style={tw`text-gray-700 text-sm mb-1 ml-1`}>
            Select Package *
          </Text>
          <Picker
            selectedValue={selectedPackageId}
            onValueChange={(itemValue) => {
              setSelectedPackageId(itemValue);
              if (itemValue) {
                AsyncStorage.setItem("selectedPackage", itemValue); // Store ID
              } else {
                AsyncStorage.removeItem("selectedPackage");
              }
            }}
            style={tw`text-sm text-gray-700`}
          >
            <Picker.Item label="Select a package" value="" />
            {packages.map((pkg, index) => (
              <Picker.Item
                key={index}
                label={pkg.label || pkg.name} // Use label if available, else name
                value={pkg._id} // Use _id as value
              />
            ))}
          </Picker>
        </View>
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
        {/* Business Name - Show only if business role selected */}
        {isBusinessRole ? (
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
        ) : null}
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
        {/* Code of Conduct Checkbox */}
        <View style={tw`flex-row items-center mb-3`}>
          <TouchableOpacity
            onPress={() => setAgreeCodeOfConduct(!agreeCodeOfConduct)}
            style={tw`mr-2`}
          >
            <Ionicons
              name={agreeCodeOfConduct ? "checkbox-outline" : "square-outline"}
              size={24}
              color={agreeCodeOfConduct ? "#EF4444" : "gray"}
            />
          </TouchableOpacity>

          <Text style={tw`text-sm text-gray-700`}>
            I agree to the{" "}
            <Text
              style={tw`text-red-500 font-semibold`}
              onPress={() => navigation.navigate("CodeOfConduct")}
            >
              Code of Conduct
            </Text>
          </Text>
        </View>

        {/* GBS Member Values Checkbox */}
        <View style={tw`flex-row items-center mb-6`}>
          <TouchableOpacity
            onPress={() => setAgreeMemberValues(!agreeMemberValues)}
            style={tw`mr-2`}
          >
            <Ionicons
              name={agreeMemberValues ? "checkbox-outline" : "square-outline"}
              size={24}
              color={agreeMemberValues ? "#EF4444" : "gray"}
            />
          </TouchableOpacity>

          <Text style={tw`text-sm text-gray-700`}>
            I agree to the{" "}
            <Text
              style={tw`text-red-500 font-semibold`}
              onPress={() => navigation.navigate("GBSMemberValues")}
            >
              GBS Member Values
            </Text>
          </Text>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={tw`bg-red-500 py-3 rounded-xl mb-6`}
          onPress={handleSignup}
        >
          <Text style={tw`text-white text-center font-semibold`}>Sign Up</Text>
        </TouchableOpacity>
        {/* Footer Text */}
        <Text style={tw`text-xs text-gray-500 text-center px-6 mb-6`}>
          By signing up, you confirm that you have read and agreed to the{" "}
          <Text
            style={tw`text-red-500 font-semibold`}
            onPress={() => navigation.navigate("CodeOfConduct")}
          >
            Code of Conduct
          </Text>{" "}
          and{" "}
          <Text
            style={tw`text-red-500 font-semibold`}
            onPress={() => navigation.navigate("GBSMemberValues")}
          >
            GBS Member Values
          </Text>
          .
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
