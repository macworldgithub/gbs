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
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import * as Device from "expo-device";
// import { FontAwesome, Feather } from "@expo/vector-icons";
// import tw from "tailwind-react-native-classnames";
// import { useNavigation } from "@react-navigation/native";
// // import { Image } from "react-native-svg";
// import axios from "axios";
// import { API_BASE_URL } from "../utils/config";
// import Toast from "react-native-toast-message";
// import { storeUserData } from "../utils/storage";
// import { Switch } from "react-native";
// import {
//   isBiometricAvailable,
//   setSession,
//   setBiometricsEnabled,
//   getBiometricsEnabled,
//   clearSession,
// } from "../utils/secureAuth";

// const Signin = () => {
//   const navigation = useNavigation();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
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
//     } catch (e) {}
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
//       } catch (e) {}

//       try {
//         const previouslyEnabled = await getBiometricsEnabled();
//         setUseBiometrics(!!previouslyEnabled);
//       } catch (e) {}
//     })();
//   }, []);

//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSignin = async () => {
//     const trimmedEmail = email.trim();

//     if (!trimmedEmail || !password) {
//       Alert.alert("Missing Fields", "Please enter both email and password.");
//       return;
//     }

//     if (!isValidEmail(trimmedEmail)) {
//       Alert.alert("Invalid Email", "Please enter a valid email address.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Get device info
//       const deviceId =
//         Device.osInternalBuildId || Device.modelId || "unknown-device-id";
//       const platform = Platform.OS;
//       const deviceName = Device.deviceName || "Unknown Device";

//       const payload = {
//         email: trimmedEmail,
//         password,
//         deviceId,
//       };

//       // Log for debug
//       console.log("📦 Payload for /pre-login API:");
//       console.log("Email:", trimmedEmail);
//       console.log("Password:", password);
//       console.log("Device ID:", deviceId);
//       console.log("Device Name:", deviceName);
//       console.log("Platform:", platform);
//       console.log("Payload:", JSON.stringify(payload));

//       const res = await axios.post(
//         `${API_BASE_URL}/user/auth/pre-login`,
//         payload
//       );

//       console.log("✅ Response Status:", res.status);
//       console.log("✅ Response Data:", res.data);

//       const { message, otpRequired } = res.data || {};

//       if (!message || otpRequired === undefined) {
//         Alert.alert("Unexpected Response", "Server response is incomplete.");
//         return;
//       }

//       Alert.alert("Success", message);

//       if (otpRequired) {
//         navigation.navigate("OTPVerification", {
//           email: trimmedEmail,
//           deviceId,
//           platform,
//           deviceName,
//         });
//       } else {
//         // Trusted device: skip OTP, call /signin
//         try {
//           const signinRes = await axios.post(
//             `${API_BASE_URL}/user/auth/signin`,
//             { email: trimmedEmail, password }
//           );
//           const userData = {
//             token: signinRes.data.token,
//             ...signinRes.data.user,
//           };
//           // Store token & user data in AsyncStorage (same as OTPVerification)
//           await storeUserData(userData);

//           if (useBiometrics && biometricCapable && signinRes.data?.token) {
//             await setSession(userData, { requireBiometrics: true });
//             await setBiometricsEnabled(true);
//           }

//           // ✅ Debug: check if stored properly
//           const stored = await AsyncStorage.getItem("userData");
//           console.log("🔐 Stored User Data in AsyncStorage:", stored);
//           Alert.alert("Success", "Login successful!");
//           navigation.replace("Tabs"); // or your main screen
//         } catch (signinErr) {
//           console.error(
//             "❌ Error during trusted signin:",
//             signinErr.response?.data || signinErr.message
//           );
//           Alert.alert(
//             "Login Error",
//             signinErr.response?.data?.message || "Could not complete login."
//           );
//         }
//       }
//     } catch (err) {
//       console.log(
//         "❌ Error during sign-in:",
//         err.response?.data || err.message
//       );

//       const status = err.response?.status;
//       const errorMsg =
//         err.response?.data?.message ||
//         "Something went wrong. Please try again.";

//       if (status === 401) {
//         Alert.alert("Invalid Credentials", errorMsg);
//       } else {
//         Alert.alert("Login Error", errorMsg);
//       }
//     } finally {
//       setLoading(false);
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

//         {/* Email Input */}
//         <View
//           style={tw`flex-row items-center border border-red-300 rounded-lg px-3 py-1 mb-4 bg-gray-100`}
//         >
//           <FontAwesome name="envelope" size={16} color="#6B7280" />
//           <TextInput
//             style={tw`flex-1 ml-2 text-sm text-gray-900`}
//             placeholder="Enter your email"
//             placeholderTextColor="#9CA3AF"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
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
//             placeholder="Enter your password"
//             placeholderTextColor="#9CA3AF"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//           />
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//             <Feather
//               name={showPassword ? "eye-off" : "eye"}
//               size={16}
//               color="#6B7280"
//             />
//           </TouchableOpacity>
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
import { FontAwesome, Feather } from "@expo/vector-icons";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [biometricCapable, setBiometricCapable] = useState(false);

  const handleToggleBiometrics = async (val) => {
    try {
      setUseBiometrics(val);
      await setBiometricsEnabled(!!val);
      if (!val) {
        // Remove any existing biometric-protected session so the app won't prompt on next launch
        await clearSession();
      }
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
          biometryType
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

  const handleSignin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Get device info
      const deviceId =
        Device.osInternalBuildId || Device.modelId || "unknown-device-id";
      const platform = Platform.OS;
      const deviceName = Device.deviceName || "Unknown Device";

      const payload = {
        email: trimmedEmail,
        password,
        deviceId,
      };

      // Log for debug
      console.log("📦 Payload for /pre-login API:");
      console.log("Email:", trimmedEmail);
      console.log("Password:", password);
      console.log("Device ID:", deviceId);
      console.log("Device Name:", deviceName);
      console.log("Platform:", platform);
      console.log("Payload:", JSON.stringify(payload));

      const res = await axios.post(
        `${API_BASE_URL}/user/auth/pre-login`,
        payload
      );

      console.log("✅ Response Status:", res.status);
      console.log("✅ Response Data:", res.data);

      const { message, otpRequired } = res.data || {};

      if (!message || otpRequired === undefined) {
        Alert.alert("Unexpected Response", "Server response is incomplete.");
        return;
      }

      Alert.alert("Success", message);

      if (otpRequired) {
        navigation.navigate("OTPVerification", {
          email: trimmedEmail,
          deviceId,
          platform,
          deviceName,
        });
      } else {
        // Trusted device: skip OTP, call /signin
        try {
          const signinRes = await axios.post(
            `${API_BASE_URL}/user/auth/signin`,
            { email: trimmedEmail, password }
          );
          const userData = {
            token: signinRes.data.token,
            ...signinRes.data.user,
          };
          // Store token & user data in AsyncStorage (same as OTPVerification)
          await storeUserData(userData);

          if (useBiometrics && biometricCapable && signinRes.data?.token) {
            await setSession(userData, { requireBiometrics: true });
            await setBiometricsEnabled(true);
          }

          // ✅ Debug: check if stored properly
          const stored = await AsyncStorage.getItem("userData");
          console.log("🔐 Stored User Data in AsyncStorage:", stored);
          Alert.alert("Success", "Login successful!");
          navigation.replace("Tabs"); // or your main screen
        } catch (signinErr) {
          console.error(
            "❌ Error during trusted signin:",
            signinErr.response?.data || signinErr.message
          );
          Alert.alert(
            "Login Error",
            signinErr.response?.data?.message || "Could not complete login."
          );
        }
      }
    } catch (err) {
      console.log(
        "❌ Error during sign-in:",
        err.response?.data || err.message
      );

      const status = err.response?.status;
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      if (status === 401) {
        Alert.alert("Invalid Credentials", errorMsg);
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
          expiry
        ).toLocaleString()}.`
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