import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MembersDirectory({ navigation }) {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatStatus, setChatStatus] = useState({}); // store chat status by userId
  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [selectedState, setSelectedState] = useState("All");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Search users with API
  const searchUsers = async (query = "", state = "All") => {
    try {
      setLoading(true);
      
      let url = `${API_BASE_URL}/user/search?`;
      const params = new URLSearchParams();
      
      if (query.trim()) {
        params.append("query", query.trim());
      }
      
      if (state !== "All") {
        params.append("state", state);
      }
      
      // Add default pagination
      params.append("page", "1");
      params.append("limit", "50");
      
      url += params.toString();
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.users) {
        const formattedData = data.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user?.activatedPackage?.role?.label || "Member",
          image: user.avatarUrl
            ? { uri: user.avatarUrl }
            : require("../../assets/user.jpg"),
          liked: false,
          state: user.state,
        }));

        setMembers(formattedData);
      } else {
        console.error("❌ Error in search response:", data);
        setMembers([]);
      }
    } catch (error) {
      console.error("❌ Error searching users:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const handleSearch = (text) => {
    setSearch(text);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for search
    const timeout = setTimeout(() => {
      searchUsers(text, selectedState);
    }, 500); // 500ms delay
    
    setSearchTimeout(timeout);
  };

  // Handle state filter change
  const handleStateFilter = (state) => {
    setSelectedState(state);
    searchUsers(search, state);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setToken(parsed.token);
          setMyUserId(parsed._id);
        }
      } catch (e) {
        console.error("❌ Error loading userData:", e);
      }

      // Initial search to load all users
      searchUsers("", "All");
    };

    init();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // After token is set, try to prefetch conversation statuses
  useEffect(() => {
    const prefetchConversations = async () => {
      if (!token || !myUserId) return;
      
      try {
        const res = await fetch(`${API_BASE_URL}/messages/conversations?page=1&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data?.conversations) {
          const statusMap = {};
          data.conversations.forEach((conv) => {
            const other = (conv.participants || []).find((p) => p._id !== myUserId);
            if (other?._id) statusMap[other._id] = "continue";
          });
          setChatStatus(statusMap);
        }
      } catch (e) {
        console.error("❌ Error prefetching conversations:", e);
      }
    };

    prefetchConversations();
  }, [token, myUserId]);

  // ✅ Ensure conversation exists, then open Chat
  const openChat = async (user) => {
    try {
      if (!token) {
        console.warn("Missing token; navigating anyway");
        navigation.navigate("Chat", { user });
        return;
      }

      const res = await fetch(`${API_BASE_URL}/messages/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId: user.id }),
      });
      const conv = await res.json();
      if (!res.ok) {
        console.error("❌ startConversation error:", conv);
        navigation.navigate("Chat", { user });
        return;
      }

      setChatStatus((prev) => ({ ...prev, [user.id]: "continue" }));
      navigation.navigate("Chat", { user, conversationId: conv._id });
    } catch (err) {
      console.error("❌ Error starting conversation:", err);
      navigation.navigate("Chat", { user });
    }
  };

  // ✅ Toggle like/unlike
  const toggleLike = (id) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id ? { ...member, liked: !member.liked } : member
      )
    );
  };

  const openDetail = (user) => {
    navigation.navigate("DirectoryDetail", { id: user.id });
  };

  return (
    <View style={tw`flex-1 bg-white px-4 pt-4`}>
      <Text style={tw`text-sm text-black mb-4 mt-14 font-bold`}>
        Members Directory
      </Text>

      {/* 🔍 Search Bar */}
      <View
        style={tw`flex-row items-center border border-red-400 rounded-full px-4 py-2 mb-4 mt-6`}
      >
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search members by name or email..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={handleSearch}
          style={tw`ml-2 flex-1 text-sm text-black`}
        />
      </View>

      {/* State Filter Buttons */}
      <View style={tw`flex-row justify-between mb-4`}>
        {["All", "VIC", "NSW", "QLD", "SA"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={tw`px-4 py-2 rounded-lg border border-gray-300 ${
              selectedState === filter ? "bg-red-100 border-red-400" : "bg-gray-100"
            }`}
            onPress={() => handleStateFilter(filter)}
          >
            <Text
              style={tw`text-sm ${
                selectedState === filter ? "text-red-500" : "text-gray-600"
              }`}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ Members List */}
      {loading ? (
        <Text style={tw`text-center text-gray-500 mt-10`}>
          Searching members...
        </Text>
      ) : members.length === 0 ? (
        <Text style={tw`text-center text-gray-500 mt-10`}>
          No members found. Try adjusting your search or filters.
        </Text>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openDetail(item)}
              style={tw`flex-row items-center bg-gray-100 p-3 mb-3 rounded-xl`}
            >
              <Image
                source={item.image}
                style={tw`w-12 h-12 rounded-full`}
                resizeMode="cover"
              />

              <View style={tw`ml-3 flex-1`}>
                <Text style={tw`text-black font-semibold text-sm`}>
                  {item.name}
                </Text>
                <Text style={tw`text-red-500 text-sm`}>{item.email}</Text>
                <Text style={tw`text-gray-500 text-xs`}>
                  {item.role} • {item.state}
                </Text>
              </View>

              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                <Ionicons
                  name={item.liked ? "heart" : "heart-outline"}
                  size={20}
                  color={item.liked ? "#ed292e" : "#aaa"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`ml-3 bg-red-500 px-3 py-1 rounded-lg`}
                onPress={() => openChat(item)}
              >
                <Text style={tw`text-white text-xs`}>
                  {chatStatus[item.id] === "continue"
                    ? "Continue Chat"
                    : "Start Chat"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
