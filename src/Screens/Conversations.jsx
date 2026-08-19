import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getUserData } from "../utils/storage";
import { io } from "socket.io-client";
import { useIsFocused } from "@react-navigation/native";

export default function Conversations({ navigation }) {
  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const socketRef = useRef(null);
  const isFocused = useIsFocused();
  const processedMessages = useRef(new Set());

  useEffect(() => {
    const init = async () => {
      try {
        const parsed = await getUserData();

        // 👇 Explicit guest check
        if (parsed?.isGuest === true) {
          setIsGuest(true);
          setToken(null);
          setMyUserId(null);
          setLoading(false);
          return;
        }

        // 👇 Logged-in user
        if (parsed?.token && (parsed?._id || parsed?.user?._id)) {
          setToken(parsed.token);
          setMyUserId(parsed._id || parsed.user?._id);
          setIsGuest(false);
          return;
        }

        // 👇 Fallback
        setIsGuest(true);
        setLoading(false);
      } catch (e) {
        setIsGuest(true);
        setLoading(false);
      }
    };

    init();
  }, []);

  const fetchConversations = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/messages/conversations`,
        {
          params: { page: 1, limit: 50 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

        // Fallback: if unreadCount is missing, check last message
        let unreadCount = c.unreadCount || 0;
        if (unreadCount === 0 && last && !last.isRead && last.sender?._id !== myUserId) {
          unreadCount = 1;
        }

        return {
          id: c._id,
          otherUser: {
            id: other._id,
            name: other.name || other.email || "Unknown",
            avatarUrl: other.avatarUrl || null,
          },
          lastText: last?.[0]?.content || last?.content || "",
          unreadCount: unreadCount,
        };
      });

      setItems(mapped);
    } catch (e) {
      console.log(
        "❌ Conversations GET error:",
        e?.response?.data || e.message
      );
      setItems([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      return;
    }

    if (!token || !myUserId) {
      return;
    }

    fetchConversations();
  }, [token, myUserId, isGuest]);

  // Socket setup for real-time updates
  useEffect(() => {
    if (!token || !myUserId) return;

    if (socketRef.current) {
        socketRef.current.disconnect();
    }

    const s = io(API_BASE_URL, {
      transports: ["websocket"],
      auth: { token: `Bearer ${token}` },
    });

    socketRef.current = s;

    s.on("newMessage", (msg) => {
      console.log("📨 Conversations received newMessage:", msg._id);
      
      // Prevent duplicate processing of same message ID
      if (processedMessages.current.has(msg._id)) {
        console.log("⏭️ Message already processed, skipping badge increment");
        return;
      }
      processedMessages.current.add(msg._id);

      setItems((prev) => {
        const next = [...prev];
        const targetId = msg.conversationId || msg.conversation?._id || msg.conversation;
        const idx = next.findIndex((c) => c.id === targetId);
        
        if (idx !== -1) {
          const updated = { ...next[idx] };
          updated.lastText = msg.content || (msg.media && msg.media.length > 0 ? "Media message" : "");
          
          if (msg.sender?._id !== myUserId && msg.sender !== myUserId) {
            updated.unreadCount = (updated.unreadCount || 0) + 1;
          }
          
          next.splice(idx, 1);
          next.unshift(updated);
        } else {
          fetchConversations(false);
        }
        return next;
      });
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [token, myUserId]);

  const openChat = (item) => {
    console.log("➡️ Open chat: ", item);
    // Optimistically clear unread count
    setItems(prev => prev.map(c => c.id === item.id ? { ...c, unreadCount: 0 } : c));
    
    navigation.navigate("Chat", {
      user: {
        id: item.otherUser.id,
        name: item.otherUser.name,
        avatarUrl: item.otherUser.avatarUrl,
      },
      conversationId: item.id,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => openChat(item)}
      style={tw`flex-row items-center p-3 border-b border-gray-200`}
    >
      <View style={tw`relative`}>
        <Image
          source={
            item.otherUser?.avatarUrl
              ? { uri: item.otherUser.avatarUrl }
              : require("../../assets/user.jpg")
          }
          style={tw`w-12 h-12 rounded-full`}
        />
        {item.unreadCount > 0 && (
          <View 
            style={[
              tw`absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center px-1`,
              { borderLineWidth: 2, borderColor: 'white' }
            ]}
          >
            <Text style={tw`text-white text-xs font-bold`}>
              {item.unreadCount > 9 ? "9+" : item.unreadCount}
            </Text>
          </View>
        )}
      </View>

      <View style={tw`ml-3 flex-1`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-base font-semibold ${item.unreadCount > 0 ? 'text-black' : 'text-gray-900'}`}>{item.otherUser.name}</Text>
          {item.unreadCount > 0 && (
            <View style={tw`w-2 h-2 rounded-full bg-red-500`} />
          )}
        </View>
        <Text 
          style={tw`text-sm ${item.unreadCount > 0 ? 'text-black font-semibold' : 'text-gray-500'}`} 
          numberOfLines={1}
        >
          {item.lastText}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const EmptyConversations = () => {
    return (
      <View style={tw`flex-1 justify-center items-center mt-20 px-6`}>
        <MaterialIcons name="chat-bubble-outline" size={64} color="#9CA3AF" />

        <Text style={tw`text-lg font-semibold text-gray-800 mt-4`}>
          No conversations yet
        </Text>

        <Text style={tw`text-sm text-gray-500 text-center mt-2`}>
          Start a conversation to connect with others.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Directory")}
          style={tw`mt-6 bg-red-600 px-6 py-3 rounded-full w-full`}
        >
          <Text style={tw`text-white font-bold text-center`}>
            Start Conversation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("GroupConversations", {
              initialTab: "community",
            })
          }
          style={tw`mt-4 border border-red-600 px-6 py-3 rounded-full w-full`}
        >
          <Text style={tw`text-red-600 font-bold text-center`}>
            GBS Community
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const GuestLoginPrompt = () => {
    return (
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <MaterialIcons name="lock-outline" size={64} color="#DC2626" />

        <Text style={tw`text-xl font-bold text-gray-800 mt-4`}>
          Login Required
        </Text>

        <Text style={tw`text-sm text-gray-500 text-center mt-2`}>
          Please log in to view your conversations and start chatting with
          others.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Signin")}
          style={tw`mt-6 bg-red-600 px-8 py-3 rounded-full`}
        >
          <Text style={tw`text-white font-bold`}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-white mt-0`}>
      <View
        style={tw`p-4 flex-row  items-center border-b border-gray-200 mt-8`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold pl-4`}>Conversations</Text>
      </View>

      {!loading && !isGuest && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("GroupConversations", {
              initialTab: "community",
            })
          }
          style={tw`mx-4 mt-3 bg-red-50 p-3 rounded-lg border border-red-200 flex-row items-center justify-between`}
        >
          <View style={tw`flex-row items-center`}>
            <Ionicons name="people" size={20} color="#DC2626" />
            <Text style={tw`ml-2 text-red-700 font-semibold`}>
              GBS Community Groups
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#DC2626" />
        </TouchableOpacity>
      )}

      {loading ? (
        <Text style={tw`text-center text-gray-500 mt-10`}>Loading...</Text>
      ) : isGuest ? (
        <GuestLoginPrompt />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ListEmptyComponent={!loading ? <EmptyConversations /> : null}
          contentContainerStyle={items.length === 0 ? tw`flex-1` : null}
        />
      )}
    </View>
  );
}
