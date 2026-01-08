import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSession } from "../utils/secureAuth";

// ================= IMAGES =================
const COMMUNITY_IMAGES = {
  Announcements: null,
  Social: require("../../assets/social.jpeg"),
  Business: require("../../assets/business.png"),
  Wellbeing: require("../../assets/wellbeing3.png"),
  Victoria: require("../../assets/victoria.jpeg"),
  NSW: require("../../assets/nsw.png"),
  Qld: require("../../assets/qld.png"),
  SA: require("../../assets/SA.jpeg"),
  "Horse Racing": require("../../assets/horse riding.png"),
  "Wine Community": require("../../assets/wine.jpeg"),
  "GBS Golf": require("../../assets/golf.png"),
};

const DEFAULT_COMMUNITY_IMAGE = require("../../assets/Community.png");

const getCommunityImage = (name) =>
  COMMUNITY_IMAGES[name] || DEFAULT_COMMUNITY_IMAGE;

// ================= TOKEN =================
const getAuthToken = async () => {
  const session = await getSession({ prompt: false });
  if (session?.token) return session.token;

  const stored = await AsyncStorage.getItem("userData");
  return stored ? JSON.parse(stored)?.token : null;
};

// ================= MAIN =================
export default function GroupConversations({ navigation }) {
  const [activeTab, setActiveTab] = useState("mygroups");
  const [loading, setLoading] = useState(true);

  const [myGroups, setMyGroups] = useState([]);
  const [communityGroups, setCommunityGroups] = useState([]);
  const [publicGroups, setPublicGroups] = useState([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState([]);

  const loadData = async () => {
    const token = await getAuthToken();
    if (!token) return;

    try {
      setLoading(true);

      // Fetch all conversations to get user's joined groups
      const convRes = await axios.get(
        `${API_BASE_URL}/messages/conversations?page=1&limit=200`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allConversations = convRes.data?.conversations || [];
      setMyGroups(allConversations.filter((c) => c.isGroup && !c.isPublic));

      const joinedPublic = allConversations
        .filter((c) => c.isGroup && c.isPublic)
        .map((c) => c._id);
      setJoinedGroupIds(joinedPublic);

      // Fetch all public groups
      const publicRes = await axios.get(
        `${API_BASE_URL}/messages/public-groups`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const groups = publicRes.data?.groups || [];

      // Community groups: only "Announcements" is admin-only
      setCommunityGroups(groups.filter((g) => g.groupName === "Announcements"));
      setPublicGroups(groups.filter((g) => g.groupName !== "Announcements"));
    } catch (e) {
      Alert.alert("Error", "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const toggleJoinLeave = async (id) => {
    const token = await getAuthToken();
    const joined = joinedGroupIds.includes(id);

    const url = joined
      ? `/messages/leave-group/${id}`
      : `/messages/join-group/${id}`;

    try {
      await axios.post(
        `${API_BASE_URL}${url}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinedGroupIds((prev) =>
        joined ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } catch (err) {
      Alert.alert("Error", "Failed to update group membership");
    }
  };

  // const openChat = (group) => {
  //   navigation.navigate("GroupChat", {
  //     conversationId: group._id,
  //     readOnly: group.groupName === "Announcements",
  //   });
  // };
  const openChat = (group) => {
    navigation.navigate("GroupChat", {
      conversationId: group._id,
      group: {
        // Pass the group object with name
        name: group.groupName, // Make sure to use the correct field name
        groupImage: group.groupImage, // Also pass group image if available
      },
      participants: group.participants || [],
      readOnly: group.groupName === "Announcements",
    });
  };
  +3;

  // ================= RENDER ITEM =================
  const renderGroup = ({ item }) => {
    const isMyGroup = activeTab === "mygroups";
    const joined = isMyGroup || joinedGroupIds.includes(item._id);
    const isAnnouncements = item.groupName === "Announcements";

    return (
      <View style={tw`mx-4 mb-3 bg-white rounded-xl border`}>
        <TouchableOpacity
          onPress={() =>
            (joined || isAnnouncements || isMyGroup) && openChat(item)
          }
          style={tw`flex-row p-4 ${!joined && !isAnnouncements ? "opacity-60" : ""}`}
        >
          <Image
            source={getCommunityImage(item.groupName)}
            style={tw`w-12 h-12 rounded-lg mr-4`}
          />
          <Text style={tw`text-lg font-bold flex-1`}>
            {item.groupName} {isAnnouncements ? "(Admin Only)" : ""}
          </Text>
        </TouchableOpacity>

        {activeTab !== "mygroups" && !isAnnouncements && (
          <TouchableOpacity
            onPress={() => toggleJoinLeave(item._id)}
            style={tw`border-t py-2`}
          >
            <Text style={tw`text-center text-red-600 font-bold`}>
              {joined ? "Joined" : "Join Group"}
            </Text>
          </TouchableOpacity>
        )}

        {activeTab !== "mygroups" && !joined && !isAnnouncements && (
          <Text style={tw`text-center text-gray-800 text-xs py-1`}>
            You are not a contributor to this group.
          </Text>
        )}
      </View>
    );
  };

  // ================= UI =================
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-4 bg-white mt-12`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold ml-4`}>Group Chats</Text>
      </View>

      {/* Tabs */}
      <View style={tw`flex-row justify-around bg-white py-2`}>
        {["mygroups", "community", "public"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={tw`font-bold ${activeTab === tab ? "text-red-600" : "text-gray-500"}`}
            >
              {tab === "mygroups"
                ? "My Groups"
                : tab === "community"
                  ? "Community"
                  : "Public Groups"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={tw`mt-14`} color="red" size="large" />
      ) : (
        <FlatList
          data={
            activeTab === "mygroups"
              ? myGroups
              : activeTab === "community"
                ? communityGroups
                : publicGroups
          }
          keyExtractor={(item) => item._id}
          renderItem={renderGroup}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={tw`text-center text-gray-500 mt-10`}>
              No groups available at the moment
            </Text>
          }
          contentContainerStyle={tw`pb-20`}
        />
      )}
    </View>
  );
}
