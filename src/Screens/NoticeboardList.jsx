import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getUserData } from "../utils/storage";

const NOTICEBOARD_API = "https://gbs.westsidecarcare.com.au/noticeboard";

// Helper function to parse text and render clickable links
const renderTextWithLinks = (text) => {
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  const regex = new RegExp(urlPattern);

  while ((match = regex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.substring(lastIndex, match.index),
      });
    }

    // Add the URL
    let url = match[0];
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    parts.push({
      type: "url",
      content: match[0],
      href: url,
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.substring(lastIndex),
    });
  }

  return (
    <Text style={tw`text-gray-700 leading-7 mb-4 text-base`}>
      {parts.map((part, idx) =>
        part.type === "url" ? (
          <Text
            key={idx}
            style={tw`text-blue-600 underline`}
            onPress={() => {
              Linking.openURL(part.href).catch((err) =>
                Alert.alert("Error", "Failed to open link"),
              );
            }}
          >
            {part.content}
          </Text>
        ) : (
          <Text key={idx}>{part.content}</Text>
        ),
      )}
    </Text>
  );
};

const NoticeboardList = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(null);
  const limit = 10;

  // Create notice modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get current user once
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserData();
        setCurrentUserId(userData?._id || null);
      } catch (e) {
        console.log("User load error:", e);
      }
    };
    loadUser();
  }, []);

  const fetchNotices = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.get(NOTICEBOARD_API, {
        params: {
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = response.data;

      // Important: Adjust these lines according to your actual API response structure
      const fetchedNotices = data?.notices || data?.data || data || [];
      const pages = data?.totalPages || data?.pages || 1;

      setNotices(fetchedNotices);
      setTotalPages(pages);
      setCurrentPage(page);
    } catch (err) {
      console.log("Fetch notices error:", err?.response?.data || err);
      setError("Failed to load notices. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotices(1);
  }, [fetchNotices]);

  const submitNotice = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);
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
        },
      );

      Alert.alert("Success", "Notice created successfully!");

      // Reset form
      setTitle("");
      setContent("");
      setIsPinned(false);
      setExpiryDate(null);
      setTempDate(new Date());
      setModalVisible(false);

      // Refresh notices
      fetchNotices(1);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create notice.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noticeId) => {
    Alert.alert("Delete Notice", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const userData = await getUserData();
            const token = userData?.token;

            await axios.delete(`${NOTICEBOARD_API}/${noticeId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            // Refresh current page
            fetchNotices(currentPage);
          } catch (err) {
            Alert.alert("Error", "Could not delete notice");
          }
        },
      },
    ]);
  };

  const canDelete = (notice) => notice.creator?._id === currentUserId;

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <View
        style={tw`flex-row justify-center items-center py-5 bg-white mt-4 mx-4 rounded-xl border border-gray-200`}
      >
        <TouchableOpacity
          disabled={currentPage === 1 || loading}
          onPress={() => fetchNotices(currentPage - 1)}
          style={tw`px-4 py-2 ${currentPage === 1 ? "opacity-40" : ""}`}
        >
          <Text style={tw`text-gray-700 font-medium`}>← Previous</Text>
        </TouchableOpacity>

        <View style={tw`mx-6 px-4 py-2 bg-gray-100 rounded-lg`}>
          <Text style={tw`text-gray-800 font-semibold`}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>

        <TouchableOpacity
          disabled={currentPage === totalPages || loading}
          onPress={() => fetchNotices(currentPage + 1)}
          style={tw`px-4 py-2 ${currentPage === totalPages ? "opacity-40" : ""}`}
        >
          <Text style={tw`text-gray-700 font-medium`}>Next →</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`px-5 pt-6 pb-4 bg-white border-b border-gray-200`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-2xl font-bold text-gray-800`}>
              All Notices
            </Text>
            <Text style={tw`text-gray-600 mt-1`}>
              All announcements & updates
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={tw`bg-red-500 px-2 py-2 rounded-lg`}
          >
            <Text style={tw`text-white font-bold`}>+ Create Notice</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={tw`flex-1 justify-center items-center py-40`}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={tw`mt-4 text-gray-600`}>Loading notices...</Text>
        </View>
      ) : error ? (
        <View style={tw`flex-1 justify-center items-center py-40 px-6`}>
          <Text style={tw`text-red-600 text-center text-lg`}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchNotices(currentPage)}
            style={tw`mt-6 bg-red-500 px-8 py-3 rounded-lg`}
          >
            <Text style={tw`text-white font-medium`}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : notices.length === 0 ? (
        <View style={tw`items-center py-20 px-6`}>
          <Ionicons
            name="information-circle-outline"
            size={64}
            color="#9ca3af"
          />
          <Text style={tw`text-gray-600 text-xl font-medium mt-6 text-center`}>
            No pinned notices available
          </Text>
        </View>
      ) : (
        <View style={tw`px-4 pt-4 pb-6`}>
          {notices.map((item) => (
            <View
              key={item._id}
              style={tw`bg-white rounded-2xl p-5 mb-5 shadow-sm border border-gray-100`}
            >
              <View style={tw`flex-row justify-between items-start mb-3`}>
                <Text style={tw`text-xl font-bold text-gray-900 flex-1 pr-3`}>
                  {item.title}
                </Text>

                {canDelete(item) && (
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Ionicons name="trash-outline" size={24} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>

              {renderTextWithLinks(item.content)}

              <View
                style={tw`flex-row justify-between border-t border-gray-100 pt-3`}
              >
                <View>
                  <Text style={tw`text-xs text-gray-500`}>Posted by</Text>
                  <Text style={tw`text-sm font-medium text-gray-700`}>
                    {item.creator?.name || "Admin"}
                  </Text>
                </View>

                <View style={tw`items-end`}>
                  <Text style={tw`text-xs text-gray-500`}>Expires</Text>
                  <Text style={tw`text-sm font-medium text-gray-700`}>
                    {item.expiresAt
                      ? new Date(item.expiresAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "No expiry"}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <PaginationControls />
        </View>
      )}

      {/* Create Notice Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={tw`flex-1 bg-gray-50 mt-32`}>
          {/* Modal Header */}
          <View
            style={tw`px-5 pt-6 pb-4 bg-white border-b border-gray-200 flex-row justify-between items-center`}
          >
            <Text style={tw`text-xl font-bold text-gray-800`}>
              Create Notice
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={tw`px-5 py-4`}>
            {/* Title */}
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>
              Title
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 mb-3`}
              placeholder="Enter title"
              placeholderTextColor="black"
              value={title}
              onChangeText={setTitle}
            />

            {/* Content */}
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>
              Content
            </Text>
            <TextInput
              multiline
              numberOfLines={5}
              style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-700`}
              placeholder="Write announcement content..."
              placeholderTextColor="black"
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

            {/* Date Picker Modal */}
            <Modal transparent animationType="slide" visible={showPicker}>
              <View style={tw`flex-1 justify-end bg-black bg-opacity-40`}>
                <View style={tw`bg-white rounded-t-2xl p-4`}>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === "android") {
                        if (event.type === "set") {
                          const currentDate = selectedDate || tempDate;
                          setTempDate(currentDate);
                          setExpiryDate(currentDate);
                        }
                        setShowPicker(false);
                      } else {
                        if (selectedDate) setTempDate(selectedDate);
                      }
                    }}
                  />

                  <View style={tw`flex-row justify-end mt-4`}>
                    <TouchableOpacity
                      onPress={() => setShowPicker(false)}
                      style={tw`px-4 py-2 mr-2`}
                    >
                      <Text style={tw`text-gray-600 font-medium`}>Cancel</Text>
                    </TouchableOpacity>

                    {Platform.OS === "ios" && (
                      <TouchableOpacity
                        onPress={() => {
                          setExpiryDate(tempDate);
                          setShowPicker(false);
                        }}
                        style={tw`px-4 py-2`}
                      >
                        <Text style={tw`text-red-500 font-bold`}>Done</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </Modal>

            {/* Submit Button */}
            <TouchableOpacity
              style={tw`bg-red-500 py-3 rounded-lg ${submitting ? "opacity-50" : ""}`}
              onPress={submitNotice}
              disabled={submitting}
            >
              <Text style={tw`text-center text-white font-bold`}>
                {submitting ? "Submitting..." : "Submit Notice"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default NoticeboardList;
