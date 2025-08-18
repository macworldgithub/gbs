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

export default function MembersDirectory({ navigation }) {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatStatus, setChatStatus] = useState({}); // store chat status by userId
  // ✅ Fetch members from API
  // ✅ Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user`);
        const data = await response.json();

        const formattedData = data.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user?.activatedPackage?.role?.label || "Member",
          image: user.avatarUrl
            ? user.avatarUrl
            : require("../../assets/user.jpg"),
          liked: false,
        }));

        setMembers(formattedData);

        // Fetch chat status for each user
        formattedData.forEach((member) => checkChatStatus(member.id));
      } catch (error) {
        console.error("❌ Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // ✅ Check if conversation exists with user
  const checkChatStatus = async (userId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/messages/conversation/${userId}`
      );
      const data = await res.json();

      setChatStatus((prev) => ({
        ...prev,
        [userId]: data.length > 0 ? "continue" : "start",
      }));
    } catch (err) {
      console.error("❌ Error checking chat:", err);
    }
  };

  // ✅ Navigate to Chat screen
  const openChat = (user) => {
    navigation.navigate("Chat", { user });
  };

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
