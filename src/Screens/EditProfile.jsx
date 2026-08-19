import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { getUserData } from "../utils/storage";
import { API_BASE_URL } from "../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const countries = [
  { code: "+61", name: "Australia (+61)", type: "international" },
  { code: "04", name: "Australia (Local 04)", type: "local" },
];

const EditProfile = () => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedCode, setSelectedCode] = useState("+61");
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setUserId(userData._id || "");
        setToken(userData.token || "");
        setFullName(userData.name || "");
        if (userData.phone) {
          const international = userData.phone;

          // Convert +61412345678 → 0412345678
          const clean = international.replace("+61", "");

          setSelectedCode("+61");
          setPhoneNumber(clean);

          setPhoneNumber(local);
        }
      }
    };
    loadUserData();
  }, []);

  const handleCountrySelect = (code) => {
    // clear number when switching format
    setPhoneNumber("");

    setSelectedCode(code);
    setCountryModalVisible(false);
  };

  // const handleSaveChanges = async () => {
  //   // If user wants to update password, check validations
  //   if (newPassword || confirmPassword) {
  //     if (!currentPassword) {
  //       Alert.alert("Error", "Please enter your current password.");
  //       return;
  //     }

  //     if (newPassword !== confirmPassword) {
  //       Alert.alert("Error", "New password and confirm password do not match.");
  //       return;
  //     }
  //   }

  //   try {
  //     const body = {
  //       name: fullName,
  //       phone: phoneNumber,
  //       ...(newPassword
  //         ? { currentPassword, password: newPassword } // ✅ send password update only if new password exists
  //         : {}), // ✅ otherwise don’t send any password fields
  //     };

  //     const res = await axios.patch(`${API_BASE_URL}/user/${userId}`, body, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     Alert.alert("Success", "Profile updated successfully!");
  //     // ✅ Save updated user info locally so Profile screen sees it immediately
  //     const updatedUserData = {
  //       _id: userId,
  //       token,
  //       name: body.name,
  //       phone: body.phone,
  //       email: res.data.email || undefined, // in case email is editable
  //     };

  //     await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

  //     navigation.goBack();
  //   } catch (error) {
  //     console.error("Update failed:", error.response?.data || error.message);

  //     const backendMessage =
  //       error.response?.data?.message ||
  //       "Failed to update profile. Please try again.";

  //     Alert.alert("Error", backendMessage);
  //   }
  // };
  const handleSaveChanges = async () => {
    if (!currentPassword) {
      Alert.alert("Error", "Enter current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const body = {
        currentPassword,
        password: newPassword,
      };

      await axios.patch(`${API_BASE_URL}/user/${userId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Password updated");

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Update failed");
    }
  };

  return (
    <View style={tw`flex-1 bg-white pt-10`}>
      <ScrollView contentContainerStyle={tw`pb-20`}>
        {/* Header */}
        <View style={tw`px-4 pt-6 flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={16} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-semibold text-black ml-4`}>
            Change Password
          </Text>
        </View>

        {/* Input Fields */}
        {/* Input Fields */}
        <View style={tw`px-4 mt-6`}>
          <Text style={tw`text-sm font-semibold text-gray-700 mb-3`}>
            🔒 Change Password
          </Text>

          {/* Current Password */}
          <Text style={tw`text-sm text-gray-600 mb-1`}>Current Password</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="Enter current password"
            style={tw`border border-gray-300 px-4 py-2 rounded-lg mb-4 text-black`}
          />

          {/* New Password */}
          <Text style={tw`text-sm text-gray-600 mb-1`}>New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Enter new password"
            style={tw`border border-gray-300 px-4 py-2 rounded-lg mb-4 text-black`}
          />

          {/* Confirm Password */}
          <Text style={tw`text-sm text-gray-600 mb-1`}>Confirm Password</Text>

          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Re-enter new password"
            style={tw`border border-gray-300 px-4 py-2 rounded-lg mb-4 text-black`}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={tw`px-4 pb-4 absolute bottom-0 left-0 right-0`}>
        <TouchableOpacity
          style={tw`bg-red-500 py-3 rounded-full`}
          onPress={handleSaveChanges}
        >
          <Text style={tw`text-center text-white font-semibold`}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Country Picker Modal */}
      <Modal visible={countryModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={tw`flex-1 bg-black bg-opacity-40 justify-center items-center`}
          activeOpacity={1}
          onPress={() => setCountryModalVisible(false)}
        >
          <View style={tw`bg-white rounded-lg w-3/4 p-4`}>
            <Text style={tw`text-lg font-bold mb-3 text-black`}>
              Select Number Format
            </Text>

            {countries.map((country) => (
              <TouchableOpacity
                key={country.code}
                onPress={() => handleCountrySelect(country.code)}
                style={tw`py-3 border-b border-gray-200`}
              >
                <Text style={tw`text-black`}>{country.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default EditProfile;
