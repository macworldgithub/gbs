import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { getUserData } from "../utils/storage";

const NOTICEBOARD_API = "https://gbs.westsidecarcare.com.au/noticeboard";

const NoticeboardList = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true); // start with true
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(null);
  const limit = 10;

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
          pinned: true,
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
        <Text style={tw`text-2xl font-bold text-gray-800`}>Pinned Notices</Text>
        <Text style={tw`text-gray-600 mt-1`}>
          Important announcements & updates
        </Text>
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

              <Text style={tw`text-gray-700 leading-7 mb-4 text-base`}>
                {item.content}
              </Text>

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
    </ScrollView>
  );
};

export default NoticeboardList;
