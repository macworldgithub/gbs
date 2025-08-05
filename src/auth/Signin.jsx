import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import * as Device from "expo-device";
import { FontAwesome, Feather } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
// import { Image } from "react-native-svg";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";

// 🔁 Replace with your actual backend API base URL
// export const API_BASE_URL = "http://192.168.100.197:9000";

const Signin = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

 const handleSignin = async () => {
  if (!email || !password) {
    Alert.alert("Missing Fields", "Please enter both email and password.");
    return;
  }

  // Force unique deviceId to trigger OTP every time
  const deviceId = `${Device.osInternalBuildId || 'dummy'}-${Date.now()}`;
  const platform = Platform.OS;
  const deviceName = Device.deviceName || "Unknown Device";

  const payload = {
    email: email.trim(),
    password: password,
    deviceId: deviceId,
  };

  console.log("📤 Sending PreLogin Payload:", payload);
  setLoading(true);

  try {
    const res = await axios.post(`${API_BASE_URL}/user/auth/pre-login`, payload);
    console.log("✅ PreLogin Response:", res.data);

    if (res.status === 200) {
      // Force navigate to OTPVerification regardless of otpRequired
      Alert.alert("Success", "OTP sent to your email.");
      navigation.navigate("OTPVerification", {
        email,
        deviceId,
        platform,
        deviceName,
      });
    } else {
      Alert.alert("Login Failed", res.data?.message || "Invalid credentials");
    }
  } catch (err) {
    console.log("❌ Pre-login Error:", err.response?.data || err.message);
    Alert.alert(
      "Error",
      err.response?.data?.message || err.message || "Network error. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow justify-start px-6 pt-10`}
      >
        <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>
          Sign in to
        </Text>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>
          your account
        </Text>

        <Text style={tw`text-sm text-gray-600 mb-6`}>
          Don’t have an account?{" "}
          <Text
            style={tw`text-red-500 font-semibold`}
            onPress={() => navigation.navigate("Signup")}
          >
            Sign Up
          </Text>
        </Text>

        {/* Email Input */}
        <View
          style={tw`flex-row items-center border border-red-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}
        >
          <FontAwesome name="envelope" size={16} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2 text-sm text-gray-900`}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View
          style={tw`flex-row items-center border border-red-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}
        >
          <FontAwesome name="lock" size={16} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2 text-sm text-gray-900`}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={16}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me & Forgot Password */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={tw`flex-row items-center`}
          >
            <View
              style={tw`w-4 h-4 mr-2 border border-gray-400 rounded items-center justify-center`}
            >
              {rememberMe && (
                <FontAwesome name="check" size={10} color="#EF4444" />
              )}
            </View>
            <Text style={tw`text-sm text-gray-700`}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
            <Text style={tw`text-sm text-red-500 font-semibold`}>
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={tw`bg-red-500 py-3 rounded-xl mb-6`}
          onPress={handleSignin}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-semibold`}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={tw`flex-row items-center mb-6`}>
          <View style={tw`flex-1 h-px bg-gray-300`} />
          <Text style={tw`px-2 text-sm text-gray-400`}>or sign in with</Text>
          <View style={tw`flex-1 h-px bg-gray-300`} />
        </View>

        {/* Social Buttons */}
        <View style={tw`mb-4`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white mb-3`}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/google-logo.png",
              }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text style={tw`text-sm`}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white mb-3`}>
            <Image source={{ uri: 'https://img.icons8.com/color/48/facebook-new.png' }} style={{ width: 20, height: 20, marginRight: 10 }} />
            <Text style={tw`text-sm`}>Sign in with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white`}>
            <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/mac-os.png' }} style={{ width: 20, height: 20, marginRight: 10 }} />
            <Text style={tw`text-sm`}>Sign in with Apple</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signin;
