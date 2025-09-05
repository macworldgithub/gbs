import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../utils/config";
import * as FileSystem from "expo-file-system";

export default function GroupChat() {
  const navigation = useNavigation();
  const route = useRoute();
  const conversationId = route?.params?.conversationId || null;
  const group = route?.params?.group || { name: "Group" };

  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);
  const sendingMediaSetRef = useRef(new Set());
  const isPickingRef = useRef(false);

  const [newMessage, setNewMessage] = useState("");

  // Load auth
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setToken(parsed?.token || null);
        setMyUserId(parsed?._id || null);
      }
    })();
  }, []);

  // Socket connect
  useEffect(() => {
    if (!token) return;
    const s = io(API_BASE_URL, {
      transports: ["websocket"],
      auth: { token: `Bearer ${token}` },
    });
    socketRef.current = s;
    s.off("newMessage");
    s.on("newMessage", (msg) => {
      if (msg?.conversationId !== conversationId) return;
      setMessages((prev) => {
        const incoming = formatMessage(msg);
        // if an optimistic sending bubble exists, drop the first one of same type
        const next = [...prev];
        if (incoming.fromMe) {
          const idx = next.findIndex(
            (m) =>
              m.fromMe && m.status === "sending" && m.type === incoming.type
          );
          if (idx !== -1) next.splice(idx, 1);
        }
        if (next.some((m) => m.id === incoming.id)) return next;
        next.push(incoming);
        next.sort(
          (a, b) =>
            new Date(a.createdAt || Date.now()) -
            new Date(b.createdAt || Date.now())
        );
        return next;
      });
      if (msg.sender?._id !== myUserId) {
        s.emit("markAsRead", { conversationId, messageIds: [msg._id] });
      }
    });
    // acknowledge to replace optimistic temp id
    s.off("messageSent");
    s.on("messageSent", (data) => {
      const realId = data?.messageId;
      if (!realId) return;
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.findIndex((m) => m.fromMe && m.status === "sending");
        if (idx !== -1)
          next[idx] = { ...next[idx], id: realId, status: "sent" };
        return next;
      });
      // refresh to ensure signed URLs are attached
      setTimeout(() => {
        fetchMessages();
      }, 200);
    });
    return () => {
      try {
        s.removeAllListeners();
        s.disconnect();
      } catch {}
    };
  }, [token, conversationId, myUserId]);
  // ✅ Fetch messages
  const fetchMessages = async () => {
    if (!token || !myUserId || !conversationId) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/messages/conversation/${conversationId}?page=1&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📥 Raw API response:", res.data);
      const msgs = Array.isArray(res.data?.messages) ? res.data.messages : [];
      // Backend returns newest first; sort ascending so newest at bottom
      const sortedByCreatedAt = [...msgs].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      console.log("📥 Messages from API:", msgs);

      const formatted = sortedByCreatedAt.map((m) =>
        formatMessage(m, myUserId)
      );
      console.log("✅ Formatted messages:", formatted);

      setMessages(formatted);

      setTimeout(() => listRef.current?.scrollToEnd?.({ animated: false }), 0);
      // ✅ NEW: mark unread messages as read
      const unreadIds = msgs
        .filter((m) => m.recipient?._id === myUserId && !m.isRead)
        .map((m) => m._id);

      if (unreadIds.length > 0 && socketRef.current) {
        socketRef.current.emit("markAsRead", {
          conversationId,
          messageIds: unreadIds,
        });
      }
    } catch (err) {
      console.error("❌ Error loading messages:", err);
    }
  };

  const formatMessage = (msg) => ({
    id: msg._id,
    text: msg.content || "",
    fromMe: msg.sender?._id === myUserId,
    status: msg.isRead ? "seen" : "sent",
    time: new Date(msg.createdAt || Date.now()).toLocaleTimeString(),
    type:
      Array.isArray(msg.media) && msg.media.length > 0
        ? msg.media[0].type
        : "text",
    url:
      Array.isArray(msg.media) && msg.media.length > 0
        ? msg.media[0].signedUrl
        : null,
  });

  // Load messages
  useEffect(() => {
    const load = async () => {
      if (!token || !conversationId) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/messages/conversation/${conversationId}?page=1&limit=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const msgs = Array.isArray(res.data?.messages) ? res.data.messages : [];
        const formatted = msgs
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map(formatMessage);
        setMessages(formatted);
      } catch (e) {
        console.error(
          "load group messages error",
          e.response?.data || e.message
        );
      }
    };
    load();
  }, [token, conversationId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;
    const tempId = `local-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        text: newMessage.trim(),
        fromMe: true,
        status: "sending",
        type: "text",
        createdAt: new Date().toISOString(),
      },
    ]);
    socketRef.current.emit("sendMessage", {
      conversationId,
      content: newMessage.trim(),
    });
    setNewMessage("");
  };

  const handlePlus = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.type === "success") {
        Alert.alert("File Selected", result.name);
      }
    } catch {
      Alert.alert("Error", "Could not open document picker.");
    }
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera access is required.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        base64: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const captured = result.assets[0];
        await sendMediaMessage(captured);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to capture image");
    }
  };

  const pickMedia = () => {
    if (isPickingRef.current) return;
    isPickingRef.current = true;
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
    }).then(async (res) => {
      try {
        if (!res.canceled && res.assets && res.assets.length > 0) {
          await sendMediaMessage(res.assets[0]);
        }
      } finally {
        setTimeout(() => {
          isPickingRef.current = false;
        }, 300);
      }
    });
  };

  const sendMediaMessage = async (file) => {
    const mimeType =
      file.type ||
      file.mimeType ||
      (file.uri?.toLowerCase().endsWith(".mp4") ? "video/mp4" : "image/jpeg");
    const extension = mimeType.split("/")[1] || "jpg";
    const displayType = mimeType.startsWith("video")
      ? "VIDEO"
      : mimeType.startsWith("image")
        ? "IMAGE"
        : "FILE";

    const fingerprint = file.assetId || file.uri;
    const fpKey = fingerprint || `${file.uri}-${extension}`;
    if (sendingMediaSetRef.current.has(fpKey)) return;
    sendingMediaSetRef.current.add(fpKey);

    const tempId = `local-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        url: file.uri,
        type: displayType,
        fromMe: true,
        status: "sending",
        fileName: file.fileName || `upload-${Date.now()}.${extension}`,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      const fileUri =
        Platform.OS === "android" ? file.uri : file.uri.replace("file://", "");
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      if (!socketRef.current) throw new Error("Socket not connected");
      socketRef.current.emit("sendMessage", {
        conversationId,
        file: {
          name: file.fileName || `upload-${Date.now()}.${extension}`,
          type: mimeType,
          data: `data:${mimeType};base64,${base64}`,
        },
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      Alert.alert("Error", "Failed to send media");
    } finally {
      setTimeout(() => {
        sendingMediaSetRef.current.delete(fpKey);
      }, 1500);
    }
  };

  return (
    <View style={tw`flex-1 bg-white mt-6 mb-8`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-2 border-b border-gray-300`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <View style={tw`flex-row items-center mr-24`}>
          <Image
            source={require("../../assets/user.png")}
            style={tw`w-10 h-10 rounded-full mr-2`}
          />
          <View>
            <Text style={tw`font-semibold text-base`}>
              {group?.name || "Group"}
            </Text>
            <Text style={tw`text-xs text-gray-500`}>Group Conversation</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="video-call" size={28} color="red" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-2`}
        renderItem={({ item }) => {
          return (
            <View
              style={tw.style(
                "px-4 mt-1",
                item.fromMe ? "items-end" : "items-start"
              )}
            >
              <View
                style={tw.style(
                  "rounded-xl px-4 py-2",
                  item.fromMe ? "bg-pink-200" : "bg-gray-100"
                )}
              >
                <Text>{item.text}</Text>
              </View>
              <View style={tw`flex-row items-center mt-1`}>
                <Text style={tw`text-xs text-gray-500 mr-1`}>{item.time}</Text>
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
          );
        }}
      />

      {/* Typing Status */}
      <Text style={tw`text-xs text-gray-400 px-4 pt-2`}>
        {group?.name || "Group"} is active
      </Text>

      {/* Input */}
      <View
        style={tw`flex-row items-center px-2 py-2 border-t border-gray-300`}
      >
        <TouchableOpacity onPress={handlePlus}>
          <FontAwesome name="plus" size={20} style={tw`mx-2`} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCamera}>
          <Ionicons name="camera" size={20} style={tw`mx-2`} />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickMedia}>
          <Ionicons name="image" size={20} style={tw`mx-2`} />
        </TouchableOpacity>
        {/* Removed mic button */}
        <TextInput
          placeholder="Type Here..."
          value={newMessage}
          onChangeText={setNewMessage}
          style={tw`flex-1 bg-gray-100 rounded-full px-4 py-2 mx-2`}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
