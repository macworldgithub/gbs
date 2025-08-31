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

  const socketRef = useRef(null);
  const listRef = useRef(null);
  const sendingMediaSetRef = useRef(new Set());
  const isPickingRef = useRef(false);

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
      content: msg.content,
      hasMedia: Array.isArray(msg.media) && msg.media.length > 0,
      media: msg.media,
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
      status: msg.isRead ? "seen" : "sent",
      type: messageType,
      createdAt: msg.createdAt || new Date().toISOString(),
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

    // s.on("newMessage", (msg) => {
    //   console.log("📨 Received newMessage:", msg);
    //   if (msg?.conversationId !== conversationId) {
    //     console.log("❌ Message not for current conversation, ignoring");
    //     return;
    //   }

    //   const formattedIncoming = formatMessage(msg, myUserId);
    //   console.log("✅ Formatted incoming message:", formattedIncoming);

    //   // Check if message already exists to prevent duplicates
    //   setMessages((prev) => {
    //     console.log("🔄 Current messages before update:", prev.length);

    //     // Check if this message ID already exists
    //     const messageExists = prev.some((m) => m.id === formattedIncoming.id);
    //     if (messageExists) {
    //       console.log("⚠️ Message already exists, ignoring duplicate");
    //       return prev;
    //     }

    //     const withoutSending = prev.filter((m) => {
    //       // Keep all that aren't my optimistic placeholders
    //       if (!m.fromMe || m.status !== "sending") return true;

    //       // If incoming is media, drop one sending placeholder of the same display type
    //       if (
    //         formattedIncoming.type === "IMAGE" ||
    //         formattedIncoming.type === "VIDEO" ||
    //         formattedIncoming.type === "FILE"
    //       ) {
    //         console.log("🗑️ Dropping sending placeholder for media");
    //         return false; // drop the first match; simple reconciliation
    //       }

    //       // If incoming is text, drop a sending text bubble
    //       if (formattedIncoming.type === "text" && m.type === "text") {
    //         console.log("🗑️ Dropping sending placeholder for text");
    //         return false;
    //       }

    //       return true;
    //     });

    //     console.log("🔄 Messages after filtering:", withoutSending.length);
    //     const result = [...withoutSending, formattedIncoming];
    //     console.log("🔄 Final messages count:", result.length);
    //     return result;
    //   });
    // });

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

        // Check if message already exists by ID
        const messageExistsById = prev.some(
          (m) => m.id === formattedIncoming.id
        );
        if (messageExistsById) {
          console.log("⚠️ Message already exists by ID, ignoring duplicate");
          return prev;
        }

        // For media messages, also check if we have a sending placeholder with the same content
        if (formattedIncoming.type !== "text" && formattedIncoming.url) {
          const existingMediaMessage = prev.find(
            (m) =>
              m.fromMe &&
              m.status === "sending" &&
              m.type === formattedIncoming.type &&
              m.fileName === formattedIncoming.fileName // Compare file names
          );

          if (existingMediaMessage) {
            console.log("🔄 Replacing sending placeholder with actual message");
            return prev.map((m) =>
              m.id === existingMediaMessage.id ? formattedIncoming : m
            );
          }
        }

        // For text messages, check for sending placeholders
        if (formattedIncoming.type === "text" && formattedIncoming.text) {
          const existingTextMessage = prev.find(
            (m) =>
              m.fromMe &&
              m.status === "sending" &&
              m.type === "text" &&
              m.text === formattedIncoming.text
          );

          if (existingTextMessage) {
            console.log(
              "🔄 Replacing text sending placeholder with actual message"
            );
            return prev.map((m) =>
              m.id === existingTextMessage.id ? formattedIncoming : m
            );
          }
        }

        // If no existing placeholder found, add and keep list sorted by createdAt
        console.log("➕ Adding new message to list");
        const next = [...prev, formattedIncoming];
        next.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return next;
      });
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
      const tempId = `local-${Date.now()}`;
      const optimistic = {
        id: tempId,
        text: newMessage,
        fromMe: true,
        status: "sent",
        type: "text",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);

      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: chatUser._id, // ✅ use _id
          content: newMessage,
        }),
      });

      const savedMsg = await res.json();

      if (!res.ok) {
        Alert.alert(
          "Message Error",
          savedMsg.message || "Failed to send message"
        );
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return;
      }

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
  //   console.log("📤 Sending media:", file);

  //   const formData = new FormData();
  //   formData.append("sender", myUserId);
  //   formData.append("recipient", chatUser.id);
  //   formData.append("type", "image");

  //   // Attach file (RN needs uri, type, name)
  //   formData.append("media", {
  //     uri: file.uri,
  //     type: file.type,
  //     name: file.fileName || `upload.${file.type?.split("/")[1]}`,
  //   });

  //   try {
  //     const res = await fetch(`${API_BASE_URL}/messages`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     console.log("✅ Media message response:", data);
  //   } catch (err) {
  //     console.error("❌ Upload error:", err);
  //   }
  // };
  const sendMediaMessage = async (file) => {
    console.log("📤 Sending media:", file);

    const mimeType = file.type || (file.mimeType ?? "image/jpeg");
    const extension = mimeType.split("/")[1] || "jpg";
    const displayType = mimeType.startsWith("video")
      ? "VIDEO"
      : mimeType.startsWith("image")
        ? "IMAGE"
        : "FILE";

    // Dedupe: prevent rapid double-send of same asset
    const fingerprint = file.assetId || file.fileName || file.uri;
    const fpKey = fingerprint || `${file.uri}-${extension}`;
    if (sendingMediaSetRef.current.has(fpKey)) {
      console.log("⏭️ Skipping duplicate media send for:", fpKey);
      return;
    }
    sendingMediaSetRef.current.add(fpKey);

    // Optimistic UI
    const tempId = `local-${Date.now()}`;
    // In sendMediaMessage, store the file name in the optimistic message
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        url: file.uri,
        type: displayType,
        fromMe: true,
        status: "sending",
        fileName: file.fileName || `upload.${extension}`, // Store file name
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
        recipientId: chatUser._id,
        file: {
          name: file.fileName || `upload.${extension}`,
          type: mimeType,
          data: `data:${mimeType};base64,${base64}`,
        },
      });

      // The message will be replaced by the incoming 'newMessage' event.
      // As a fallback, auto-clear the sending state after a timeout if no server ack arrives.
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "sent" } : m))
        );
      }, 8000);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      // allow resending after short cooldown
      setTimeout(() => {
        sendingMediaSetRef.current.delete(fpKey);
      }, 1500);
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
              source={require("../../assets/user.png")}
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
          // renderItem={({ item }) => (
          //   <View
          //     style={tw.style(
          //       `px-4 py-2 my-1`,
          //       item.fromMe ? "items-end" : "items-start"
          //     )}
          //   >
          //     <View
          //       style={tw.style(
          //         "rounded-xl px-4 py-2 flex-row items-center",
          //         item.fromMe ? "bg-pink-200" : "bg-gray-100"
          //       )}
          //     >
          //       <Text style={tw`mr-1`}>{item.text}</Text>
          //       {item.fromMe && item.status && (
          //         <Ionicons
          //           name={
          //             item.status === "sent"
          //               ? "checkmark"
          //               : item.status === "delivered"
          //                 ? "checkmark-done"
          //                 : item.status === "seen"
          //                   ? "checkmark-done-circle"
          //                   : "time"
          //           }
          //           size={16}
          //           color={item.status === "seen" ? "blue" : "gray"}
          //         />
          //       )}
          //     </View>
          //   </View>
          // )}
          renderItem={({ item }) => {
            console.log("🎨 Rendering message item:", {
              id: item.id,
              type: item.type,
              url: item.url,
              text: item.text,
            });

            return (
              <View
                style={tw.style(
                  `px-4 py-2 my-1`,
                  item.fromMe ? "items-end" : "items-start"
                )}
              >
                {item.type === "text" && item.text && (
                  <View
                    style={tw.style(
                      "rounded-xl px-4 py-2 flex-row items-center",
                      item.fromMe ? "bg-pink-200" : "bg-gray-100"
                    )}
                  >
                    <Text style={tw`mr-1`}>{item.text}</Text>
                    {/* ✅ status checkmarks */}
                  </View>
                )}

                {item.type === "IMAGE" && item.url && (
                  <Image
                    source={{ uri: item.url }}
                    style={{ width: 200, height: 200, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                )}

                {item.type === "VIDEO" && item.url && (
                  <Video
                    source={{ uri: item.url }}
                    style={{ width: 250, height: 250 }}
                    controls
                    resizeMode="contain"
                  />
                )}

                {/* Debug: Show message type if no content/url */}
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
              {/* <TouchableOpacity onPress={handlePlus} style={tw`px-2`}>
                <Ionicons name="attach-outline" size={22} color="#6b7280" />
              </TouchableOpacity> */}
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
