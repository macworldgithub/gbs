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
import { API_BASE_URL } from "../utils/config";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSession } from "../utils/secureAuth";

export default function GroupConversations({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      // Prefer secure session token (no prompt here), fall back to AsyncStorage if not set
      const session = await getSession({ prompt: false });
      let token = session?.token;
      if (!token) {
        const stored = await AsyncStorage.getItem("userData");
        const parsed = stored ? JSON.parse(stored) : null;
        token = parsed?.token;
      }
      const res = await axios.get(
        `${API_BASE_URL}/messages/conversations?page=1&limit=100`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const list = (res.data?.conversations || []).filter((c) => c.isGroup);
      // Sort by last message createdAt desc; ignore conversation updatedAt so uploads don't reorder
      const sorted = [...list].sort((a, b) => {
        const aTime = new Date(a?.messages?.[0]?.createdAt || 0).getTime();
        const bTime = new Date(b?.messages?.[0]?.createdAt || 0).getTime();
        return bTime - aTime;
      });
      setGroups(sorted);
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
      group: { name: conv.groupName || "Group", groupImage: conv.groupImage },
      participants: conv.participants || [],
    });
  };

  return (
    <View style={tw`flex-1 bg-white pt-10 px-4`}>
      <View style={tw`flex-row  border-b border-gray-200 mb-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-black mb-4 pl-4`}>
          Group Chats
        </Text>
      </View>

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
                source={
                  item.groupImage
                    ? item.groupImage.startsWith("http")
                      ? { uri: item.groupImage }
                      : { uri: `${API_BASE_URL}/${item.groupImage}` }
                    : require("../../assets/user.jpg")
                }
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
        // <FlatList
        //   data={groups}
        //   keyExtractor={(item) => item._id}
        //   renderItem={({ item }) => {
        //     const lastMessage = item.messages?.[0];
        //     const isUnread = lastMessage && !lastMessage.isRead;

        //     return (
        //       <TouchableOpacity
        //         onPress={() => openGroup(item)}
        //         style={tw`flex-row items-center bg-gray-100 p-3 mb-3 rounded-xl`}
        //       >
        //         <Image
        //           source={
        //             item.groupImage
        //               ? { uri: `${API_BASE_URL}/${item.groupImage}` }
        //               : require("../../assets/user.png")
        //           }
        //           style={tw`w-10 h-10 rounded-full mr-3`}
        //         />
        //         <View style={tw`flex-1`}>
        //           <Text style={tw`text-black font-semibold`}>
        //             {item.groupName || "Group"}
        //           </Text>

        //           {/* 🔹 Differentiate based on unread */}
        //           {lastMessage?.content ? (
        //             <Text
        //               numberOfLines={1}
        //               style={tw`${isUnread ? "text-black font-bold" : "text-gray-500"} text-xs`}
        //             >
        //               {lastMessage.content || "[Media]"}
        //             </Text>
        //           ) : lastMessage?.media?.length > 0 ? (
        //             <Text
        //               numberOfLines={1}
        //               style={tw`${isUnread ? "text-black font-bold" : "text-gray-500"} text-xs`}
        //             >
        //               📎 Media
        //             </Text>
        //           ) : null}
        //         </View>
        //       </TouchableOpacity>
        //     );
        //   }}
        // />
      )}
    </View>
  );
}
