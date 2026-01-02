// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   FlatList,
//   Alert,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import axios from "axios";
// import { API_BASE_URL } from "../utils/config";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getSession } from "../utils/secureAuth";

// // ==================== YOUR COMMUNITY IMAGES ====================
// const COMMUNITY_IMAGES = {
//   Announcements: null, // Uses megaphone icon
//   Social: require("../../assets/Community.png"),
//   Business: require("../../assets/Community.png"),
//   Wellbeing: require("../../assets/Community.png"),
//   Victoria: require("../../assets/Community.png"),
//   NSW: require("../../assets/Community.png"),
//   Qld: require("../../assets/Community.png"),
//   SA: require("../../assets/Community.png"),
//   "Horse Racing": require("../../assets/Community.png"),
//   "Wine Community": require("../../assets/Community.png"),
//   "GBS Golf": require("../../assets/Community.png"),
// };

// const DEFAULT_COMMUNITY_IMAGE = require("../../assets/Community.png");

// const getCommunityImage = (groupName) => {
//   return COMMUNITY_IMAGES[groupName] || DEFAULT_COMMUNITY_IMAGE;
// };

// // ==================== SAFE TOKEN ====================
// const getAuthToken = async () => {
//   try {
//     const session = await getSession({ prompt: false });
//     if (session?.token) return session.token;

//     const stored = await AsyncStorage.getItem("userData");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       return parsed?.token || null;
//     }
//   } catch (e) {
//     console.log("Token error:", e);
//   }
//   return null;
// };

// // ==================== MAIN COMPONENT ====================
// export default function GroupConversations({ navigation }) {
//   const [activeTab, setActiveTab] = useState("mygroups");
//   const [loading, setLoading] = useState(true);
//   const [myGroups, setMyGroups] = useState([]);
//   const [communityGroups, setCommunityGroups] = useState([]);
//   const [joinedGroupIds, setJoinedGroupIds] = useState([]); // Track joined public groups

//   // Load data for both tabs
//   const loadData = async () => {
//     const token = await getAuthToken();
//     if (!token) {
//       Alert.alert("Session Expired", "Please login again");
//       navigation.replace("Login");
//       return;
//     }

//     try {
//       setLoading(true);

//       if (activeTab === "mygroups") {
//         // My Private Groups
//         const res = await axios.get(
//           `${API_BASE_URL}/messages/conversations?page=1&limit=200`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const privateGroups = (res.data?.conversations || [])
//           .filter((c) => c.isGroup && !c.isPublic)
//           .sort((a, b) => {
//             const aTime = new Date(a.messages?.[0]?.createdAt || 0).getTime();
//             const bTime = new Date(b.messages?.[0]?.createdAt || 0).getTime();
//             return bTime - aTime;
//           });

//         setMyGroups(privateGroups);
//       } else {
//         // Community Public Groups
//         const res = await axios.get(`${API_BASE_URL}/messages/public-groups`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const publicGroups = (res.data?.groups || []).sort((a, b) =>
//           a.groupName.localeCompare(b.groupName)
//         );

//         setCommunityGroups(publicGroups);

//         // Extract current user's joined public groups
//         const userRes = await axios.get(
//           `${API_BASE_URL}/messages/conversations?page=1&limit=200`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const joinedPublic = (userRes.data?.conversations || [])
//           .filter((c) => c.isGroup && c.isPublic)
//           .map((c) => c._id);

//         setJoinedGroupIds(joinedPublic);
//       }
//     } catch (err) {
//       console.log("Load error:", err.response?.data || err.message);
//       Alert.alert("Error", "Failed to load groups");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//     const unsubscribe = navigation.addListener("focus", loadData);
//     return unsubscribe;
//   }, [navigation, activeTab]);

//   // JOIN or LEAVE public group
//   const toggleJoinLeave = async (groupId, groupName) => {
//     const token = await getAuthToken();
//     if (!token) return;

//     const isJoined = joinedGroupIds.includes(groupId);

//     try {
//       if (isJoined) {
//         await axios.post(
//           `${API_BASE_URL}/messages/leave-group/${groupId}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setJoinedGroupIds((prev) => prev.filter((id) => id !== groupId));
//         Alert.alert("Left", `You left ${groupName}`);
//       } else {
//         await axios.post(
//           `${API_BASE_URL}/messages/join-group/${groupId}`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setJoinedGroupIds((prev) => [...prev, groupId]);
//         Alert.alert("Joined!", `Welcome to ${groupName}`);
//       }
//     } catch (err) {
//       Alert.alert(
//         "Error",
//         err.response?.data?.message || "Something went wrong"
//       );
//     }
//   };

//   const openChat = (group) => {
//     navigation.navigate("GroupChat", {
//       conversationId: group._id,
//       group: {
//         name: group.groupName,
//         groupImage: group.groupImage || null,
//       },
//       participants: group.participants || [],
//       isCommunity: true,
//       readOnly: group.adminOnlyPost || false,
//     });
//   };

//   // ==================== RENDER COMMUNITY ITEM (WITH JOIN/LEAVE) ====================
//   const renderCommunityItem = ({ item }) => {
//     const isJoined =
//       joinedGroupIds.includes(item._id) || item.groupName === "Announcements";
//     const lastMsg = item.messages?.[0];

//     // Special card for Announcements
//     if (item.groupName === "Announcements") {
//       return (
//         <TouchableOpacity onPress={() => openChat(item)} style={tw`mx-4 mb-5`}>
//           <View
//             style={tw`bg-red-600 rounded-2xl p-5 flex-row items-center shadow-xl`}
//           >
//             <View
//               style={tw`w-16 h-16 bg-white rounded-full items-center justify-center mr-4`}
//             >
//               <Ionicons name="megaphone" size={34} color="#dc2626" />
//             </View>
//             <View style={tw`flex-1`}>
//               <Text style={tw`text-white text-xl font-bold`}>
//                 Announcements
//               </Text>
//               <Text style={tw`text-red-100 text-sm mt-1`}>
//                 Official updates from GBS admins
//               </Text>
//             </View>
//             <Ionicons name="chevron-forward" size={26} color="white" />
//           </View>
//         </TouchableOpacity>
//       );
//     }

//     // Normal public groups with JOIN / Joined button
//     return (
//       <View
//         style={tw`mx-4 mb-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden`}
//       >
//         <TouchableOpacity
//           onPress={() => isJoined && openChat(item)}
//           style={tw`flex-row items-center p-4 ${!isJoined && "opacity-70"}`}
//         >
//           <Image
//             source={getCommunityImage(item.groupName)}
//             style={tw`w-14 h-14 rounded-xl mr-4`}
//             resizeMode="cover"
//           />
//           <View style={tw`flex-1`}>
//             <Text style={tw`text-lg font-bold text-black`}>
//               {item.groupName}
//             </Text>
//             {lastMsg?.content ? (
//               <Text style={tw`text-sm text-gray-600 mt-1`} numberOfLines={1}>
//                 {lastMsg.content}
//               </Text>
//             ) : lastMsg?.media?.length > 0 ? (
//               <Text style={tw`text-sm text-gray-500 italic`}>Photo</Text>
//             ) : (
//               <Text style={tw`text-sm text-gray-400`}>No messages yet</Text>
//             )}
//           </View>
//         </TouchableOpacity>

//         {/* JOIN / LEAVE BUTTON */}
//         <View style={tw`border-t border-gray-100 px-4 py-3`}>
//           {isJoined ? (
//             <TouchableOpacity
//               onPress={() => toggleJoinLeave(item._id, item.groupName)}
//               style={tw`flex-row items-center justify-center`}
//             >
//               <Ionicons name="checkmark-circle" size={24} color="#dc2626" />
//               <Text style={tw`text-red-600 font-bold ml-2`}>Joined</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               onPress={() => toggleJoinLeave(item._id, item.groupName)}
//               style={tw`bg-red-600 py-2.5 rounded-lg`}
//             >
//               <Text style={tw`text-white text-center font-bold`}>
//                 JOIN GROUP
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   // ==================== RENDER MY GROUP ITEM ====================
//   const renderMyGroupItem = ({ item }) => {
//     const lastMsg = item.messages?.[0];

//     return (
//       <TouchableOpacity
//         onPress={() => openChat(item)}
//         style={tw`flex-row items-center bg-gray-50 mx-4 mb-3 p-4 rounded-xl`}
//       >
//         <Image
//           source={
//             item.groupImage
//               ? {
//                   uri: item.groupImage.startsWith("http")
//                     ? item.groupImage
//                     : `${API_BASE_URL}/${item.groupImage}`,
//                 }
//               : require("../../assets/user.jpg")
//           }
//           style={tw`w-14 h-14 rounded-full mr-4`}
//         />
//         <View style={tw`flex-1`}>
//           <Text style={tw`text-lg font-bold text-black`}>{item.groupName}</Text>
//           {lastMsg?.content ? (
//             <Text style={tw`text-sm text-gray-600 mt-1`} numberOfLines={1}>
//               {lastMsg.content}
//             </Text>
//           ) : (
//             <Text style={tw`text-sm text-gray-400`}>No messages yet</Text>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // ==================== MAIN RETURN ====================
//   return (
//     <View style={tw`flex-1 bg-gray-50`}>
//       {/* Header */}
//       <View
//         style={tw`flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-200 mt-12`}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={28} color="black" />
//         </TouchableOpacity>
//         <Text style={tw`text-lg font-bold text-black ml-2`}>Group Chats</Text>
//         <View style={tw`flex-row bg-gray-100 rounded-full p-1 ml-4`}>
//           <TouchableOpacity
//             onPress={() => setActiveTab("mygroups")}
//             style={tw`px-3 py-2 rounded-full ${activeTab === "mygroups" ? "bg-red-600" : ""}`}
//           >
//             <Text
//               style={tw`${activeTab === "mygroups" ? "text-white font-bold" : "text-gray-700"} text-xs`}
//             >
//               My Groups
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setActiveTab("community")}
//             style={tw`px-3 py-2 rounded-full ${activeTab === "community" ? "bg-red-600" : ""}`}
//           >
//             <Text
//               style={tw`${activeTab === "community" ? "text-white font-bold" : "text-gray-700"} text-xs`}
//             >
//               Community
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {loading ? (
//         <View style={tw`flex-1 justify-center items-center`}>
//           <ActivityIndicator size="large" color="#dc2626" />
//           <Text style={tw`mt-4 text-gray-600`}>Loading groups...</Text>
//         </View>
//       ) : activeTab === "mygroups" ? (
//         myGroups.length === 0 ? (
//           <View style={tw`flex-1 justify-center items-center px-8`}>
//             <Text style={tw`text-center text-gray-500 text-lg`}>
//               No group conversations yet.
//             </Text>
//           </View>
//         ) : (
//           <FlatList
//             data={myGroups}
//             keyExtractor={(item) => item._id}
//             renderItem={renderMyGroupItem}
//             contentContainerStyle={tw`pt-4 pb-24`}
//             showsVerticalScrollIndicator={false}
//             refreshing={loading}
//             onRefresh={loadData}
//           />
//         )
//       ) : (
//         <FlatList
//           data={communityGroups}
//           keyExtractor={(item) => item._id}
//           renderItem={renderCommunityItem}
//           contentContainerStyle={tw`pt-4 pb-24`}
//           showsVerticalScrollIndicator={false}
//           refreshing={loading}
//           onRefresh={loadData}
//         />
//       )}
//     </View>
//   );
// }

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   FlatList,
//   Alert,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import axios from "axios";
// import { API_BASE_URL } from "../utils/config";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getSession } from "../utils/secureAuth";

// // ================= IMAGES =================
// const COMMUNITY_IMAGES = {
//   Announcements: null,
//   Social: require("../../assets/Community.png"),
//   Business: require("../../assets/Community.png"),
//   Wellbeing: require("../../assets/Community.png"),
//   Victoria: require("../../assets/Community.png"),
//   NSW: require("../../assets/Community.png"),
//   Qld: require("../../assets/Community.png"),
//   SA: require("../../assets/Community.png"),
//   "Horse Racing": require("../../assets/Community.png"),
//   "Wine Community": require("../../assets/Community.png"),
//   "GBS Golf": require("../../assets/Community.png"),
// };

// const DEFAULT_COMMUNITY_IMAGE = require("../../assets/Community.png");

// const getCommunityImage = (name) =>
//   COMMUNITY_IMAGES[name] || DEFAULT_COMMUNITY_IMAGE;

// // ================= TOKEN =================
// const getAuthToken = async () => {
//   const session = await getSession({ prompt: false });
//   if (session?.token) return session.token;

//   const stored = await AsyncStorage.getItem("userData");
//   return stored ? JSON.parse(stored)?.token : null;
// };

// // ================= MAIN =================
// export default function GroupConversations({ navigation }) {
//   const [activeTab, setActiveTab] = useState("mygroups");
//   const [loading, setLoading] = useState(true);

//   const [myGroups, setMyGroups] = useState([]);
//   const [communityGroups, setCommunityGroups] = useState([]);
//   const [publicGroups, setPublicGroups] = useState([]);
//   const [joinedGroupIds, setJoinedGroupIds] = useState([]);

//   const loadData = async () => {
//     const token = await getAuthToken();
//     if (!token) return;

//     try {
//       setLoading(true);

//       const convRes = await axios.get(
//         `${API_BASE_URL}/messages/conversations?page=1&limit=200`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const allConversations = convRes.data?.conversations || [];

//       setMyGroups(allConversations.filter((c) => c.isGroup && !c.isPublic));

//       const joinedPublic = allConversations
//         .filter((c) => c.isGroup && c.isPublic)
//         .map((c) => c._id);

//       setJoinedGroupIds(joinedPublic);

//       const publicRes = await axios.get(
//         `${API_BASE_URL}/messages/public-groups`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const groups = publicRes.data?.groups || [];

//       setCommunityGroups(groups.filter((g) => g.groupName === "Announcements"));
//       setPublicGroups(groups.filter((g) => g.groupName !== "Announcements"));
//     } catch (e) {
//       Alert.alert("Error", "Failed to load groups");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const joinedPublicGroups = publicGroups.filter((g) =>
//     joinedGroupIds.includes(g._id)
//   );
//   useEffect(() => {
//     loadData();
//   }, [activeTab]);

//   const toggleJoinLeave = async (id) => {
//     const token = await getAuthToken();
//     const joined = joinedGroupIds.includes(id);

//     const url = joined
//       ? `/messages/leave-group/${id}`
//       : `/messages/join-group/${id}`;

//     await axios.post(
//       `${API_BASE_URL}${url}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setJoinedGroupIds((prev) =>
//       joined ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const openChat = (group) => {
//     navigation.navigate("GroupChat", {
//       conversationId: group._id,
//       readOnly: group.groupName === "Announcements",
//     });
//   };

//   // ================= RENDER ITEM =================
//   const renderGroup = ({ item }) => {
//     const joined = joinedGroupIds.includes(item._id);

//     return (
//       <View style={tw`mx-4 mb-3 bg-white rounded-xl border`}>
//         <TouchableOpacity
//           onPress={() => joined && openChat(item)}
//           style={tw`flex-row p-4 ${!joined && "opacity-60"}`}
//         >
//           <Image
//             source={getCommunityImage(item.groupName)}
//             style={tw`w-12 h-12 rounded-lg mr-4`}
//           />
//           <Text style={tw`text-lg font-bold flex-1`}>{item.groupName}</Text>
//         </TouchableOpacity>

//         {item.groupName !== "Announcements" && (
//           <TouchableOpacity
//             onPress={() => toggleJoinLeave(item._id)}
//             style={tw`border-t py-2`}
//           >
//             <Text style={tw`text-center text-red-600 font-bold`}>
//               {joined ? "Joined" : "Join Group"}
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   // ================= UI =================
//   return (
//     <View style={tw`flex-1 bg-gray-50`}>
//       {/* Header */}
//       <View style={tw`flex-row items-center px-4 py-4 bg-white mt-12`}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} />
//         </TouchableOpacity>
//         <Text style={tw`text-lg font-bold ml-4`}>Group Chats</Text>
//       </View>

//       {/* Tabs */}
//       <View style={tw`flex-row justify-around bg-white py-2`}>
//         {["mygroups", "community", "public"].map((tab) => (
//           <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
//             <Text
//               style={tw`font-bold ${
//                 activeTab === tab ? "text-red-600" : "text-gray-500"
//               }`}
//             >
//               {tab === "mygroups"
//                 ? "My Groups"
//                 : tab === "community"
//                   ? "Community"
//                   : "Public Groups"}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {loading ? (
//         <ActivityIndicator style={tw`mt-14`} color="red" size="large" />
//       ) : (
//         <>
//           {/* Message only in Public Groups tab when NO groups joined */}
//           {activeTab === "public" && joinedGroupIds.length === 0 && (
//             <View
//               style={tw`mx-4 mt-6 mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-5 shadow-sm`}
//             >
//               <Text
//                 style={tw`text-black-800 text-base text-center font-medium`}
//               >
//                 You are not a contributor to these Groups
//               </Text>
//               <Text style={tw`text-yellow-700 text-sm text-center mt-1`}>
//                 Join any group to start participating!
//               </Text>
//             </View>
//           )}

//           {/* Show the list only if there are items OR not showing the message */}
//           <FlatList
//             data={
//               activeTab === "mygroups"
//                 ? myGroups
//                 : activeTab === "community"
//                   ? communityGroups
//                   : publicGroups
//             }
//             keyExtractor={(item) => item._id}
//             renderItem={renderGroup}
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={
//               activeTab !== "public" ? (
//                 <Text style={tw`text-center text-gray-500 mt-10`}>
//                   No groups available at the moment
//                 </Text>
//               ) : null // Don't show empty message in public tab — we already show the yellow box
//             }
//             contentContainerStyle={tw`pb-20`}
//           />
//         </>
//       )}
//     </View>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSession } from "../utils/secureAuth";

// ================= IMAGES =================
const COMMUNITY_IMAGES = {
  Announcements: null,
  Social: require("../../assets/Community.png"),
  Business: require("../../assets/Community.png"),
  Wellbeing: require("../../assets/Community.png"),
  Victoria: require("../../assets/Community.png"),
  NSW: require("../../assets/Community.png"),
  Qld: require("../../assets/Community.png"),
  SA: require("../../assets/Community.png"),
  "Horse Racing": require("../../assets/Community.png"),
  "Wine Community": require("../../assets/Community.png"),
  "GBS Golf": require("../../assets/Community.png"),
};

const DEFAULT_COMMUNITY_IMAGE = require("../../assets/Community.png");

const getCommunityImage = (name) =>
  COMMUNITY_IMAGES[name] || DEFAULT_COMMUNITY_IMAGE;

// ================= TOKEN =================
const getAuthToken = async () => {
  const session = await getSession({ prompt: false });
  if (session?.token) return session.token;

  const stored = await AsyncStorage.getItem("userData");
  return stored ? JSON.parse(stored)?.token : null;
};

// ================= MAIN =================
export default function GroupConversations({ navigation }) {
  const [activeTab, setActiveTab] = useState("mygroups");
  const [loading, setLoading] = useState(true);

  const [myGroups, setMyGroups] = useState([]);
  const [communityGroups, setCommunityGroups] = useState([]);
  const [publicGroups, setPublicGroups] = useState([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState([]);

  const loadData = async () => {
    const token = await getAuthToken();
    if (!token) return;

    try {
      setLoading(true);

      // Fetch all conversations to get user's joined groups
      const convRes = await axios.get(
        `${API_BASE_URL}/messages/conversations?page=1&limit=200`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allConversations = convRes.data?.conversations || [];
      setMyGroups(allConversations.filter((c) => c.isGroup && !c.isPublic));

      const joinedPublic = allConversations
        .filter((c) => c.isGroup && c.isPublic)
        .map((c) => c._id);
      setJoinedGroupIds(joinedPublic);

      // Fetch all public groups
      const publicRes = await axios.get(
        `${API_BASE_URL}/messages/public-groups`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const groups = publicRes.data?.groups || [];

      // Community groups: only "Announcements" is admin-only
      setCommunityGroups(groups.filter((g) => g.groupName === "Announcements"));
      setPublicGroups(groups.filter((g) => g.groupName !== "Announcements"));
    } catch (e) {
      Alert.alert("Error", "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const toggleJoinLeave = async (id) => {
    const token = await getAuthToken();
    const joined = joinedGroupIds.includes(id);

    const url = joined
      ? `/messages/leave-group/${id}`
      : `/messages/join-group/${id}`;

    try {
      await axios.post(
        `${API_BASE_URL}${url}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinedGroupIds((prev) =>
        joined ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } catch (err) {
      Alert.alert("Error", "Failed to update group membership");
    }
  };

  const openChat = (group) => {
    navigation.navigate("GroupChat", {
      conversationId: group._id,
      readOnly: group.groupName === "Announcements",
    });
  };

  // ================= RENDER ITEM =================
  const renderGroup = ({ item }) => {
    const joined = joinedGroupIds.includes(item._id);
    const isAnnouncements = item.groupName === "Announcements";

    return (
      <View style={tw`mx-4 mb-3 bg-white rounded-xl border`}>
        <TouchableOpacity
          onPress={() => (joined || isAnnouncements) && openChat(item)}
          style={tw`flex-row p-4 ${!joined && !isAnnouncements ? "opacity-60" : ""}`}
        >
          <Image
            source={getCommunityImage(item.groupName)}
            style={tw`w-12 h-12 rounded-lg mr-4`}
          />
          <Text style={tw`text-lg font-bold flex-1`}>
            {item.groupName} {isAnnouncements ? "(Admin Only)" : ""}
          </Text>
        </TouchableOpacity>

        {!isAnnouncements && (
          <TouchableOpacity
            onPress={() => toggleJoinLeave(item._id)}
            style={tw`border-t py-2`}
          >
            <Text style={tw`text-center text-red-600 font-bold`}>
              {joined ? "Joined" : "Join Group"}
            </Text>
          </TouchableOpacity>
        )}

        {!joined && !isAnnouncements && (
          <Text style={tw`text-center text-gray-800 text-xs py-1`}>
            You are not a contributor to this group. 
          </Text>
        )}
      </View>
    );
  };

  // ================= UI =================
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-4 bg-white mt-12`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold ml-4`}>Group Chats</Text>
      </View>

      {/* Tabs */}
      <View style={tw`flex-row justify-around bg-white py-2`}>
        {["mygroups", "community", "public"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={tw`font-bold ${activeTab === tab ? "text-red-600" : "text-gray-500"}`}
            >
              {tab === "mygroups"
                ? "My Groups"
                : tab === "community"
                  ? "Community"
                  : "Public Groups"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={tw`mt-14`} color="red" size="large" />
      ) : (
        <FlatList
          data={
            activeTab === "mygroups"
              ? myGroups
              : activeTab === "community"
                ? communityGroups
                : publicGroups
          }
          keyExtractor={(item) => item._id}
          renderItem={renderGroup}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={tw`text-center text-gray-500 mt-10`}>
              No groups available at the moment
            </Text>
          }
          contentContainerStyle={tw`pb-20`}
        />
      )}
    </View>
  );
}
