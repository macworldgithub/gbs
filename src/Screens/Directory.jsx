import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import { getUserData } from "../utils/storage";

const LIMIT = 20;

export default function MembersDirectory({ navigation }) {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const [chatStatus, setChatStatus] = useState({});
  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);

  const [selectedState, setSelectedState] = useState("All");
  const [searchTimeout, setSearchTimeout] = useState(null);

  /* ---------------- SEARCH USERS ---------------- */
  const searchUsers = async (query = "", state = "All", pageNumber = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (query.trim()) params.append("query", query.trim());
      if (state !== "All") params.append("state", state);

      params.append("page", pageNumber.toString());
      params.append("limit", LIMIT.toString());

      const url = `${API_BASE_URL}/user/search?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && data?.users) {
        const formatted = data.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user?.activatedPackage?.role?.label || "Member",
          businessName: user.businessName || user?.business?.name || null,
          businessCategory: user.category || user?.business?.category || null,
          avatarUrl: user.avatarUrl,
          image: user.avatarUrl
            ? { uri: user.avatarUrl }
            : require("../../assets/user.jpg"),
          state: user.state,
        }));

        setMembers(formatted);
        setHasNext(formatted.length === LIMIT);
        setPage(pageNumber);
      } else {
        setMembers([]);
        setHasNext(false);
      }
    } catch (e) {
      console.error("❌ Search error:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEARCH (DEBOUNCE) ---------------- */
  const handleSearch = (text) => {
    setSearch(text);
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      searchUsers(text, selectedState, 1);
    }, 500);

    setSearchTimeout(timeout);
  };

  /* ---------------- STATE FILTER ---------------- */
  const handleStateFilter = (state) => {
    setSelectedState(state);
    searchUsers(search, state, 1);
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const init = async () => {
      const user = await getUserData();
      if (user) {
        setToken(user.token);
        setMyUserId(user._id || user?.user?._id);
      }
      searchUsers("", "All", 1);
    };
    init();
  }, []);

  /* ---------------- PREFETCH CHAT STATUS ---------------- */
  useEffect(() => {
    if (!token || !myUserId) return;

    const fetchChats = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/messages/conversations?page=1&limit=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (res.ok && data?.conversations) {
          const map = {};
          data.conversations.forEach((c) => {
            const other = c.participants?.find((p) => p._id !== myUserId);
            if (other?._id) map[other._id] = "continue";
          });
          setChatStatus(map);
        }
      } catch (e) {
        console.error("❌ Prefetch chat error:", e);
      }
    };

    fetchChats();
  }, [token, myUserId]);

  /* ---------------- CHAT ---------------- */
  const openChat = async (user) => {
    if (!token) {
      Alert.alert("Login Required", "Please login first");
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

    navigation.navigate("Chat", {
      conversationId: conv?._id,
      user: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <View style={tw`flex-1 bg-white px-4 pt-4`}>
      <ScrollView>
        {/* HEADER */}
        <View style={tw`flex-row mt-14 border-b border-gray-200`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={tw`text-lg text-black mb-4 pl-4 font-extrabold`}>
            Members Directory
          </Text>
        </View>

        {/* CREATE GROUP */}
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateGroup")}
          style={tw`self-stretch bg-red-500 rounded-xl py-3 items-center mb-3`}
        >
          <Text style={tw`text-white font-semibold`}>Create Group Chat</Text>
        </TouchableOpacity>

        {/* SEARCH */}
        <View
          style={tw`flex-row items-center border border-red-400 rounded-full px-4 py-2 mb-4 mt-6`}
        >
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Search members by name or email..."
            placeholderTextColor="#000000"
            value={search}
            onChangeText={handleSearch}
            style={tw`ml-2 flex-1 text-sm text-black`}
          />
        </View>

        {/* STATE FILTER */}
        <View style={tw`flex-row justify-between mb-4`}>
          {["All", "VIC", "NSW", "QLD", "SA"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => handleStateFilter(filter)}
              style={tw`px-4 py-2 rounded-lg border border-gray-300 ${
                selectedState === filter
                  ? "bg-red-100 border-red-400"
                  : "bg-gray-100"
              }`}
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

        {/* LIST */}
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DirectoryDetail", { id: item.id })
              }
              style={tw`flex-row items-center bg-gray-100 p-3 mb-3 rounded-xl`}
            >
              <Image source={item.image} style={tw`w-12 h-12 rounded-full`} />

              <View style={tw`ml-3 flex-1`}>
                <View style={tw`flex-row justify-between`}>
                  <Text numberOfLines={1} style={tw`font-semibold text-sm`}>
                    {item.name}
                  </Text>

                  <TouchableOpacity
                    onPress={() => openChat(item)}
                    style={tw`bg-red-500 px-3 py-1 rounded-lg`}
                  >
                    <Text style={tw`text-white text-xs`}>
                      {chatStatus[item.id] === "continue"
                        ? "Continue Chat"
                        : "Start Chat"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={tw`text-red-500 text-sm`}>{item.email}</Text>

                <Text style={tw`text-black text-xs`}>{item.role}</Text>

                {item.businessName && (
                  <Text style={tw`text-black text-xs mt-1`}>
                    BusinessName: {item.businessName}
                  </Text>
                )}

                {item.businessCategory && (
                  <Text style={tw`text-black text-xs mt-1`}>
                    Category: {item.businessCategory}
                  </Text>
                )}

                <Text style={tw`text-gray-500 text-xs mt-1`}>
                  State:{" "}
                  <Text style={tw`text-red-500`}>{item.state || "N/A"}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* PAGINATION */}
        <View style={tw`flex-row justify-between items-center py-3`}>
          <TouchableOpacity
            disabled={page === 1}
            onPress={() =>
              page > 1 && searchUsers(search, selectedState, page - 1)
            }
          >
            <Text
              style={tw`text-sm ${page === 1 ? "text-gray-300" : "text-red-500"}`}
            >
              ◀ Previous
            </Text>
          </TouchableOpacity>

          <Text style={tw`text-sm font-semibold`}>Page {page}</Text>

          <TouchableOpacity
            disabled={!hasNext}
            onPress={() =>
              hasNext && searchUsers(search, selectedState, page + 1)
            }
          >
            <Text
              style={tw`text-sm ${hasNext ? "text-red-500" : "text-gray-300"}`}
            >
              Next ▶
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
