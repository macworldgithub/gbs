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
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { API_BASE_URL } from "../utils/config";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import Video from "react-native-video";

export default function Chat({ navigation }) {
  const route = useRoute();
  const insets = useSafeAreaInsets();

  // ✅ normalize user param - handle both id and _id fields
  const chatUser = route.params?.user ?? { _id: "guest", name: "Guest" };
  // Ensure chatUser has _id field for consistency
  if (chatUser && !chatUser._id && chatUser.id) {
    chatUser._id = chatUser.id;
  }

  // Debug: Log the chatUser object to see its structure
  console.log("🔍 Chat screen loaded with user:", chatUser);
  console.log("🔍 chatUser._id:", chatUser._id);
  console.log("🔍 chatUser.id:", chatUser.id);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [conversationId, setConversationId] = useState(
    route.params?.conversationId || null
  );

  console.log("checking:", messages);
  const socketRef = useRef(null);
  const listRef = useRef(null);
  const sendingMediaSetRef = useRef(new Set());
  const isPickingRef = useRef(false);
  const lastTextSendRef = useRef({ content: "", recipientId: "", ts: 0 });

  // 🔑 Load logged-in user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setToken(parsed.token);
          setMyUserId(parsed._id); // ✅ use _id not id
          console.log("🔍 Loaded user data:", {
            token: parsed.token ? "present" : "missing",
            userId: parsed._id,
          });
        } else {
          console.log("❌ No user data found in AsyncStorage");
        }
      } catch (err) {
        console.error("❌ Error reading userData:", err);
      }
    };
    loadUserData();
  }, []);

  // ✅ Ensure conversation exists
  useEffect(() => {
    const ensureConversation = async () => {
      if (!token || !chatUser?._id || conversationId) return;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/messages/conversation`,
          { recipientId: chatUser._id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data?._id) {
          setConversationId(res.data._id);
        }
      } catch (e) {
        console.error(
          "❌ ensureConversation error:",
          e.response?.data || e.message
        );
      }
    };

    ensureConversation();
  }, [token, chatUser?._id, conversationId]);

  const formatMessage = (msg, myId) => {
    console.log("🔍 Formatting message:", {
      id: msg._id,
      content: msg?.content,
      hasMedia: Array.isArray(msg.media) && msg.media.length > 0,
      media: msg?.media,
    });

    const firstMedia =
      Array.isArray(msg.media) && msg.media.length > 0 ? msg.media[0] : null;
    const mediaUrl = firstMedia?.signedUrl || null;
    const mediaType = firstMedia?.type;

    // Determine message type: prioritize media over content
    let messageType = "text";
    if (firstMedia) {
      if (mediaType === "video") {
        messageType = "VIDEO";
      } else if (mediaType === "image") {
        messageType = "IMAGE";
      } else {
        messageType = "FILE";
      }
    }

    const formatted = {
      id: msg._id,
      text: msg.content || "", // Handle empty content for media messages
      url: mediaUrl,
      fromMe: msg.sender?._id === myId,
      // status: msg.isRead ? "seen" : "sent",
      isRead: msg.isRead,
      type: messageType,
      createdAt: msg.createdAt || new Date().toISOString(),
      isSending: msg.isSending || false,
    };

    console.log("✅ Formatted message:", formatted);
    return formatted;
  };

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

  useEffect(() => {
    fetchMessages();
  }, [conversationId, token, myUserId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchMessages();
    }, [conversationId, token, myUserId])
  );

  // ✅ Socket setup
  useEffect(() => {
    if (!token) return;

    const s = io(API_BASE_URL, {
      transports: ["websocket"],
      auth: { token: `Bearer ${token}` },
    });

    socketRef.current = s;

    s.on("connect_error", (err) => {
      console.log("🔌 socket connect_error:", err?.message || err);
    });

    // Ensure no duplicate listeners in hot-reload/dev
    s.off("newMessage");
    s.off("messageSent");
    s.off("messageRead");

    s.on("newMessage", (msg) => {
      console.log("📨 Received newMessage:", msg);
      if (msg?.conversationId !== conversationId) {
        console.log("❌ Message not for current conversation, ignoring");
        return;
      }

      const formattedIncoming = formatMessage(msg, myUserId);
      console.log("✅ Formatted incoming message:", formattedIncoming);

      setMessages((prev) => {
        console.log("🔄 Current messages before update:", prev.length);

        // 1) Ignore if already present by ID
        if (prev.some((m) => m.id === formattedIncoming.id)) {
          console.log("⚠️ Message already exists by ID, ignoring duplicate");
          return prev;
        }

        let next = [...prev];

        // 2) If it's my own message, remove the first optimistic "sending" bubble of same type
        if (formattedIncoming.fromMe) {
          const idx = next.findIndex(
            (m) =>
              m.fromMe &&
              m.status === "sending" &&
              m.type === formattedIncoming.type
          );
          if (idx !== -1) {
            console.log(
              "🗑️ Removing optimistic sending placeholder at index",
              idx
            );
            next.splice(idx, 1);
          }
        }

        // 3) Add incoming and keep list sorted by createdAt
        console.log("➕ Adding new message to list");
        next.push(formattedIncoming);
        next.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return next;
      });
      // ✅ NEW: mark as read if it's not my own message
      if (!formattedIncoming.fromMe) {
        socketRef.current.emit("markAsRead", {
          conversationId,
          messageIds: [msg._id],
        });
      }
    });

    // Acknowledgement for sender: replace first optimistic sending bubble with real ID
    s.on("messageSent", (data) => {
      try {
        const realId = data?.messageId;
        if (!realId) return;
        setMessages((prev) => {
          const next = [...prev];
          const idx = next.findIndex((m) => m.fromMe && m.status === "sending");
          if (idx !== -1) {
            next[idx] = { ...next[idx], id: realId, status: "sent" };
          }
          return next;
        });
        // Refresh to replace local file:// URLs with signedUrl from backend
        setTimeout(() => {
          fetchMessages();
        }, 200);
      } catch {}
    });
    s.on("messageRead", (data) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === data?.messageId ? { ...m, status: "seen" } : m
        )
      );
    });

    return () => {
      try {
        console.log("🔌 Cleaning up socket connection");
        s.removeAllListeners();
        s.disconnect();
      } catch {}
    };
  }, [token, myUserId]); // Removed conversationId from dependencies

  // ✅ Send message
  const sendMessage = async () => {
    if (newMessage.trim() === "" || !token || !myUserId) return;

    // Debug: Log the user data being sent
    console.log("🔍 Debug - Sending message:");
    console.log("chatUser:", chatUser);
    console.log("chatUser._id:", chatUser._id);
    console.log("myUserId:", myUserId);
    console.log("token:", token ? "present" : "missing");

    // Validate user IDs
    if (!chatUser._id || chatUser._id === "guest") {
      Alert.alert("Error", "Invalid recipient user ID");
      return;
    }

    if (!myUserId) {
      Alert.alert("Error", "Your user ID is missing");
      return;
    }

    try {
      // Throttle duplicate text sends within 1s for identical payloads
      const now = Date.now();
      const payloadKey = `${chatUser._id}::${newMessage.trim()}`;
      if (
        lastTextSendRef.current.content === newMessage.trim() &&
        lastTextSendRef.current.recipientId === chatUser._id &&
        now - lastTextSendRef.current.ts < 1000
      ) {
        console.log("⏭️ Skipping duplicate text send (throttled)");
        return;
      }
      lastTextSendRef.current = {
        content: newMessage.trim(),
        recipientId: chatUser._id,
        ts: now,
      };

      const tempId = `local-${Date.now()}`;
      const optimistic = {
        id: tempId,
        text: newMessage,
        fromMe: true,
        status: "sending",
        type: "text",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);

      if (!socketRef.current) throw new Error("Socket not connected");

      socketRef.current.emit("sendMessage", {
        recipientId: chatUser._id,
        content: newMessage,
      });

      // Let incoming newMessage replace the optimistic one (handled in listener)
      setNewMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
      // Remove last optimistic sending message on error
      setMessages((prev) =>
        prev.filter((m) => m.status !== "sending" || !m.fromMe)
      );
    }
  };

  //For picking media files
  const pickMedia = () => {
    if (isPickingRef.current) return;
    isPickingRef.current = true;
    launchImageLibrary({ mediaType: "mixed" }, (response) => {
      try {
        if (
          !response?.didCancel &&
          !response?.errorCode &&
          response?.assets?.length
        ) {
          const file = response.assets[0];
          sendMediaMessage(file);
        }
      } finally {
        setTimeout(() => {
          isPickingRef.current = false;
        }, 300);
      }
    });
  };

  // const sendMediaMessage = async (file) => {
  //   console.log("📤 Sending media - File details:", {
  //     uri: file.uri,
  //     type: file.type,
  //     fileName: file.fileName,
  //     fileSize: file.fileSize,
  //     width: file.width,
  //     height: file.height,
  //   });

  //   // Handle camera images which might have different properties
  //   const mimeType = file.type || (file.mimeType ?? "image/jpeg");
  //   const extension = mimeType.split("/")[1] || "jpg";
  //   const displayType = mimeType.startsWith("video")
  //     ? "VIDEO"
  //     : mimeType.startsWith("image")
  //       ? "IMAGE"
  //       : "FILE";

  //   // For camera images, create a better filename
  //   const fileName = file.fileName || `camera-${Date.now()}.${extension}`;

  //   // Dedupe: prevent rapid double-send of same asset
  //   const fingerprint = file.assetId || file.uri;
  //   const fpKey = fingerprint || `${file.uri}-${extension}`;
  //   if (sendingMediaSetRef.current.has(fpKey)) {
  //     console.log("⏭️ Skipping duplicate media send for:", fpKey);
  //     return;
  //   }
  //   sendingMediaSetRef.current.add(fpKey);

  //   // Optimistic UI
  //   const tempId = `local-${Date.now()}`;
  //   setMessages((prev) => [
  //     ...prev,
  //     {
  //       id: tempId,
  //       url: file.uri,
  //       type: displayType,
  //       fromMe: true,
  //       status: "sending",
  //       fileName: fileName,
  //       createdAt: new Date().toISOString(),
  //     },
  //   ]);

  //   try {
  //     const fileUri =
  //       Platform.OS === "android" ? file.uri : file.uri.replace("file://", "");
  //     const base64 = await FileSystem.readAsStringAsync(fileUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     if (!socketRef.current) throw new Error("Socket not connected");

  //     socketRef.current.emit("sendMessage", {
  //       recipientId: chatUser._id,
  //       file: {
  //         name: fileName,
  //         type: mimeType,
  //         data: `data:${mimeType};base64,${base64}`,
  //       },
  //     });

  //     // The message will be replaced by the incoming 'newMessage' event.
  //     setTimeout(() => {
  //       setMessages((prev) =>
  //         prev.map((m) => (m.id === tempId ? { ...m, status: "sent" } : m))
  //       );
  //     }, 8000);
  //   } catch (err) {
  //     console.error("❌ Upload error:", err);
  //     setMessages((prev) => prev.filter((m) => m.id !== tempId));
  //     Alert.alert("Error", "Failed to send image");
  //   } finally {
  //     // allow resending after short cooldown
  //     setTimeout(() => {
  //       sendingMediaSetRef.current.delete(fpKey);
  //     }, 1500);
  //   }
  // };
  const sendMediaMessage = async (file) => {
    // convert size into KB/MB
    const sizeInBytes = file.fileSize || 0;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

    console.log("📤 Sending media - File details:", {
      uri: file.uri,
      type: file.type,
      fileName: file.fileName,
      fileSize: `${sizeInBytes} bytes (${sizeInKB} KB / ${sizeInMB} MB)`,
      width: file.width,
      height: file.height,
    });

    // Handle camera images which might have different properties
    const mimeType = file.type || (file.mimeType ?? "image/jpeg");
    const extension = mimeType.split("/")[1] || "jpg";
    const displayType = mimeType.startsWith("video")
      ? "VIDEO"
      : mimeType.startsWith("image")
        ? "IMAGE"
        : "FILE";

    // For camera images, create a better filename
    const fileName = file.fileName || `camera-${Date.now()}.${extension}`;

    // Dedupe: prevent rapid double-send of same asset
    const fingerprint = file.assetId || file.uri;
    const fpKey = fingerprint || `${file.uri}-${extension}`;
    if (sendingMediaSetRef.current.has(fpKey)) {
      console.log("⏭️ Skipping duplicate media send for:", fpKey);
      return;
    }
    sendingMediaSetRef.current.add(fpKey);

    // Optimistic UI
    const tempId = `local-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        url: file.uri,
        type: displayType,
        fromMe: true,
        status: "sending",
        fileName: fileName,
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

      console.log(
        `🚀 Emitting socket message with ${displayType}, size: ${sizeInMB} MB`
      );

      socketRef.current.emit("sendMessage", {
        recipientId: chatUser._id,
        file: {
          name: fileName,
          type: mimeType,
          data: `data:${mimeType};base64,${base64}`,
        },
      });

      // The message will be replaced by the incoming 'newMessage' event.
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "sent" } : m))
        );
      }, 8000);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      Alert.alert("Error", "Failed to send image");
    } finally {
      // allow resending after short cooldown
      setTimeout(() => {
        sendingMediaSetRef.current.delete(fpKey);
      }, 1500);
    }
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera access is required.");
        return;
      }

      // const result = await ImagePicker.launchCameraAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   allowsEditing: true,
      //   quality: 1,
      // });
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7, // Reduce quality for smaller files
        base64: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const capturedImage = result.assets[0];
        console.log("📸 Photo captured:", capturedImage);

        // Send the captured image
        sendMediaMessage(capturedImage);
      }
    } catch (error) {
      console.error("❌ Camera error:", error);
      Alert.alert("Error", "Failed to capture image");
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={tw`flex-1 bg-white pt-8 pb-2`}>
        {/* Header */}
        <View
          style={tw`flex-row items-center justify-between px-4 py-3 border-b`}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <View style={tw`flex-row items-center mr-16`}>
            <Image
              source={
                chatUser?.avatarUrl
                  ? { uri: chatUser.avatarUrl }
                  : require("../../assets/user.jpg")
              }
              style={tw`w-10 h-10 rounded-full mr-2`}
            />

            <View>
              <Text style={tw`font-semibold`}>{chatUser?.name ?? "Guest"}</Text>
              <Text style={tw`text-xs text-gray-500`}>Last seen recently</Text>
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
          inverted={false}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 96, paddingTop: 8 }}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd?.({ animated: true })
          }
          renderItem={({ item }) => {
            console.log("🎨 Rendering message item:", {
              id: item.id,
              type: item.type,
              url: item.url,
              text: item.text,
              isRead: item.status,
            });

            return (
              <View
                style={tw.style(
                  `px-4 py-2 my-1`,
                  item.fromMe ? "items-end" : "items-start"
                )}
              >
                {/* TEXT */}
                {item.type === "text" && item.text && (
                  <View
                    style={tw.style(
                      "rounded-xl px-4 py-2 flex-row items-center",
                      item.fromMe ? "bg-pink-200" : "bg-gray-100"
                    )}
                  >
                    <Text style={tw`mr-1`}>{item.text}</Text>
                    {/* ✅ status checkmarks */}
                    {item.fromMe && (
                      <Ionicons
                        name={item.isRead ? "checkmark-done" : "checkmark"}
                        size={16}
                        color={item.isRead ? "blue" : "gray"}
                      />
                    )}
                  </View>
                )}

                {/* IMAGE */}
                {item.type === "IMAGE" && item.url && (
                  <View style={tw`relative`}>
                    <Image
                      source={{ uri: item.url }}
                      style={{ width: 200, height: 200, borderRadius: 12 }}
                      resizeMode="cover"
                    />
                    {/* ✅ checkmarks in bottom-right corner */}
                    {item.fromMe && (
                      <View style={tw`absolute bottom-1 right-2`}>
                        <Ionicons
                          name={item.isRead ? "checkmark-done" : "checkmark"}
                          size={18}
                          color={item.isRead ? "blue" : "gray"}
                        />
                      </View>
                    )}
                  </View>
                )}

                {/* VIDEO */}
                {item.type === "VIDEO" && item.url && (
                  <View style={tw`relative`}>
                    <Video
                      source={{ uri: item.url }}
                      style={{ width: 250, height: 250, borderRadius: 12 }}
                      controls
                      resizeMode="contain"
                    />
                    {/* ✅ checkmarks in bottom-right corner */}
                    {item.fromMe && (
                      <View style={tw`absolute bottom-1 right-2`}>
                        <Ionicons
                          name={item.isRead ? "checkmark-done" : "checkmark"}
                          size={18}
                          color={item.isRead ? "blue" : "gray"}
                        />
                      </View>
                    )}
                  </View>
                )}

                {/* DEBUG */}
                {!item.text && !item.url && (
                  <View style={tw`bg-gray-200 rounded-lg px-3 py-2`}>
                    <Text style={tw`text-xs text-gray-500`}>
                      Debug: Type={item.type}, URL=
                      {item.url ? "Present" : "Missing"}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
        />

        {/* Input */}
        <View
          style={[
            tw`px-2 py-2 border-t bg-white`,
            { paddingBottom: Math.max(insets.bottom, 8) },
          ]}
        >
          <View style={tw`flex-row items-center`}>
            <View
              style={tw`flex-1 bg-gray-100 rounded-3xl flex-row items-center px-2 py-1`}
            >
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

              <TouchableOpacity onPress={pickMedia} style={tw`px-2`}>
                <Ionicons name="attach-outline" size={22} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCamera} style={tw`px-2`}>
                <Ionicons name="camera-outline" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>
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
