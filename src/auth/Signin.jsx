// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   Image,
//   Switch,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Device from "expo-device";
// import { FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
// import tw from "tailwind-react-native-classnames";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import { API_BASE_URL } from "../utils/config";
// import Toast from "react-native-toast-message";
// import { storeUserData } from "../utils/storage";
// import {

//   isBiometricAvailable,
//   setSession,
//   setBiometricsEnabled,
//   getBiometricsEnabled,
//   clearSession,
// } from "../utils/secureAuth";
// const Signin = () => {
//   const navigation = useNavigation();
//   const [identifier, setIdentifier] = useState(""); // Combined email/phone field
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [usePassword, setUsePassword] = useState(false); // New state for password toggle
//   const [loading, setLoading] = useState(false);
//   const [useBiometrics, setUseBiometrics] = useState(false);
//   const [biometricCapable, setBiometricCapable] = useState(false);
//   const handleToggleBiometrics = async (val) => {
//     try {
//       setUseBiometrics(val);
//       await setBiometricsEnabled(!!val);
//       if (!val) {
//         // Remove any existing biometric-protected session so the app won't prompt on next launch
//         await clearSession();
//       }
//     } catch (e) {
//       console.log("biometrics toggle error:", e);
//     }
//   };
//   React.useEffect(() => {
//     (async () => {
//       try {
//         const { available, biometryType } = await isBiometricAvailable();
//         console.log(
//           "Biometric availability:",
//           available,
//           "type:",
//           biometryType
//         );
//         setBiometricCapable(!!available);
//       } catch (e) {
//         console.log("isBiometricAvailable error:", e);
//       }
//       try {
//         const previouslyEnabled = await getBiometricsEnabled();
//         setUseBiometrics(!!previouslyEnabled);
//       } catch (e) {
//         console.log("getBiometricsEnabled error:", e);
//       }
//     })();
//   }, []);
//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };
//   const isValidPhone = (phone) => {
//     const cleanPhone = phone.replace(/\s/g, "");
//     const phoneRegex = /^(\+?61|04)\d{8,9}$/;
//     return phoneRegex.test(cleanPhone);
//   };
//   const isValidIdentifier = (id) => {
//     const trimmed = id.trim();
//     return isValidEmail(trimmed) || isValidPhone(trimmed);
//   };
//   const formatPhoneForPayload = (phone) => {
//     let cleanPhone = phone.replace(/\s/g, "");
//     if (cleanPhone.startsWith("04") && cleanPhone.length === 10) {
//       return "+61" + cleanPhone.substring(1);
//     } else if (cleanPhone.startsWith("4") && cleanPhone.length === 9) {
//       return "+61" + cleanPhone;
//     }
//     return cleanPhone.startsWith("+") ? cleanPhone : "+61" + cleanPhone;
//   };
//   const buildPayload = (id, pass) => {
//     const trimmedId = id.trim();
//     let payload = {};
//     console.log("🔍 Building payload for identifier:", trimmedId); // Debug: Log identifier being processed
//     console.log("🔍 Password provided?", !!pass); // Debug: Check if password is being added
//     if (isValidEmail(trimmedId)) {
//       payload.email = trimmedId.toLowerCase();
//       console.log("📧 Using email in payload:", payload.email); // Debug: Email case
//     } else if (isValidPhone(trimmedId)) {
//       payload.phone = formatPhoneForPayload(trimmedId);
//       console.log("📱 Using phone in payload:", payload.phone); // Debug: Phone case
//     } else {
//       throw new Error("Invalid identifier format");
//     }
//     if (pass) {
//       payload.password = pass;
//       console.log("🔑 Adding password to payload"); // Debug: Password added
//     } else {
//       console.log("🚫 No password added to payload - sending without password"); // Debug: No password
//     }
//     return payload;
//   };
//   const handleSignin = async () => {
//     const trimmedIdentifier = identifier.trim();
//     if (!trimmedIdentifier) {
//       Alert.alert("Missing Fields", "Please enter your email or phone number.");
//       return;
//     }
//     if (!isValidIdentifier(trimmedIdentifier)) {
//       Alert.alert(
//         "Invalid Input",
//         "Please enter a valid email or Australian phone number (e.g., example@email.com or 0412345678)."
//       );
//       return;
//     }
//     if (usePassword && !password) {
//       Alert.alert("Missing Password", "Please enter your password.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const payload = buildPayload(
//         trimmedIdentifier,
//         usePassword ? password : undefined
//       );
//       // Enhanced debug log for payload
//       console.log(
//         "📦 Full Payload for /signin API:",
//         JSON.stringify(payload, null, 2)
//       );
//       console.log(
//         "🌐 API URL being called:",
//         `${API_BASE_URL}/user/auth/signin`
//       ); // Debug: Full URL
//       const res = await axios.post(`${API_BASE_URL}/user/auth/signin`, payload);
//       console.log("✅ Response Status:", res.status);
//       console.log("✅ Full Response Data:", JSON.stringify(res.data, null, 2)); // Enhanced: Full JSON
//       const { message, token, user } = res.data || {};
//       if (token && user) {
//         // Successful login
//         console.log(
//           "🎉 Login successful - token received:",
//           token ? "Yes" : "No"
//         ); // Debug: Token check
//         const userData = {
//           token,
//           ...user,
//         };
//         await storeUserData(userData);
//         if (useBiometrics && biometricCapable && token) {
//           await setSession(userData, { requireBiometrics: true });
//           await setBiometricsEnabled(true);
//         }
//         Alert.alert("Success", "Login successful!");
//         navigation.replace("Tabs");
//       } else if (
//         message &&
//         (message.toLowerCase().includes("sent") ||
//           message.toLowerCase().includes("password") ||
//           message.toLowerCase().includes("otp") || // Added: Handle OTP-related messages
//           message.toLowerCase().includes("temporary")) // Added: Handle temp pass messages
//       ) {
//         // Temp password/OTP sent - enable password field
//         console.log("📨 Temp password/OTP message detected:", message); // Debug: Temp pass case
//         setUsePassword(true);
//         Alert.alert(
//           "Password Sent",
//           `${message}\n\nCheck your email and enter the temporary password below to complete login.`
//         );
//       } else {
//         // Unexpected response
//         console.log("❓ Unexpected response - no token, no temp message"); // Debug: Unexpected
//         Alert.alert(
//           "Unexpected Response",
//           message || "Server response is incomplete. Please try again."
//         );
//       }
//     } catch (err) {
//       console.log("❌ Full Error Object:", err); // Enhanced: Full error
//       console.log(
//         "❌ Error during sign-in - Response Data:",
//         err.response?.data
//           ? JSON.stringify(err.response.data, null, 2)
//           : "No response data"
//       );
//       console.log("❌ Error Status:", err.response?.status); // Debug: Status
//       console.log("❌ Error Message:", err.message || "No message"); // Debug: Message
//       const status = err.response?.status;
//       const errorMsg =
//         err.response?.data?.message ||
//         err.response?.data?.error || // Added: Handle possible 'error' field
//         "Something went wrong. Please try again.";
//       if (status === 401) {
//         console.log(
//           "🔐 401 Detected - Checking if it's invalid creds or no password case"
//         ); // Debug: 401 specifics
//         // Check if error might be related to no password (customize based on API response)
//         if (
//           errorMsg.toLowerCase().includes("password") ||
//           errorMsg.toLowerCase().includes("required")
//         ) {
//           console.log("💡 Possible no-password flow - enabling password field"); // Debug: Suggest enabling
//           setUsePassword(true);
//           Alert.alert(
//             "Action Required",
//             `${errorMsg}\n\nEnter the temporary password sent to your email.`
//           );
//         } else {
//           Alert.alert("Invalid Credentials", errorMsg);
//         }
//       } else if (status === 404) {
//         console.log("🚫 404 - User not found?"); // Debug: 404 case
//         Alert.alert(
//           "User Not Found",
//           "Email or phone not registered. Please sign up."
//         );
//       } else {
//         Alert.alert("Login Error", errorMsg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Guest sign-in - stores a lightweight guest record valid for 7 days
//   const handleGuestSignIn = async () => {
//     try {
//       const now = Date.now();
//       const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
//       // Check for existing guest expiry
//       const existingExpiryStr = await AsyncStorage.getItem("guestExpiry");
//       let expiry = now + sevenDaysMs; // Default new expiry
//       if (existingExpiryStr) {
//         const existingExpiry = parseInt(existingExpiryStr, 10);
//         if (now < existingExpiry) {
//           // Reuse existing if not expired
//           expiry = existingExpiry;
//         } else {
//           // Expired, create new
//           expiry = now + sevenDaysMs;
//           await AsyncStorage.setItem("guestExpiry", expiry.toString());
//         }
//       } else {
//         // No existing, create new
//         await AsyncStorage.setItem("guestExpiry", expiry.toString());
//       }
//       const guestData = {
//         token: "guest-token", // non-sensitive placeholder
//         isGuest: true,
//         guestExpiry: expiry,
//         name: "Guest User",
//         email: null,
//       };
//       // store using existing helper (and also keep AsyncStorage for safety)
//       try {
//         await storeUserData(guestData);
//       } catch (e) {
//         // fallback to direct storage if helper fails
//         console.log("storeUserData helper error:", e);
//       }
//       await AsyncStorage.setItem("userData", JSON.stringify(guestData));
//       Alert.alert(
//         "Guest Access",
//         `You are signed in as a guest. Guest access is valid until ${new Date(
//           expiry
//         ).toLocaleString()}.`
//       );
//       navigation.replace("Tabs");
//     } catch (e) {
//       console.error("Guest sign-in error:", e);
//       Alert.alert("Error", "Could not sign in as guest. Please try again.");
//     }
//   };
//   return (
//     <KeyboardAvoidingView
//       style={tw`flex-1 bg-white`}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <ScrollView
//         contentContainerStyle={tw`flex-grow justify-start px-6 pt-10`}
//       >
//         <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>
//           Sign in to
//         </Text>
//         <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>
//           your account
//         </Text>
//         <Text style={tw`text-sm text-gray-600 mb-6`}>
//           Don’t have an account?{" "}
//           <Text
//             style={tw`text-red-500 font-semibold`}
//             onPress={() => navigation.navigate("Signup")}
//           >
//             Sign Up
//           </Text>
//         </Text>
//         {/* Identifier Input (Email or Phone) */}
//         <View
//           style={tw`flex-row items-center border border-red-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}
//         >
//           <FontAwesome name="user" size={16} color="#6B7280" />
//           <TextInput
//             style={tw`flex-1 ml-2 text-sm text-gray-900`}
//             placeholder="Enter your email or phone number"
//             placeholderTextColor="#9CA3AF"
//             value={identifier}
//             onChangeText={setIdentifier}
//             keyboardType="default"
//             autoCapitalize="none"
//           />
//         </View>
//         {/* Password Input */}
//         <View
//           style={tw`flex-row items-center border border-red-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}
//         >
//           <FontAwesome name="lock" size={16} color="#6B7280" />
//           <TextInput
//             style={tw`flex-1 ml-2 text-sm text-gray-900`}
//             placeholder={
//               usePassword
//                 ? "Enter your password"
//                 : "Temporary password will be sent to your email"
//             }
//             placeholderTextColor="#9CA3AF"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//             editable={usePassword}
//             disabled={!usePassword}
//           />
//           <TouchableOpacity
//             onPress={() => setShowPassword(!showPassword)}
//             disabled={!usePassword}
//           >
//             <Feather
//               name={showPassword ? "eye-off" : "eye"}
//               size={16}
//               color={usePassword ? "#6B7280" : "#D1D5DB"}
//             />
//           </TouchableOpacity>
//         </View>
//         {/* Use Password Checkbox */}
//         <View style={tw`flex-row items-center mb-2`}>
//           <TouchableOpacity
//             onPress={() => setUsePassword(!usePassword)}
//             style={tw`flex-row items-center mr-2`}
//           >
//             <View
//               style={tw`w-4 h-4 border border-gray-400 rounded items-center justify-center`}
//             >
//               {usePassword && (
//                 <FontAwesome name="check" size={10} color="#EF4444" />
//               )}
//             </View>
//           </TouchableOpacity>
//           <Text style={tw`text-sm text-gray-700`}>I have a password</Text>
//         </View>
//         {/* Remember Me & Forgot Password */}
//         <View style={tw`flex-row justify-between items-center mb-6`}>
//           <TouchableOpacity
//             onPress={() => setRememberMe(!rememberMe)}
//             style={tw`flex-row items-center`}
//           >
//             <View
//               style={tw`w-4 h-4 mr-2 border border-gray-400 rounded items-center justify-center`}
//             >
//               {rememberMe && (
//                 <FontAwesome name="check" size={10} color="#EF4444" />
//               )}
//             </View>
//             <Text style={tw`text-sm text-gray-700`}>Remember me</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
//             <Text style={tw`text-sm text-red-500 font-semibold`}>
//               Forgot Password
//             </Text>
//           </TouchableOpacity>
//         </View>
//         {biometricCapable ? (
//           <View style={tw`flex-row justify-between items-center mb-6`}>
//             <Text style={tw`text-sm text-gray-700`}>
//               Use Face/Touch ID next time
//             </Text>
//             <Switch
//               value={useBiometrics}
//               onValueChange={handleToggleBiometrics}
//             />
//           </View>
//         ) : null}
//         {/* Sign In Button */}
//         <TouchableOpacity
//           style={tw`bg-red-500 py-3 rounded-xl mb-6`}
//           onPress={handleSignin}
//           disabled={loading}
//         >
//           <Text style={tw`text-white text-center font-semibold`}>
//             {loading ? "Signing in..." : "Sign in"}
//           </Text>
//         </TouchableOpacity>
//         {/* Divider */}
//         <View style={tw`flex-row items-center mb-6`}>
//           <View style={tw`flex-1 h-px bg-gray-300`} />
//           <Text style={tw`px-2 text-sm text-gray-400`}>or sign in with</Text>
//           <View style={tw`flex-1 h-px bg-gray-300`} />
//         </View>
//         {/* Social Buttons */}
//         <View style={tw`mb-4`}>
//           <TouchableOpacity
//             style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white mb-3`}
//           >
//             <Image
//               source={{
//                 uri: "https://img.icons8.com/color/48/google-logo.png",
//               }}
//               style={{ width: 20, height: 20, marginRight: 10 }}
//             />
//             <Text style={tw`text-sm`}>Sign in with Google</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white mb-3`}
//           >
//             <Image
//               source={{
//                 uri: "https://img.icons8.com/color/48/facebook-new.png",
//               }}
//               style={{ width: 20, height: 20, marginRight: 10 }}
//             />
//             <Text style={tw`text-sm`}>Sign in with Facebook</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white`}
//           >
//             <Image
//               source={{
//                 uri: "https://img.icons8.com/ios-filled/50/mac-os.png",
//               }}
//               style={{ width: 20, height: 20, marginRight: 10 }}
//             />
//             <Text style={tw`text-sm`}>Sign in with Apple</Text>
//           </TouchableOpacity>
//         </View>
//         {/* Guest Sign-in: visually matches the primary sign-in button */}
//         {/* <View style={tw`mt-2 mb-8`}>
//           <TouchableOpacity
//             onPress={handleGuestSignIn}
//             style={tw`flex-row items-center justify-center bg-red-500 py-3 rounded-xl`}
//           >
//             <FontAwesome
//               name="user"
//               size={16}
//               color="#fff"
//               style={{ marginRight: 10 }}
//             />
//             <Text style={tw`text-white text-center font-semibold`}>
//               Continue as Guest
//             </Text>
//           </TouchableOpacity>
//         </View> */}
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };
// export default Signin;

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
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import Toast from "react-native-toast-message";
import { storeUserData } from "../utils/storage";
import {
  isBiometricAvailable,
  setSession,
  setBiometricsEnabled,
  getBiometricsEnabled,
  clearSession,
} from "../utils/secureAuth";
const Signin = () => {
  const navigation = useNavigation();
  const [identifier, setIdentifier] = useState(""); // Combined email/phone field
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // const [usePassword, setUsePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [biometricCapable, setBiometricCapable] = useState(false);
  // const handleToggleBiometrics = async (val) => {
  //   try {
  //     setUseBiometrics(val);
  //     await setBiometricsEnabled(!!val);
  //     if (!val) {
  //       // Remove any existing biometric-protected session so the app won't prompt on next launch
  //       await clearSession();
  //     }
  //   } catch (e) {
  //     console.log("biometrics toggle error:", e);
  //   }
  // };

  const handleToggleBiometrics = async (val) => {
    try {
      setUseBiometrics(val);
      await setBiometricsEnabled(!!val);

      // ❗ Do NOT create or clear session here
      // Session should be handled only after login
    } catch (e) {
      console.log("biometrics toggle error:", e);
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        const { available, biometryType } = await isBiometricAvailable();
        console.log(
          "Biometric availability:",
          available,
          "type:",
          biometryType,
        );
        setBiometricCapable(!!available);
      } catch (e) {
        console.log("isBiometricAvailable error:", e);
      }
      try {
        const previouslyEnabled = await getBiometricsEnabled();
        setUseBiometrics(!!previouslyEnabled);
      } catch (e) {
        console.log("getBiometricsEnabled error:", e);
      }
    })();
  }, []);
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isValidPhone = (phone) => {
    const cleanPhone = phone.replace(/\s/g, "");
    const phoneRegex = /^(\+?61|04)\d{8,9}$/;
    return phoneRegex.test(cleanPhone);
  };
  const isValidIdentifier = (id) => {
    const trimmed = id.trim();
    return isValidEmail(trimmed) || isValidPhone(trimmed);
  };
  const formatPhoneForPayload = (phone) => {
    let cleanPhone = phone.replace(/\s/g, "");
    if (cleanPhone.startsWith("04") && cleanPhone.length === 10) {
      return "+61" + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith("4") && cleanPhone.length === 9) {
      return "+61" + cleanPhone;
    }
    return cleanPhone.startsWith("+") ? cleanPhone : "+61" + cleanPhone;
  };
  const buildPayload = (id, pass) => {
    const trimmedId = id.trim();
    let payload = {};
    console.log("🔍 Building payload for identifier:", trimmedId); // Debug: Log identifier being processed
    console.log("🔍 Password provided?", !!pass); // Debug: Check if password is being added
    if (isValidEmail(trimmedId)) {
      payload.email = trimmedId.toLowerCase();
      console.log("📧 Using email in payload:", payload.email); // Debug: Email case
    } else if (isValidPhone(trimmedId)) {
      payload.phone = formatPhoneForPayload(trimmedId);
      console.log("📱 Using phone in payload:", payload.phone); // Debug: Phone case
    } else {
      throw new Error("Invalid identifier format");
    }
    if (pass) {
      payload.password = pass;
      console.log("🔑 Adding password to payload"); // Debug: Password added
    } else {
      console.log("🚫 No password added to payload - sending without password"); // Debug: No password
    }
    return payload;
  };
  const handleSignin = async () => {
    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      Alert.alert("Missing Fields", "Please enter your email or phone number.");
      return;
    }
    if (!isValidIdentifier(trimmedIdentifier)) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid email or Australian phone number (e.g., example@email.com or 0412345678).",
      );
      return;
    }
    // if (usePassword && !password) {
    //   Alert.alert("Missing Password", "Please enter your password.");
    //   return;
    // }
    if (!password) {
      Alert.alert("Missing Password", "Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      // const payload = buildPayload(
      //   trimmedIdentifier,
      //   usePassword ? password : undefined,
      // );

      const payload = buildPayload(trimmedIdentifier, password);

      // Enhanced debug log for payload
      console.log(
        "📦 Full Payload for /signin API:",
        JSON.stringify(payload, null, 2),
      );
      console.log(
        "🌐 API URL being called:",
        `${API_BASE_URL}/user/auth/signin`,
      ); // Debug: Full URL
      const res = await axios.post(`${API_BASE_URL}/user/auth/signin`, payload);
      console.log("✅ Response Status:", res.status);
      console.log("✅ Full Response Data:", JSON.stringify(res.data, null, 2)); // Enhanced: Full JSON
      const { message, token, user } = res.data || {};
      if (token && user) {
        // Successful login
        console.log(
          "🎉 Login successful - token received:",
          token ? "Yes" : "No",
        ); // Debug: Token check
        const userData = {
          token,
          ...user,
        };
        await storeUserData(userData);
        // if (useBiometrics && biometricCapable && token) {
        //   await setSession(userData, { requireBiometrics: true });
        //   await setBiometricsEnabled(true);
        // }

        if (useBiometrics && biometricCapable && token) {
          await setSession(userData, { requireBiometrics: true });
        }

        Alert.alert("Success", "Login successful!");
        navigation.replace("Tabs");
      } else if (
        message &&
        (message.toLowerCase().includes("sent") ||
          message.toLowerCase().includes("password") ||
          message.toLowerCase().includes("otp") || // Added: Handle OTP-related messages
          message.toLowerCase().includes("temporary")) // Added: Handle temp pass messages
      ) {
        // Temp password/OTP sent - enable password field
        console.log("📨 Temp password/OTP message detected:", message); // Debug: Temp pass case
        setUsePassword(true);
        Alert.alert(
          "Password Sent",
          `${message}\n\nCheck your email and enter the temporary password below to complete login.`,
        );
      } else {
        // Unexpected response
        console.log("❓ Unexpected response - no token, no temp message"); // Debug: Unexpected
        Alert.alert(
          "Unexpected Response",
          message || "Server response is incomplete. Please try again.",
        );
      }
    } catch (err) {
      console.log("❌ Full Error Object:", err); // Enhanced: Full error
      console.log(
        "❌ Error during sign-in - Response Data:",
        err.response?.data
          ? JSON.stringify(err.response.data, null, 2)
          : "No response data",
      );
      console.log("❌ Error Status:", err.response?.status); // Debug: Status
      console.log("❌ Error Message:", err.message || "No message"); // Debug: Message
      const status = err.response?.status;
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error || // Added: Handle possible 'error' field
        "Something went wrong. Please try again.";
      if (status === 401) {
        console.log(
          "🔐 401 Detected - Checking if it's invalid creds or no password case",
        ); // Debug: 401 specifics
        // Check if error might be related to no password (customize based on API response)
        if (
          errorMsg.toLowerCase().includes("password") ||
          errorMsg.toLowerCase().includes("required")
        ) {
          console.log("💡 Possible no-password flow - enabling password field"); // Debug: Suggest enabling
          setUsePassword(true);
          Alert.alert(
            "Action Required",
            `${errorMsg}\n\nEnter the temporary password sent to your email.`,
          );
        } else {
          Alert.alert("Invalid Credentials", errorMsg);
        }
      } else if (status === 404) {
        console.log("🚫 404 - User not found?"); // Debug: 404 case
        Alert.alert(
          "User Not Found",
          "Email or phone not registered. Please sign up.",
        );
      } else {
        Alert.alert("Login Error", errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };
  // Guest sign-in - stores a lightweight guest record valid for 7 days
  const handleGuestSignIn = async () => {
    try {
      const now = Date.now();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      // Check for existing guest expiry
      const existingExpiryStr = await AsyncStorage.getItem("guestExpiry");
      let expiry = now + sevenDaysMs; // Default new expiry
      if (existingExpiryStr) {
        const existingExpiry = parseInt(existingExpiryStr, 10);
        if (now < existingExpiry) {
          // Reuse existing if not expired
          expiry = existingExpiry;
        } else {
          // Expired, create new
          expiry = now + sevenDaysMs;
          await AsyncStorage.setItem("guestExpiry", expiry.toString());
        }
      } else {
        // No existing, create new
        await AsyncStorage.setItem("guestExpiry", expiry.toString());
      }
      const guestData = {
        token: "guest-token", // non-sensitive placeholder
        isGuest: true,
        guestExpiry: expiry,
        name: "Guest User",
        email: null,
      };
      // store using existing helper (and also keep AsyncStorage for safety)
      try {
        await storeUserData(guestData);
      } catch (e) {
        // fallback to direct storage if helper fails
        console.log("storeUserData helper error:", e);
      }
      await AsyncStorage.setItem("userData", JSON.stringify(guestData));
      Alert.alert(
        "Guest Access",
        `You are signed in as a guest. Guest access is valid until ${new Date(
          expiry,
        ).toLocaleString()}.`,
      );
      navigation.replace("Tabs");
    } catch (e) {
      console.error("Guest sign-in error:", e);
      Alert.alert("Error", "Could not sign in as guest. Please try again.");
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
            style={tw`text-red-500 font-bold text-xl`}
            onPress={() => navigation.navigate("Signup")}
          >
            Sign Up
          </Text>
        </Text>
        {/* Identifier Input (Email or Phone) */}
        <View
          style={tw`flex-row items-center border border-red-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}
        >
          <FontAwesome name="user" size={16} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2 text-sm text-gray-900`}
            placeholder="Enter your email or phone number"
            placeholderTextColor="#9CA3AF"
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="default"
            autoCapitalize="none"
          />
        </View>
        {/* Password Input */}
        {/* <View
          style={tw`flex-row items-center border border-red-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}
        >
          <FontAwesome name="lock" size={16} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-2 text-sm text-gray-900`}
            placeholder={
              usePassword
                ? "Enter your password"
                : "Temporary password will be sent to your email"
            }
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={usePassword}
            disabled={!usePassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            disabled={!usePassword}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={16}
              color={usePassword ? "#6B7280" : "#D1D5DB"}
            />
          </TouchableOpacity>
        </View> */}

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

        {/* Use Password Checkbox */}
        {/* <View style={tw`flex-row items-center mb-2`}>
          <TouchableOpacity
            onPress={() => setUsePassword(!usePassword)}
            style={tw`flex-row items-center mr-2`}
          >
            <View
              style={tw`w-4 h-4 border border-gray-400 rounded items-center justify-center`}
            >
              {usePassword && (
                <FontAwesome name="check" size={10} color="#EF4444" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={tw`text-sm text-gray-700`}>I have a password</Text>
        </View> */}
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
        {biometricCapable ? (
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-sm text-gray-700`}>
              Use Face/Touch ID next time
            </Text>
            <Switch
              value={useBiometrics}
              onValueChange={handleToggleBiometrics}
            />
          </View>
        ) : null}
        {/* Sign In Button */}
        <TouchableOpacity
          style={tw`bg-red-500 py-3 rounded-xl mb-6`}
          onPress={handleSignin}
          disabled={loading}
        >
          <Text style={tw`text-white text-center font-semibold`}>
            {loading ? "Signing in..." : "Sign in"}
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
          <TouchableOpacity
            style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white mb-3`}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/facebook-new.png",
              }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text style={tw`text-sm`}>Sign in with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-row items-center justify-center border rounded-xl py-3 bg-white`}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/mac-os.png",
              }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text style={tw`text-sm`}>Sign in with Apple</Text>
          </TouchableOpacity>
        </View>
        {/* Guest Sign-in: visually matches the primary sign-in button */}
        {/* <View style={tw`mt-2 mb-8`}>
          <TouchableOpacity
            onPress={handleGuestSignIn}
            style={tw`flex-row items-center justify-center bg-red-500 py-3 rounded-xl`}
          >
            <FontAwesome
              name="user"
              size={16}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={tw`text-white text-center font-semibold`}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Signin;
