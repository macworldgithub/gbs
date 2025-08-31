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
  { code: "+1", name: "USA" },
  { code: "+92", name: "Pakistan" },
  { code: "+91", name: "India" },
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

  const [selectedCode, setSelectedCode] = useState("+92");
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setUserId(userData._id || "");
        setToken(userData.token || "");
        setFullName(userData.name || "");
        setPhoneNumber(userData.phone || "");
      }
    };
    loadUserData();
  }, []);

  const handleCountrySelect = (code) => {
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
    // If user wants to update password, check validations
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        Alert.alert("Error", "Please enter your current password.");
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "New password and confirm password do not match.");
        return;
      }
    }

    try {
      // Build request body only with updated fields
      const body = {};
      if (fullName) body.name = fullName;
      if (phoneNumber) body.phone = phoneNumber;
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.password = newPassword;
      }

      const res = await axios.patch(`${API_BASE_URL}/user/${userId}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Profile updated successfully!");

      // ✅ Merge new data with previously stored userData instead of overwriting
      const existingUserData = await getUserData();
      // const updatedUserData = {
      //   ...existingUserData,
      //   name: res.data.name || existingUserData.name,
      //   phone: res.data.phone || existingUserData.phone,
      //   email: res.data.email || existingUserData.email,
      //   // profilePic: res.data.profilePic || existingUserData.profilePic,
      // };
      const updatedUserData = {
        ...existingUserData,
        name: res.data.name || existingUserData.name,
        phone: res.data.phone || existingUserData.phone,
        email: res.data.email || existingUserData.email,
        profilePicKey: existingUserData.profilePicKey, // ✅ preserve key
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

      navigation.goBack();
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);

      const backendMessage =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";

      Alert.alert("Error", backendMessage);
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
            Edit Profile
          </Text>
        </View>

        {/* Input Fields */}
        {/* Input Fields */}
        <View style={tw`px-4 mt-6`}>
          {/* Full name */}
          <Text style={tw`text-sm text-gray-600 mb-1`}>Full name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            style={tw`border border-gray-300 px-4 py-2 rounded-lg mb-4 text-black`}
          />

          {/* Phone */}
          <Text style={tw`text-sm text-gray-600 mb-1`}>Phone number</Text>
          <View
            style={tw`flex-row items-center border border-gray-300 rounded-lg px-4 mb-4`}
          >
            <TouchableOpacity
              onPress={() => setCountryModalVisible(true)}
              style={tw`flex-row items-center`}
            >
              <FontAwesome5 name="flag" size={16} color="red" />
              <Text style={tw`ml-1 text-black`}>{selectedCode}</Text>
              <FontAwesome5
                name="chevron-down"
                size={12}
                color="gray"
                style={tw`ml-1`}
              />
            </TouchableOpacity>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="number-pad"
              placeholder="Enter your phone number"
              style={tw`ml-3 py-2 flex-1 text-black`}
            />
          </View>

          {/* Divider / Info for password */}
          <View style={tw`mt-6 mb-2`}>
            <Text style={tw`text-sm font-semibold text-gray-700`}>
              🔒 Password (optional)
            </Text>
            <Text style={tw`text-xs text-gray-500 mt-1`}>
              Only fill these fields if you want to change your password. Leave
              them blank to keep your current password.
            </Text>
          </View>

          {/* Current Password */}
          <Text style={tw`text-sm text-gray-600 mb-1`}>Current Password</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="Enter current password (only if changing)"
            style={tw`border border-gray-300 px-4 py-2 rounded-lg mb-4 text-black`}
          />

          {/* New Password */}
          <Text style={tw`text-sm text-gray-600 mb-1`}>New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Leave blank to keep the same password"
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
          onPressOut={() => setCountryModalVisible(false)}
        >
          <View style={tw`bg-white rounded-lg w-3/4 p-4`}>
            <Text style={tw`text-lg font-bold mb-2`}>Select Country Code</Text>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.code}
                onPress={() => handleCountrySelect(country.code)}
                style={tw`py-2`}
              >
                <Text>{`${country.name} (${country.code})`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default EditProfile;
