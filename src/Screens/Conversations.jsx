import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/config";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Conversations({ navigation }) {
  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setToken(parsed.token);
          setMyUserId(parsed._id);
        }
      } catch (e) {}
    };
    init();
  }, []);
  useEffect(() => {
    const fetchConversations = async () => {
      if (!token || !myUserId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/messages/conversations`,
          {
            params: { page: 1, limit: 50 },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("✅ Conversations GET response:", data);

        // ✅ Filter out group chats
        const conversations = Array.isArray(data?.conversations)
          ? data.conversations.filter((c) => !c.isGroup)
          : [];

        const mapped = conversations.map((c) => {
          const other =
            (c.participants || []).find((p) => p._id !== myUserId) || {};
          const last =
            Array.isArray(c.messages) && c.messages.length > 0
              ? c.messages[0]
              : null;

          return {
            id: c._id,
            otherUser: {
              id: other._id,
              name: other.name || other.email || "Unknown",
              avatarUrl: other.avatarUrl || null,
            },
            lastText: last?.content || "",
          };
        });

        console.log("✅ Conversations mapped for UI:", mapped);
        setItems(mapped);
      } catch (e) {
        console.log(
          "❌ Conversations GET error:",
          e?.response?.data || e.message
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [token, myUserId]);

  const openChat = (item) => {
    console.log("➡️ Open chat: ", item);
    navigation.navigate("Chat", {
      user: {
        id: item.otherUser.id,
        name: item.otherUser.name,
        avatarUrl: item.otherUser.avatarUrl, // 👈 include this
      },
      conversationId: item.id,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => openChat(item)}
      style={tw`flex-row items-center p-3 border-b border-gray-200`}
    >
      <Image
        source={
          item.otherUser?.avatarUrl
            ? { uri: item.otherUser.avatarUrl }
            : require("../../assets/user.jpg")
        }
        style={tw`w-10 h-10 rounded-full`}
      />

      <View style={tw`ml-3 flex-1`}>
        <Text style={tw`text-base font-semibold`}>{item.otherUser.name}</Text>
        <Text style={tw`text-sm text-gray-600`} numberOfLines={1}>
          {item.lastText}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white mt-0`}>
      <View style={tw`p-4 flex-row  items-center border-b border-gray-200`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold pl-4`}>Conversations</Text>
      </View>
      {loading ? (
        <Text style={tw`text-center text-gray-500 mt-10`}>Loading...</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
