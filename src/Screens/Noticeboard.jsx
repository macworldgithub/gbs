import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getUserData } from "../../src/utils/storage";

const NOTICEBOARD_API = "https://gbs.westsidecarcare.com.au/noticeboard";

const NoticeboardTab = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const [expiryDate, setExpiryDate] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const submitNotice = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      const userData = await getUserData();
      const token = userData?.token;

      await axios.post(
        NOTICEBOARD_API,
        {
          title,
          content,
          isPinned,
          expiresAt: expiryDate ? expiryDate.toISOString() : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      Alert.alert("Success", "Noticeboard post created successfully!");

      setTitle("");
      setContent("");
      setIsPinned(false);
      setExpiryDate(null);
      setTempDate(new Date());
      setShowPicker(false);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create noticeboard post."
      );
    }
  };

  return (
    <View style={tw`mt-4`}>
      <View style={tw`bg-red-50 border border-red-200 rounded-lg p-4 mb-5`}>
        <Text style={tw` font-bold mb-1`}>📢 Noticeboard Purpose</Text>
        <Text style={tw`text-sm leading-5`}>
          This noticeboard is used to share important announcements, updates,
          and official information with members. Please post only relevant and
          clear messages such as event updates, policy changes, reminders, or
          urgent notices. Avoid personal or informal content.
        </Text>
      </View>
      <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
        Create Noticeboard Announcement
      </Text>

      {/* Title */}
      <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Title</Text>
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Content */}
      <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Content</Text>
      <TextInput
        multiline
        numberOfLines={5}
        style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
        placeholder="Write announcement content..."
        value={content}
        onChangeText={setContent}
      />

      {/* Pin Toggle */}
      <TouchableOpacity
        onPress={() => setIsPinned(!isPinned)}
        style={tw`flex-row items-center mb-4`}
      >
        <View
          style={tw`w-5 h-5 mr-2 rounded border ${
            isPinned ? "bg-red-500 border-red-500" : "border-gray-400"
          }`}
        />
        <Text style={tw`text-gray-700`}>Pin this announcement</Text>
      </TouchableOpacity>

      {/* Expiry Date */}
      <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>
        Expiry Date
      </Text>

      <TouchableOpacity
        onPress={() => {
          setTempDate(expiryDate || new Date());
          setShowPicker(true);
        }}
        style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
      >
        <Text style={tw`text-gray-700`}>
          {expiryDate ? expiryDate.toDateString() : "Select expiry date"}
        </Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) {
              setExpiryDate(date);
            }
          }}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={tw`bg-red-500 py-3 rounded-lg`}
        onPress={submitNotice}
      >
        <Text style={tw`text-center text-white font-bold`}>
          Submit Announcement
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoticeboardTab;
