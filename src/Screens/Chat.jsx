import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { API_BASE_URL } from "../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { useSafeAreaInsets } from "react-native-safe-area-context";



export default function Chat({ navigation }) {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const chatUser = route.params?.user ?? { name: "Guest" };
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [conversationId, setConversationId] = useState(route.params?.conversationId || null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setToken(parsed.token);
          setMyUserId(parsed._id); // 👈 save logged-in user's id
        }
      } catch (err) {
        console.error("❌ Error reading userData from storage:", err);
      }
    };
    loadUserData();
  }, []);

  // Ensure a conversation exists and we have its id
  useEffect(() => {
    const ensureConversation = async () => {
      if (!token || !chatUser?.id || conversationId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/messages/conversation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipientId: chatUser.id }),
        });
        const data = await res.json();
        if (res.ok && data?._id) {
          setConversationId(data._id);
        } else {
          console.error("❌ Failed to ensure conversation:", data?.message || data);
        }
      } catch (e) {
        console.error("❌ ensureConversation error:", e);
      }
    };
    ensureConversation();
  }, [token, chatUser?.id, conversationId]);

  // convert backend message → frontend format
  const formatMessage = (msg, myUserId) => {
    return {
      id: msg._id,
      text: msg.content,
      fromMe: msg.sender._id === myUserId,
      status: msg.isRead ? "seen" : "sent",
      type: "text", // backend has no images, so default
    };
  };
  const fetchMessages = async () => {
    if (!token || !myUserId || !conversationId) return; // wait for data
    try {
      const res = await fetch(
        `${API_BASE_URL}/messages/conversation/${conversationId}?page=1&limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error fetching messages:", data.message);
        return;
      }

      const msgs = Array.isArray(data?.messages) ? data.messages : [];
      // API returns newest-first; display oldest-first
      const ordered = [...msgs].reverse();
      const formatted = ordered.map((m) => formatMessage(m, myUserId));
      setMessages(formatted);
      // Scroll to bottom after loading
      setTimeout(() => listRef.current?.scrollToEnd?.({ animated: false }), 0);
    } catch (err) {
      console.error("❌ Error loading messages:", err);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [conversationId, token, myUserId]);

  // Socket.io setup for realtime updates
  useEffect(() => {
    if (!token) return;
  
    const s = io(API_BASE_URL, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${token}`,
      },
    });
    
    
    socketRef.current = s;

    s.on("connect_error", (err) => {
      console.log("🔌 socket connect_error:", err?.message || err);
    });

    s.on("newMessage", (msg) => {
      if (msg?.conversationId !== conversationId) return;
      setMessages((prev) => [...prev, formatMessage(msg, myUserId)]);
    });

    s.on("messageRead", (data) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === data?.messageId ? { ...m, status: "seen" } : m))
      );
    });

    return () => {
      try {
        s.removeAllListeners();
        s.disconnect();
      } catch {}
    };
  }, [token, conversationId, myUserId]);

  // ✅ Send message
  const sendMessage = async () => {
    if (newMessage.trim() === "" || !token || !myUserId) return;

    try {
      // Optimistic append
      const tempId = `local-${Date.now()}`;
      const optimistic = {
        id: tempId,
        text: newMessage,
        fromMe: true,
        status: "sent",
        type: "text",
      };
      setMessages((prev) => [...prev, optimistic]);

      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: chatUser.id, // 👈 send TO the other person
          content: newMessage,
        }),
      });

      const savedMsg = await res.json();

      if (!res.ok) {
        Alert.alert(
          "Message Error",
          savedMsg.message || "Failed to send message"
        );
        // revert optimistic if failed
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return;
      }

      // Optionally update optimistic message id/status if backend returns id
      if (savedMsg?._id) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: savedMsg._id } : m))
        );
      }
      setNewMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  const handlePlus = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.type === "success") {
        Alert.alert("File Selected", result.name);
      }
    } catch (err) {
      Alert.alert("Error", "Could not open document picker.");
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert("Photo Taken", "Image captured successfully.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
    <View style={tw`flex-1 bg-white pt-8 pb-2 `}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3 border-b`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <View style={tw`flex-row items-center mr-16`}>
          <Image
            source={require("../../assets/user.png")}
            style={tw`w-10 h-10 rounded-full mr-2`}
          />
          <View>
            <Text style={tw`font-semibold`}>{chatUser?.name}</Text>
            <Text style={tw`text-xs text-gray-500`}>Last seen 2 hours ago</Text>
          </View>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity>
            <Ionicons name="call" size={22} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="video-call" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={tw`flex-1`}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 96, paddingTop: 8 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: true })}
        renderItem={({ item }) => (
          <View
            style={tw.style(
              `px-4 py-2 my-1`,
              item.fromMe ? "items-end" : "items-start"
            )}
          >
            <View
              style={tw.style(
                "rounded-xl px-4 py-2 flex-row items-center",
                item.fromMe ? "bg-pink-200" : "bg-gray-100"
              )}
            >
              <Text style={tw`mr-1`}>{item.text}</Text>
              {item.fromMe && item.status && (
                <Ionicons
                  name={
                    item.status === "sent"
                      ? "checkmark"
                      : item.status === "delivered"
                        ? "checkmark-done"
                        : item.status === "seen"
                          ? "checkmark-done-circle"
                          : "time"
                  }
                  size={16}
                  color={item.status === "seen" ? "blue" : "gray"}
                />
              )}
            </View>
          </View>
        )}
      />

      {/* Typing status (optional) */}
      {/* <Text style={tw`text-sm text-gray-500 px-4`}>{chatUser.name} is typing...</Text> */}

      {/* Input */}
      <View style={[tw`px-2 py-2 border-t bg-white`, { paddingBottom: Math.max(insets.bottom, 8) }] }>
        <View style={tw`flex-row items-center`}>
          {/* Rounded input like WhatsApp */}
          <View style={tw`flex-1 bg-gray-100 rounded-3xl flex-row items-center px-2 py-1`}>
            <TouchableOpacity style={tw`px-2`}>
              <Ionicons name="happy-outline" size={22} color="#6b7280" />
            </TouchableOpacity>
            <TextInput
              placeholder="Message"
              value={newMessage}
              onChangeText={setNewMessage}
              style={tw`flex-1 px-2 py-1`}
              blurOnSubmit={false}
              multiline
            />
            <TouchableOpacity onPress={handlePlus} style={tw`px-2`}>
              <Ionicons name="attach-outline" size={22} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCamera} style={tw`px-2`}>
              <Ionicons name="camera-outline" size={22} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {/* Send button */}
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!newMessage.trim()}
            style={tw.style(
              `ml-2 w-10 h-10 rounded-full items-center justify-center`,
              newMessage.trim() ? `bg-green-500` : `bg-gray-300`
            )}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
 
  );
}
