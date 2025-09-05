import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../src/utils/config";
import { getUserData } from "../src/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

// Dynamic menu: Chat Groups will be loaded from API
const staticItems = [
  { title: "My Business" },
  { title: "Saved offers" },
  { title: "Profile" },
  { title: "Conversation" },
  { title: "Upgrade Package" },
  { title: "Delete User Package" },
  { title: "Logout" },
];

export default function Drawer({ isOpen, onClose }) {
  const slideAnim = useState(new Animated.Value(-width))[0];
  const [expandedItems, setExpandedItems] = useState({});
  const navigation = useNavigation();
  const [roleLabel, setRoleLabel] = useState(null);
  const [userProfile, setUserProfile] = useState({ name: "", avatarUrl: null });
  console.log(userProfile, "drawer");
  const [groups, setGroups] = useState([]);

  const toggleExpand = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem("currentPackage");
        if (stored) {
          const pkg = JSON.parse(stored);
          setRoleLabel(pkg?.role?.label || null);
        } else {
          const ud = await getUserData();
          setRoleLabel(ud?.activatedPackage?.role?.label || null);
        }

        // Load user profile data with signed URL (same logic as Profile.js)
        const userData = await getUserData();
        if (userData) {
          let profilePicUri = null;

          // Check both avatarUrl and profilePicKey like in Profile.js
          const fileKey = userData.profilePicKey || userData.avatarUrl;

          if (fileKey && userData._id) {
            try {
              const res = await axios.get(
                `${API_BASE_URL}/user/${userData._id}/profile-picture`
              );
              if (res.data && res.data.url) {
                profilePicUri = res.data.url;
              }
            } catch (err) {
              console.error(
                "Error fetching signed profile picture in drawer:",
                err
              );
              // Fallback to direct avatarUrl if API fails
              profilePicUri = userData.avatarUrl;
            }
          }

          setUserProfile({
            name: userData.name || "",
            avatarUrl: profilePicUri,
          });
        }
      } catch (e) {
        setRoleLabel(null);
        setUserProfile({ name: "", avatarUrl: null });
      }
    };
    loadUserData();
  }, [isOpen]);

  // Instead of listing groups here, tapping "Chat Groups" will navigate to the groups screen

  // Delete user package function
  const deleteUserPackage = async () => {
    try {
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        Alert.alert("Error", "No token found, please login again.");
        return;
      }
      

      // Show confirmation dialog
      Alert.alert(
        "Delete Package",
        "Are you sure you want to delete your current package? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const response = await axios.delete(
                  `${API_BASE_URL}/user-package`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                console.log("Package deletion response:", response.data);

                // Update stored user data to remove the activated package
                const currentUserData = await getUserData();
                if (currentUserData) {
                  const updatedUserData = { ...currentUserData };
                  delete updatedUserData.activatedPackage;
                  await AsyncStorage.setItem(
                    "userData",
                    JSON.stringify(updatedUserData)
                  );
                }

                // Also clear persisted current package key
                await AsyncStorage.removeItem("currentPackage");
                console.log(
                  "[Drawer] Cleared currentPackage from storage after deletion"
                );

                Alert.alert(
                  "Success",
                  "Your package has been deleted successfully!"
                );

                // Close drawer after successful deletion
                onClose();
              } catch (error) {
                console.error(
                  "Error deleting package:",
                  error.response?.data || error.message
                );
                Alert.alert(
                  "Error",
                  "Failed to delete package. Please try again."
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in deleteUserPackage:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
    } catch (e) {}
    navigation.reset({ index: 0, routes: [{ name: "Signin" }] });
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const renderMenuItem = (item, level = 0) => {
    const isExpanded = expandedItems[item.title] || false;

    const handlePress = () => {
      if (item.title === "My Business") {
        onClose(); // close drawer
        navigation.navigate("MyBusiness");
      } else if (item.title === "Saved offers") {
        navigation.navigate("SavedOffers");
      } else if (item.title === "Profile") {
        onClose();
        navigation.navigate("Profile");
      } else if (item.title === "Conversation") {
        onClose();
        navigation.navigate("conversation");
      } else if (item.title === "Chat Groups") {
        onClose();
        navigation.navigate("GroupConversations");
      } else if (item.title === "Upgrade Package") {
        onClose();
        navigation.navigate("UpgradePackage");
      } else if (item.title === "Delete User Package") {
        deleteUserPackage();
      } else if (item.title === "Logout") {
        handleLogout();
      } else if (item.subItems) {
        toggleExpand(item.title);
      }
    };

    return (
      <View key={item.title}>
        <TouchableOpacity
          onPress={handlePress}
          style={[
            tw`flex-row items-center py-3`,
            {
              paddingLeft: level * 16,
              borderBottomWidth: 0.5,
              borderColor: "#fff3",
            },
          ]}
        >
          <Text
            style={[
              tw`text-black text-base flex-1`,
              {
                fontWeight: "500",
                color:
                  item.title === "Delete User Package" ||
                  item.title === "Logout"
                    ? "#DC2626"
                    : "black",
              },
            ]}
          >
            {item.title?.startsWith?.("GROUP::")
              ? item.title.replace("GROUP::", "")
              : item.title}
          </Text>
          {item.subItems && (
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color="black"
            />
          )}
        </TouchableOpacity>

        {isExpanded && item.subItems && (
          <View>
            {item.subItems.map((sub) => renderMenuItem(sub, level + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={[
            tw`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50`,
          ]}
          onPress={onClose}
          activeOpacity={1}
        />
      )}

      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          transform: [{ translateX: slideAnim }],
        }}
      >
        <View
          style={[
            tw`h-full`,
            {
              width: width * 0.75,
              backgroundColor: "#fdfdfdff",
              paddingTop: 60,
            },
          ]}
        >
          {/* User Profile Section */}
          <View style={tw`px-5 mb-4 flex-row items-center`}>
            <Image
              source={
                userProfile.avatarUrl
                  ? { uri: userProfile.avatarUrl }
                  : require("../assets/user.jpg")
              }
              style={tw`w-12 h-12 rounded-full mr-3`}
            />
            <View>
              <Text style={tw`text-black text-lg font-bold`}>
                {userProfile.name || "Guest User"}
              </Text>
              {roleLabel && (
                <Text style={tw`text-xs text-gray-500 w-44`}>{roleLabel}</Text>
              )}
            </View>
          </View>

          <Text style={[tw`text-black text-xl font-bold px-5 mb-4 ml-4`]}>
            Menu
          </Text>

          {/* Scrollable Menu Items */}
          <ScrollView
            style={tw`flex-1 px-3 ml-4`}
            showsVerticalScrollIndicator={false}
          >
            {[{ title: "Chat Groups" }, ...staticItems].map((menu) =>
              renderMenuItem(menu)
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </>
  );
}
