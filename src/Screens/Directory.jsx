// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Image,
//   TouchableOpacity,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import { Ionicons } from "@expo/vector-icons";

// // Initial member data
// const initialMembersData = [
//   {
//     id: "1",
//     name: "John Smith",
//     company: "Smith Logistics",
//     role: "Business Executive Members",
//     image: require("../../assets/john.png"),
//     liked: false,
//   },
//   {
//     id: "2",
//     name: "Sarah Wilson",
//     company: "Wilson Enterprises",
//     role: "Chairman's Partners",
//     image: require("../../assets/sarah.png"),
//     liked: false,
//   },
//   {
//     id: "3",
//     name: "Michael Chen",
//     company: "Chen Transport",
//     role: "Business Members",
//     image: require("../../assets/michael.png"),
//     liked: false,
//   },
//   {
//     id: "4",
//     name: "John Smith",
//     company: "Smith Logistics",
//     role: "Business Executive Members",
//     image: require("../../assets/smith.png"),
//     liked: false,
//   },
//   {
//     id: "5",
//     name: "Sarah Wilson",
//     company: "Wilson Enterprises",
//     role: "Chairman's Partners",
//     image: require("../../assets/wilson.png"),
//     liked: false,
//   },
// ];

// export default function MembersDirectory() {
//   const [search, setSearch] = useState("");
//   const [members, setMembers] = useState(initialMembersData);

//   // Toggle heart liked/unliked
//   const toggleLike = (id) => {
//     const updatedMembers = members.map((member) =>
//       member.id === id ? { ...member, liked: !member.liked } : member
//     );
//     setMembers(updatedMembers);
//   };

//   // Filter based on search text
//   const filteredMembers = members.filter((member) =>
//     member.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <View style={tw`flex-1 bg-white px-4 pt-4`}>
//       <Text style={tw`text-sm text-black mb-4 mt-14 font-bold`}>Members Directory</Text>

//       <View
//         style={tw`flex-row items-center border border-red-400 rounded-full px-4 py-2 mb-4 mt-6`}
//       >
//         <Ionicons name="search" size={18} color="#999" />
//         <TextInput
//           placeholder="Search members....."
//           placeholderTextColor="#999"
//           value={search}
//           onChangeText={setSearch}
//           style={tw`ml-2 flex-1 text-sm text-black`}
//         />
//       </View>

//       <FlatList
//         data={filteredMembers}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={tw`flex-row items-center bg-gray-100 p-3 mb-3 rounded-xl`}
//           >
//             <Image
//               source={item.image}
//               style={tw`w-12 h-12 rounded-full`}
//               resizeMode="cover"
//             />

//             <View style={tw`ml-3 flex-1`}>
//               <Text style={tw`text-black font-semibold text-sm`}>
//                 {item.name}
//               </Text>
//               <Text style={tw`text-red-500 text-sm`}>{item.company}</Text>
//               <Text style={tw`text-gray-500 text-xs`}>{item.role}</Text>
//             </View>

//             <TouchableOpacity onPress={() => toggleLike(item.id)}>
//               <Ionicons
//                 name={item.liked ? "heart" : "heart-outline"}
//                 size={20}
//                 color={item.liked ? "#ed292e" : "#aaa"}
//               />
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MembersDirectory({ navigation }) {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatStatus, setChatStatus] = useState({}); // store chat status by userId
  const [token, setToken] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  // ✅ Fetch members from API
  // ✅ Fetch members
  useEffect(() => {
    const init = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setToken(parsed.token);
          setMyUserId(parsed._id);
        }
      } catch (e) {
        console.error("❌ Error loading userData:", e);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user`);
        const data = await response.json();

        const formattedData = data.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user?.activatedPackage?.role?.label || "Member",
          image: user?.avatarUrl
            ? { uri: user.avatarUrl }
            : require("../../assets/user.jpg"),
          liked: false,
        }));

        setMembers(formattedData);
      } catch (error) {
        console.error("❌ Error fetching members:", error);
      } finally {
        setLoading(false);
      }

      // After token is set, try to prefetch conversation statuses
      try {
        if (!token) return;
        const res = await fetch(
          `${API_BASE_URL}/messages/conversations?page=1&limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok && data?.conversations) {
          const statusMap = {};
          data.conversations.forEach((conv) => {
            const other = (conv.participants || []).find(
              (p) => p._id !== myUserId
            );
            if (other?._id) statusMap[other._id] = "continue";
          });
          setChatStatus(statusMap);
        }
      } catch (e) {
        console.error("❌ Error prefetching conversations:", e);
      }
    };

    init();
  }, [token, myUserId]);

  // ✅ Ensure conversation exists, then open Chat
  const openChat = async (user) => {
    try {
      if (!token) {
        console.warn("Missing token; navigating anyway");
        navigation.navigate("Chat", { user });
        return;
      }

      const res = await fetch(`${API_BASE_URL}/messages/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId: user.id }),
      });
      const conv = await res.json();
      if (!res.ok) {
        console.error("❌ startConversation error:", conv);
        navigation.navigate("Chat", { user });
        return;
      }

      setChatStatus((prev) => ({ ...prev, [user.id]: "continue" }));
      navigation.navigate("Chat", { user, conversationId: conv._id });
    } catch (err) {
      console.error("❌ Error starting conversation:", err);
      navigation.navigate("Chat", { user });
    }
  };

  // (openChat moved above to ensure/create conversation)

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Toggle like/unlike
  const toggleLike = (id) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id ? { ...member, liked: !member.liked } : member
      )
    );
  };

  // ✅ Filter based on search
  // const filteredMembers = members.filter((member) =>
  //   member.name.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <View style={tw`flex-1 bg-white px-4 pt-4`}>
      <Text style={tw`text-sm text-black mb-4 mt-14 font-bold`}>
        Members Directory
      </Text>

      {/* 🔍 Search Bar */}
      <View
        style={tw`flex-row items-center border border-red-400 rounded-full px-4 py-2 mb-4 mt-6`}
      >
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search members..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={tw`ml-2 flex-1 text-sm text-black`}
        />
      </View>

      {/* ✅ Members List */}
      {loading ? (
        <Text style={tw`text-center text-gray-500 mt-10`}>
          Loading members...
        </Text>
      ) : (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={tw`flex-row items-center bg-gray-100 p-3 mb-3 rounded-xl`}
            >
              <Image
                source={item.image}
                style={tw`w-12 h-12 rounded-full`}
                resizeMode="cover"
              />

              <View style={tw`ml-3 flex-1`}>
                <Text style={tw`text-black font-semibold text-sm`}>
                  {item.name}
                </Text>
                <Text style={tw`text-red-500 text-sm`}>{item.email}</Text>
                <Text style={tw`text-gray-500 text-xs`}>{item.role}</Text>
              </View>

              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                <Ionicons
                  name={item.liked ? "heart" : "heart-outline"}
                  size={20}
                  color={item.liked ? "#ed292e" : "#aaa"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`ml-3 bg-red-500 px-3 py-1 rounded-lg`}
                onPress={() => openChat(item)}
              >
                <Text style={tw`text-white text-xs`}>
                  {chatStatus[item.id] === "continue"
                    ? "Continue Chat"
                    : "Start Chat"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
