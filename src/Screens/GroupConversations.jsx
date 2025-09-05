import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/config";

export default function GroupConversations({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem("userData");
      const parsed = stored ? JSON.parse(stored) : null;
      const token = parsed?.token;
      const res = await axios.get(
        `${API_BASE_URL}/messages/conversations?page=1&limit=100`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const list = (res.data?.conversations || []).filter((c) => c.isGroup);
      setGroups(list);
    } catch (e) {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadGroups);
    loadGroups();
    return unsubscribe;
  }, [navigation]);

  const openGroup = (conv) => {
    navigation.navigate("GroupChat", {
      conversationId: conv._id,
      group: { name: conv.groupName || "Group" },
      participants: conv.participants || [],
    });
  };

  return (
    <View style={tw`flex-1 bg-white pt-10 px-4`}>
      <Text style={tw`text-lg font-bold text-black mb-4`}>Group Chats</Text>
      {loading ? (
        <View style={tw`mt-10 items-center`}>
          <ActivityIndicator size="small" color="#ef4444" />
          <Text style={tw`text-gray-500 mt-2`}>Loading groups...</Text>
        </View>
      ) : groups.length === 0 ? (
        <Text style={tw`text-gray-500 mt-10 text-center`}>
          No group conversations yet.
        </Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openGroup(item)}
              style={tw`flex-row items-center bg-gray-100 p-3 mb-3 rounded-xl`}
            >
              <Image
                source={require("../../assets/user.png")}
                style={tw`w-10 h-10 rounded-full mr-3`}
              />
              <View style={tw`flex-1`}>
                <Text style={tw`text-black font-semibold`}>
                  {item.groupName || "Group"}
                </Text>
                {Array.isArray(item.messages) && item.messages[0]?.content ? (
                  <Text style={tw`text-gray-600 text-xs`} numberOfLines={1}>
                    {item.messages[0].content}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
