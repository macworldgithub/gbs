import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, Animated, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../src/utils/config";
import { getUserData } from "../src/utils/storage";

const { width } = Dimensions.get("window");

// Sidebar menu items
const menuItems = [
  {
    title: "Chat Groups",
    subItems: [
      { title: "Announcements " },
      { title: "Business" },
      {
        title: "Social",
        subItems: [
          { title: "General" },
          { title: "Horse Tipping" },
          { title: "Competitions" },
          { title: "Golf" },
          { title: "Wine Club" },
        ],
      },
    ],
  },
  { title: "My Business" },
  { title: "Saved offers" },
  { title: "Delete User Package" }
];

export default function Drawer({ isOpen, onClose }) {
  const slideAnim = useState(new Animated.Value(-width))[0];
  const [expandedItems, setExpandedItems] = useState({});
  const navigation = useNavigation();

  const toggleExpand = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

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
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const response = await axios.delete(`${API_BASE_URL}/user-package`, {
                  headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                });

                console.log("Package deletion response:", response.data);
                Alert.alert("Success", "Your package has been deleted successfully!");
                
                // Close drawer after successful deletion
                onClose();
                
                // Navigate to Business tab to refresh the page
                navigation.navigate("Business");
                
              } catch (error) {
                console.error("Error deleting package:", error.response?.data || error.message);
                Alert.alert("Error", "Failed to delete package. Please try again.");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error in deleteUserPackage:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
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
      } else if (item.title === "Delete User Package") {
        deleteUserPackage();
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
            { paddingLeft: level * 16, borderBottomWidth: 0.5, borderColor: "#fff3" },
          ]}
        >
          <Text style={[
            tw`text-black text-base flex-1`, 
            { 
              fontWeight: "500",
              color: item.title === "Delete User Package" ? "#DC2626" : "black"
            }
          ]}>
            {item.title}
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
          <View>{item.subItems.map((sub) => renderMenuItem(sub, level + 1))}</View>
        )}
      </View>
    );
  };

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={[tw`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50`]}
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
            { width: width * 0.75, backgroundColor: "#fdfdfdff", paddingTop: 60, paddingLeft: 15 },
          ]}
        >
          <Text style={[tw`text-black text-xl font-bold px-5 mb-4`]}>Menu</Text>
          {menuItems.map((menu) => renderMenuItem(menu))}
        </View>
      </Animated.View>
    </>
  );
}
