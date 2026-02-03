import React, { useEffect, useState, useRef } from "react";
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
  // Ref for ScrollView to enable auto-scroll to top on page change
  const scrollViewRef = useRef(null);

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const [chatStatus, setChatStatus] = useState({});
  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);

  // Track if access is blocked for guests / unauthenticated users
  const [guestRestricted, setGuestRestricted] = useState(false);

  const [selectedState, setSelectedState] = useState("All");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [paginationLoading, setPaginationLoading] = useState(false);

  /* ---------------- SEARCH USERS ---------------- */
  const searchUsers = async (
    query = "",
    state = "All",
    pageNumber = 1,
    isPagination = false,
    scrollToTop = false,
  ) => {
    try {
      isPagination ? setPaginationLoading(true) : setLoading(true);
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
        // Auto-scroll to top if requested (pagination)
        if (scrollToTop && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
      } else {
        setMembers([]);
        setHasNext(false);
      }
    } catch (e) {
      console.error("❌ Search error:", e);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  /* ---------------- SEARCH (DEBOUNCE) ---------------- */
  const handleSearch = (text) => {
    setSearch(text);
    if (searchTimeout) clearTimeout(searchTimeout);

    setMembers([]);
    setLoading(true);
    setPage(1);
    setHasNext(false);

    const timeout = setTimeout(() => {
      searchUsers(text, selectedState, 1, false, true);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleStateFilter = (state) => {
    setSelectedState(state);
    setMembers([]);
    setLoading(true);
    setPage(1);
    setHasNext(false);
    console.log("Filtering by state:", state);

    searchUsers(search, state, 1, false, true);
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const init = async () => {
      const user = await getUserData();

      const rawToken = user?.token;
      const isGuest = user?.isGuest || rawToken === "guest-token";

      // If there is no real auth token OR this is a guest session,
      // do NOT show directory members – require full login instead.
      if (!rawToken || isGuest) {
        setGuestRestricted(true);
        setLoading(false);

        Alert.alert(
          "Login Required",
          "Please log in with your GBS account to view the Member Directory.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => navigation.goBack && navigation.goBack(),
            },
            {
              text: "Login",
              onPress: () => navigation.navigate("Signin"),
            },
          ],
        );
        return;
      }

      setToken(rawToken);
      setMyUserId(user._id || user?.user?._id);

      // Only fetch members when user is fully authenticated
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
          { headers: { Authorization: `Bearer ${token}` } },
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
      <ScrollView ref={scrollViewRef}>
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
        {/* <View style={tw`flex-row justify-between mb-4`}>
          {["All", "VIC", "NSW", "QLD", "SA", "Other"].map((filter) => (
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
        </View> */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mb-4`}
        >
          {["All", "VIC", "NSW", "QLD", "SA", "Other"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => handleStateFilter(filter)}
              style={tw`px-4 py-2 mr-2 rounded-lg border ${
                selectedState === filter
                  ? "bg-red-100 border-red-400"
                  : "bg-gray-100 border-gray-300"
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
        </ScrollView>

        {loading && (
          <Text style={tw`text-center text-gray-400 mt-6`}>
            Loading members...
          </Text>
        )}
        {!loading && members.length === 0 && (
          <Text style={tw`text-center text-gray-400 mt-6`}>
            {guestRestricted || !token
              ? "Please log in to view the Member Directory."
              : "No members found for selected state"}
          </Text>
        )}

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
                    Business Name: {item.businessName}
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
      </ScrollView>
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 bg-white px-6 py-3 border-t border-gray-200`,
          {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 10,
          },
        ]}
      >
        <View style={tw`flex-row items-center justify-between`}>
          {/* PREVIOUS */}
          <TouchableOpacity
            disabled={page === 1 || paginationLoading}
            onPress={() =>
              page > 1 &&
              searchUsers(search, selectedState, page - 1, true, true)
            }
            style={tw`px-3 py-2 rounded-lg ${
              page === 1 ? "bg-gray-100" : "bg-red-100"
            }`}
          >
            <Text
              style={tw`text-sm font-semibold ${
                page === 1 ? "text-gray-400" : "text-red-500"
              }`}
            >
              ◀ Previous
            </Text>
          </TouchableOpacity>

          {/* PAGE */}
          <View style={tw`px-4 py-2 rounded-full bg-gray-100`}>
            <Text style={tw`text-sm font-bold text-gray-700`}>Page {page}</Text>
          </View>

          <TouchableOpacity
            disabled={!hasNext || paginationLoading}
            onPress={() =>
              hasNext &&
              searchUsers(search, selectedState, page + 1, true, true)
            }
            style={tw`px-3 py-2 rounded-lg ${
              hasNext ? "bg-red-100" : "bg-gray-100"
            }`}
          >
            <Text
              style={tw`text-sm font-semibold ${
                hasNext ? "text-red-500" : "text-gray-400"
              }`}
            >
              Next ▶
            </Text>
          </TouchableOpacity>
        </View>

        {paginationLoading && (
          <Text style={tw`text-center text-gray-400 text-xs mt-1`}>
            Loading page...
          </Text>
        )}
      </View>
    </View>
  );
}
