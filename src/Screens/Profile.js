import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import axios from "axios"
import { useEffect } from "react";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/config";

const menuItems = [
  {
    id: "1",
    label: "Edit Profile",
    icon: "user-edit",
    navigateTo: "EditProfile",
  },
  {
    id: "2",
    label: "Account Security",
    icon: "shield-alt",
    navigateTo: "AccountSecurity",
  },
  { id: "3", label: "Scan Member", icon: "qrcode", navigateTo: "QRCodeScreen" },
  {
    id: "4",
    label: "Payment Method",
    icon: "credit-card",
    navigateTo: "PaymentSettings",
  },
  {
    id: "5",
    label: "General Settings",
    icon: "cogs",
    navigateTo: "GeneralSetting",
  },
  { id: "6", label: "Help Centre", icon: "calendar-day", navigateTo: "Help" },
];

const requestCameraPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs camera access to take pictures", 
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};

const Profile = () => {
  const navigation = useNavigation();
  const [profilePicUri, setProfilePicUri] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserId(parsed._id || parsed.id);
      }
    };
    fetchUserId();
  }, []);

  const handleImagePick = () => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        { text: "Camera", onPress: () => openCamera() },
        { text: "Gallery", onPress: () => openGallery() },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }

    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && response.assets) {
        uploadImage(response.assets[0]);
      } else if (response.errorMessage) {
        Alert.alert("Camera Error", response.errorMessage);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && response.assets) {
        uploadImage(response.assets[0]);
      }
    });
  };
  const uploadImage = async (file) => {
    const fileName = file.fileName || "profile.jpg";
    const fileType = file.type || "image/jpeg";

    try {
      console.log("user id", userId);
      // STEP 1: Get S3 upload URL from backend
      const res = await axios.get(
        `${API_BASE_URL}/user/profile-picture/upload-url`,
      
        {
          params: {
            fileName,
            fileType,
            userId,
          },
        }
      );

      // ✅ Fix: Extract correct values from API response
      const { url: uploadUrl, key: fileKey } = res.data;
      console.log("GET API Response:", res.data);
      console.log("Upload URL:", uploadUrl);

      // STEP 2: Convert local image file to blob
      const fileData = await (await fetch(file.uri)).blob();

      // ✅ Fix: Use axios.put to upload to S3
      await axios.put(uploadUrl, fileData, {
        headers: {
          "Content-Type": fileType,
        },
      });

      console.log("PUT Upload Successful!");
      console.log("user id ", userId);

      // STEP 3: Notify backend after successful upload
      await axios.post(
        `${API_BASE_URL}/user/${userId}/profile-picture`,
        {
          fileUrl: uploadUrl.split("?")[0],
        }
      );

      setProfilePicUri(file.uri);
      Alert.alert("Success", "Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload image");
    }
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.navigateTo)}
      style={tw`px-4 mb-2`}
    >
      <View style={tw`flex-row items-center bg-white rounded-xl px-4 py-3`}>
        <FontAwesome5
          name={item.icon}
          size={18}
          color="red"
          style={tw`mr-4`}
          solid
        />
        <Text style={tw`text-base text-gray-800 flex-1`}>{item.label}</Text>
        <Text style={tw`text-lg text-gray-400`}>{">"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw`px-4 pt-6 flex-row justify-between items-center mt-6`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>Profile</Text>
        <TouchableOpacity style={tw`bg-red-100 px-3 py-1 rounded-full`}>
          <Text style={tw`text-red-500`}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Image with Pencil Icon */}
      <View style={tw`items-center mt-6 mb-4`}>
        <View style={{ position: "relative" }}>
          <Image
            source={
              profilePicUri
                ? { uri: profilePicUri }
                : require("../../assets/profile.png")
            }
            style={[tw`mb-2`, { width: 100, height: 100, borderRadius: 50 }]}
          />
          <TouchableOpacity
            onPress={handleImagePick}
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              backgroundColor: "#f87171",
              padding: 6,
              borderRadius: 20,
            }}
          >
            <FontAwesome5 name="pencil-alt" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={tw`text-lg font-bold text-gray-900 mt-1`}>
          Franklin Clinton
        </Text>
        <Text style={tw`text-sm text-gray-500`}>franklinclinton@gmail.com</Text>
      </View>

      {/* Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={tw`pb-10`}
      />

      {/* App Version */}
      <Text style={tw`text-center text-xs text-gray-400 mt-auto mb-4`}>
        App version 1.0.0.1
      </Text>
    </View>
  );
};

export default Profile;
