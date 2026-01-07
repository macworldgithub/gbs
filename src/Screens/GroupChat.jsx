import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  Platform,
  ActivityIndicator,
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
import Video from "react-native-video";
import * as mime from "react-native-mime-types";
import { launchImageLibrary } from "react-native-image-picker";
import { BlurView } from "@react-native-community/blur";

export default function GroupChat() {
  const navigation = useNavigation();
  const route = useRoute();
  const conversationId = route?.params?.conversationId || null;
  console.log(conversationId, "conversationId of current group chat");
  const group = route?.params?.group || { name: "Group" };
  const initialGroupImage = group?.groupImage
    ? group.groupImage.startsWith("http")
      ? group.groupImage
      : `${API_BASE_URL}/${group.groupImage}`
    : null;
  const initialParticipants = route?.params?.participants || [];

  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1); // Track current page
  const [totalMessages, setTotalMessages] = useState(0); // Track total messages
  const [isLoadingOlder, setIsLoadingOlder] = useState(false); // Loader state
  const listRef = useRef(null);
  const sendingMediaSetRef = useRef(new Set());
  const isPickingRef = useRef(false);
  const [newMessage, setNewMessage] = useState("");
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showViewParticipants, setShowViewParticipants] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [groupImage, setGroupImage] = useState(initialGroupImage);
  // Add these two lines after your other state declarations (around line 55)
  const [searchQuery, setSearchQuery] = useState(""); // ✅ ADD THIS
  const [filteredUsers, setFilteredUsers] = useState([]); // ✅ ADD THIS

  console.log(groupImage, "group image");

  // Load auth and participants
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setToken(parsed?.token || null);
        setMyUserId(parsed?._id || null);
      }
      setParticipants(initialParticipants);
    })();
  }, []);

  // Load available users for adding participants
  // Load available users for adding participants
  // Load available users for adding participants
  const loadAvailableUsers = async () => {
    try {
      setLoadingUsers(true); // ✅ START LOADING
      const stored = await AsyncStorage.getItem("userData");
      const parsed = stored ? JSON.parse(stored) : null;
      const token = parsed?.token;
      const meId = parsed?._id;

      const res = await axios.get(`${API_BASE_URL}/user`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const list = Array.isArray(res.data) ? res.data : res.data?.users || [];
      const currentParticipantIds = participants.map((p) => p._id || p.id);
      const filtered = list.filter(
        (u) =>
          u?._id && u._id !== meId && !currentParticipantIds.includes(u._id)
      );
      setAvailableUsers(filtered);
      setFilteredUsers(filtered);
    } catch (e) {
      console.log("load available users error", e.response?.data || e.message);
      setAvailableUsers([]);
      setFilteredUsers([]); // ✅ ALSO SET FILTERED USERS
    } finally {
      setLoadingUsers(false); // ✅ STOP LOADING (even if error occurs)
    }
  };

  const addParticipant = async (userId) => {
    try {
      const stored = await AsyncStorage.getItem("userData");
      const parsed = stored ? JSON.parse(stored) : null;
      const token = parsed?.token;
      if (!token) {
        Alert.alert("Error", "Please login again");
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/messages/add-participant`,
        { conversationId, participantId: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Participant added successfully");
      await fetchMessages(1);
      setShowAddParticipant(false);
      setSearchQuery("");
      // Refresh participants list
      loadAvailableUsers();
    } catch (e) {
      Alert.alert(
        "Error",
        e.response?.data?.message || e.message || "Failed to add participant"
      );
    }
  };

  const removeParticipant = async (userId, userName) => {
    Alert.alert(
      "Remove Participant",
      `Are you sure you want to remove ${userName} from this group?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem("userData");
              const parsed = stored ? JSON.parse(stored) : null;
              const token = parsed?.token;
              if (!token) {
                Alert.alert("Error", "Please login again");
                return;
              }

              const res = await axios.post(
                `${API_BASE_URL}/messages/remove-participant`,
                { conversationId, participantId: userId },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              Alert.alert("Success", "Participant removed successfully");

              setParticipants((prev) =>
                prev.filter((p) => (p._id || p.id) !== userId)
              );
              setSearchQuery("");

              await fetchMessages(1);
              loadAvailableUsers();
            } catch (e) {
              Alert.alert(
                "Error",
                e.response?.data?.message ||
                  e.message ||
                  "Failed to remove participant"
              );
            }
          },
        },
      ]
    );
  };

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

      setTimeout(() => {
        fetchMessages();
      }, 200);
    });

    s.off("messageRead");
    s.on("messageRead", (data) => {
      const { messageId, userId } = data;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, readBy: [...new Set([...(m.readBy || []), userId])] }
            : m
        )
      );
    });

    return () => {
      try {
        s.removeAllListeners();
        s.disconnect();
      } catch {}
    };
  }, [token, conversationId, myUserId]);

  const fetchMessages = async (newPage = 1, append = false) => {
    if (!token || !myUserId || !conversationId) return;
    if (isLoadingOlder) return; // Prevent multiple fetches
    setIsLoadingOlder(newPage > 1);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/messages/conversation/${conversationId}?page=${newPage}&limit=30`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📥 Raw API response:", res.data);
      const msgs = Array.isArray(res.data?.messages) ? res.data.messages : [];
      setTotalMessages(res.data?.total || 0); // Store total messages
      // Backend returns newest first; sort ascending so newest at bottom
      const sortedByCreatedAt = [...msgs].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      console.log("📥 Messages from API:", msgs);

      const formatted = sortedByCreatedAt.map((m) =>
        formatMessage(m, myUserId)
      );
      console.log("✅ Formatted messages:", formatted);

      setMessages((prev) => {
        if (append) {
          // Prepend older messages, avoid duplicates
          const existingIds = new Set(prev.map((m) => m.id));
          const newMessages = formatted.filter((m) => !existingIds.has(m.id));
          return [...newMessages, ...prev];
        }
        return formatted;
      });

      setPage(newPage); // Update current page

      // Scroll to end only for initial load
      if (newPage === 1) {
        setTimeout(
          () => listRef.current?.scrollToEnd?.({ animated: false }),
          0
        );
      }

      // ✅ Mark unread messages as read
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
    } finally {
      setIsLoadingOlder(false);
    }
  };

  // ✅ Handle scroll to top to load older messages
  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    // Trigger when scrolled to top (within 100 pixels) and there are more messages
    if (
      contentOffset.y < 100 &&
      !isLoadingOlder &&
      messages.length < totalMessages
    ) {
      fetchMessages(page + 1, true); // Fetch next page, append to top
    }
  };

  const formatMessage = (msg) => {
    return {
      id: msg._id,
      text: msg.content || "",
      fromMe: msg.sender?._id === myUserId,
      senderName: msg.sender?.name || "Unknown",
      readBy: msg.readBy || [], // ✅ who has seen it
      time: new Date(msg.createdAt || Date.now()).toLocaleTimeString(),
      type:
        Array.isArray(msg.media) && msg.media.length > 0
          ? msg.media[0].type
          : "text",
      url:
        Array.isArray(msg.media) && msg.media.length > 0
          ? msg.media[0].signedUrl
          : null,
    };
  };

  // Load messages
  useEffect(() => {
    const load = async () => {
      if (!token || !conversationId) return;
      await fetchMessages(1); // Initial load
    };
    load();
  }, [token, conversationId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;
    const tempId = `local-${Date.now()}`;
    // Get current user name from participants or use a default
    const currentUser = participants.find((p) => (p._id || p.id) === myUserId);
    const senderName = currentUser?.name || "You";

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        text: newMessage.trim(),
        fromMe: true,
        senderName,
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
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const captured = result.assets[0];

        const file = {
          uri: captured.uri,
          type: captured.type === "image" ? "image/jpeg" : captured.type, // normalize
          fileName: `camera-${Date.now()}.jpg`, // 👈 camera doesn’t give name
          base64: captured.base64,
          fileSize: captured.fileSize || null,
          assetId: captured.assetId || null,
        };

        await sendMediaMessage(file);
        console.log("📸 Normalized Camera file:", file);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to capture image");
    }
  };
  // Add this function after loadAvailableUsers function
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(availableUsers); // Show all users when search is empty
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const filtered = availableUsers.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(lowercasedQuery)) ||
        (user.email && user.email.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredUsers(filtered);
  };
  const pickMedia = () => {
    if (isPickingRef.current) return;
    isPickingRef.current = true;

    const options = {
      mediaType: "mixed", // allow image + video
      quality: 0.8,
      selectionLimit: 1,
      includeBase64: true, // ✅ needed for backend flow
    };

    launchImageLibrary(options, async (res) => {
      console.log("📸 Media Picker Response:", res);

      try {
        if (res.didCancel) {
          console.log("❌ User cancelled media picker");
        } else if (res.errorCode) {
          console.log("⚠️ Media picker error:", res.errorMessage);
        } else if (res.assets && res.assets.length > 0) {
          const picked = res.assets[0];
          console.log("✅ Picked media:", picked);

          const file = {
            uri: picked.uri,
            type: picked.type, // "image/jpeg" or "video/mp4"
            fileName: picked.fileName || `upload-${Date.now()}`,
            base64: picked.base64, // ✅ added
            fileSize: picked.fileSize,
            duration: picked.duration,
            assetId: picked.id,
          };

          await sendMediaMessage(file);
        }
      } finally {
        setTimeout(() => {
          isPickingRef.current = false;
        }, 300);
      }
    });
  };

  const sendMediaMessage = async (file) => {
    console.log("🚀 Sending media file:", file);

    const mimeType =
      mime.lookup(file.uri) ||
      file.type ||
      (file.uri?.toLowerCase().endsWith(".mp4") ? "video/mp4" : "image/jpeg");

    const extension = mime.extension(mimeType) || "jpg";
    const displayType = mimeType.startsWith("video")
      ? "video"
      : mimeType.startsWith("image")
        ? "image"
        : "file";

    const fingerprint = file.assetId || file.uri;
    const fpKey = fingerprint || `${file.uri}-${extension}`;
    if (sendingMediaSetRef.current.has(fpKey)) return;
    sendingMediaSetRef.current.add(fpKey);

    const tempId = `local-${Date.now()}`;
    const currentUser = participants.find((p) => (p._id || p.id) === myUserId);
    const senderName = currentUser?.name || "You";

    // Optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        url: file.uri,
        type: displayType,
        fromMe: true,
        senderName,
        status: "sending",
        fileName: file.fileName,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      if (!socketRef.current) throw new Error("Socket not connected");

      console.log("📨 Emitting socket sendMessage (with base64 file)");

      socketRef.current.emit("sendMessage", {
        conversationId,
        file: {
          name: file.fileName,
          type: mimeType,
          data: `data:${mimeType};base64,${file.base64}`, // ✅ send base64
        },
      });
      console.log("🖼️ File before upload:", {
        uri: file.uri,
        name: file.fileName,
        type: file.type,
        hasBase64: !!file.base64,
      });

      // No manual S3 upload needed, backend does it ✅
    } catch (err) {
      console.log("❌ sendMediaMessage error", err?.message || err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      Alert.alert("Error", "Failed to send media");
    } finally {
      setTimeout(() => {
        sendingMediaSetRef.current.delete(fpKey);
      }, 1500);
    }
  };

  const handlePickGroupImage = async () => {
    if (isPickingRef.current) return;
    isPickingRef.current = true;
    try {
      const stored = await AsyncStorage.getItem("userData");
      const parsed = stored ? JSON.parse(stored) : null;
      const token = parsed?.token;
      if (!token) {
        Alert.alert("Error", "Please login again");
        return;
      }
      if (!conversationId) {
        Alert.alert("Error", "Missing conversationId");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
        base64: false,
      });
      if (result.canceled) return;

      const asset = result.assets?.[0];
      const uri = asset?.uri;
      if (!uri) {
        Alert.alert("Error", "No image selected");
        return;
      }

      const detectedType = asset.mimeType || mime.lookup(uri) || "image/jpeg";
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const fileType = allowedTypes.includes(detectedType)
        ? detectedType
        : "image/jpeg";
      const extension = mime.extension(fileType) || "jpg";
      const fileName = asset.fileName || `group-${Date.now()}.${extension}`;

      // 3) Get presigned upload URL from backend
      const { data: presign } = await axios.post(
        `${API_BASE_URL}/messages/${conversationId}/group-image/upload-url`,
        { fileName, fileType },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { url: uploadUrl, key: fileKey } = presign || {};
      if (!uploadUrl || !fileKey) {
        Alert.alert("Error", "Failed to get upload URL");
        return;
      }

      // 4) Upload file to S3
      const fileRes = await fetch(uri);
      const blob = await fileRes.blob();
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: blob,
      });
      console.log("✅ PUT Upload Successful");

      // 5) Notify backend (save fileKey to conversation)
      const updateRes = await axios.patch(
        `${API_BASE_URL}/messages/${conversationId}/group-image`,
        { fileKey },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = updateRes?.data;
      const updatedGroupImage = updated?.groupImage || null;
      if (updatedGroupImage) {
        setGroupImage(updatedGroupImage); // signed GET URL from backend
      }

      Alert.alert("Success", "Group image updated successfully!");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to update group image";
      Alert.alert("Error", msg);
    } finally {
      isPickingRef.current = false;
    }
  };

  return (
    <View style={tw`flex-1 bg-white mt-6 mb-8`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-2 border-b border-gray-300 mt-10`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <View style={tw`flex-row items-center mr-24 `}>
          <TouchableOpacity onPress={handlePickGroupImage}>
            <Image
              source={
                groupImage
                  ? { uri: groupImage }
                  : require("../../assets/user.jpg")
              }
              style={tw`w-10 h-10 rounded-full mr-2`}
            />
          </TouchableOpacity>
          <View>
            <Text style={tw`font-semibold text-base`}>
              {/* {group?.name || "Group"} */}
              {group?.name || route.params?.groupName || "Group"}
            </Text>
            <Text style={tw`text-xs text-gray-500`}>Group Conversation</Text>
          </View>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => setShowViewParticipants(true)}
            style={tw`mr-3`}
          >
            <Ionicons name="people" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowAddParticipant(true);
              loadAvailableUsers();
            }}
          >
            <Ionicons name="person-add" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-2`}
        onScroll={handleScroll} // ✅ Detect scroll events
        scrollEventThrottle={16} // Optimize scroll event frequency
        ListHeaderComponent={
          isLoadingOlder ? (
            <View style={tw`py-2 items-center`}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={tw`text-gray-500 text-xs mt-1`}>
                Loading older messages...
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const isMe = item.fromMe;

          return (
            <View
              style={tw.style(
                "px-4 mt-2 w-full",
                isMe ? "items-end" : "items-start"
              )}
            >
              {/* Bubble */}
              <View
                style={tw.style(
                  " rounded-2xl px-4 py-2",
                  isMe ? "bg-red-500" : "bg-gray-200"
                )}
              >
                {/* Media (image/video) */}
                {item.url && item.type === "image" && (
                  <Image
                    source={{ uri: item.url }}
                    style={tw`w-56 h-56 rounded-lg mb-2`}
                    resizeMode="cover"
                  />
                )}
                {item.url && item.type === "video" && (
                  <Video
                    source={{ uri: item.url }}
                    style={tw`w-64 h-40 rounded-lg mb-2`}
                    controls
                    resizeMode="contain"
                    paused={false}
                  />
                )}
                {/* Sender name - only show for others */}
                {!isMe && (
                  <Text
                    style={[tw`text-xs font-semibold mb-1`, { color: "red" }]}
                  >
                    {item.senderName || "Unknown"}
                  </Text>
                )}

                {/* Message text */}
                {item.text ? (
                  <Text
                    style={tw.style(
                      "text-base",
                      isMe ? "text-white" : "text-black"
                    )}
                  >
                    {item.text}
                  </Text>
                ) : null}

                {/* Time and status inside bubble */}
                <View style={tw`flex-row items-center justify-between mt-1`}>
                  <Text
                    style={tw.style(
                      "text-xs",
                      isMe ? "text-pink-100" : "text-gray-500"
                    )}
                  >
                    {item.time}
                  </Text>

                  {isMe && (
                    <Ionicons
                      name={
                        item.readBy?.length >= participants.length - 1 // ✅ everyone except me
                          ? "checkmark-done" // seen by all
                          : item.readBy?.length > 0
                            ? "checkmark-done-outline" // seen by some
                            : "checkmark" // sent only
                      }
                      size={12}
                      color={
                        item.readBy?.length >= participants.length - 1
                          ? "#60a5fa"
                          : "#d1d5db"
                      }
                    />
                  )}
                </View>
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

      {/* Add Participant Modal */}
      {/* Add Participant Modal */}
      <Modal visible={showAddParticipant} transparent animationType="slide">
        <View style={tw`flex-1 bg-black/50 justify-center items-center`}>
          <BlurView
            style={tw`absolute inset-0`}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="rgba(0,0,0,0.5)"
          />
          <View style={tw`w-11/12 bg-white rounded-xl p-4 max-h-96`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold`}>Add Participant</Text>
              <TouchableOpacity onPress={() => setShowAddParticipant(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* ✅ SEARCH INPUT */}
            <View
              style={tw`flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4`}
            >
              <Ionicons name="search" size={20} color="gray" />
              <TextInput
                placeholder="Search by name or email..."
                value={searchQuery}
                onChangeText={handleSearch}
                style={tw`flex-1 ml-2 text-black`}
                placeholderTextColor="gray"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setFilteredUsers(availableUsers);
                  }}
                >
                  <Ionicons name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView>
              {/* ✅ SHOW LOADER WHILE LOADING */}
              {loadingUsers ? (
                <View style={tw`py-10 items-center`}>
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text style={tw`text-gray-500 text-sm mt-2`}>
                    Loading users...
                  </Text>
                </View>
              ) : filteredUsers.length > 0 ? (
                // ✅ SHOW FILTERED USERS WHEN LOADED
                filteredUsers.map((user) => (
                  <TouchableOpacity
                    key={user._id}
                    onPress={() => addParticipant(user._id)}
                    style={tw`flex-row items-center p-3 border-b border-gray-200`}
                  >
                    <Image
                      source={require("../../assets/user.jpg")}
                      style={tw`w-10 h-10 rounded-full mr-3`}
                    />
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-black font-semibold`}>
                        {user.name || "Unnamed"}
                      </Text>
                      {user.email ? (
                        <Text style={tw`text-gray-500 text-xs`}>
                          {user.email}
                        </Text>
                      ) : null}
                    </View>
                    <Ionicons name="add-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                ))
              ) : (
                // ✅ SHOW EMPTY STATE WHEN NO USERS FOUND
                <View style={tw`py-10 items-center`}>
                  <Ionicons name="search-outline" size={48} color="#d1d5db" />
                  <Text style={tw`text-gray-500 text-center text-sm mt-2`}>
                    {searchQuery.trim()
                      ? `No users found for "${searchQuery}"`
                      : "No users available to add"}
                  </Text>
                  {searchQuery.trim() && (
                    <TouchableOpacity
                      onPress={() => {
                        setSearchQuery("");
                        setFilteredUsers(availableUsers);
                      }}
                      style={tw`mt-2`}
                    >
                      <Text style={tw`text-blue-500 text-sm`}>
                        Clear search
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* View Participants Modal */}
      <Modal visible={showViewParticipants} transparent animationType="slide">
        <View style={tw`flex-1 bg-black/50 justify-center items-center`}>
          <BlurView
            style={tw`absolute inset-0`}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View style={tw`w-11/12 bg-white rounded-xl p-4 max-h-96`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold`}>Group Participants</Text>
              <TouchableOpacity onPress={() => setShowViewParticipants(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {participants.map((participant) => (
                <View
                  key={participant._id || participant.id}
                  style={tw`flex-row items-center justify-between p-3 border-b border-gray-200`}
                >
                  <View style={tw`flex-row items-center flex-1`}>
                    <Image
                      source={require("../../assets/user.jpg")}
                      style={tw`w-10 h-10 rounded-full mr-3`}
                    />
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-black font-semibold`}>
                        {participant.name || "Unnamed"}
                      </Text>
                      {participant.email ? (
                        <Text style={tw`text-gray-500 text-xs`}>
                          {participant.email}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {(participant._id || participant.id) !== myUserId && (
                    <TouchableOpacity
                      onPress={() =>
                        removeParticipant(
                          participant._id || participant.id,
                          participant.name || "this user"
                        )
                      }
                      style={tw`p-2`}
                    >
                      <Ionicons
                        name="remove-circle"
                        size={24}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {participants.length === 0 && (
                <Text style={tw`text-gray-500 text-center py-4`}>
                  No participants found
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
