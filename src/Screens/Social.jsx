// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
// import tw from "tailwind-react-native-classnames";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_BASE_URL } from "../utils/config";
// import axios from "axios";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// export default function Conversations({ navigation }) {
//   const [token, setToken] = useState(null);
//   const [myUserId, setMyUserId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const stored = await AsyncStorage.getItem("userData");
//         if (stored) {
//           const parsed = JSON.parse(stored);
//           setToken(parsed.token);
//           setMyUserId(parsed._id);
//         }
//       } catch (e) {}
//     };
//     init();
//   }, []);
//   useEffect(() => {
//     const fetchConversations = async () => {
//       if (!token || !myUserId) return;
//       setLoading(true);
//       try {
//         const { data } = await axios.get(
//           `${API_BASE_URL}/messages/conversations`,
//           {
//             params: { page: 1, limit: 50 },
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log("✅ Conversations GET response:", data);

//         // ✅ Filter out group chats
//         const conversations = Array.isArray(data?.conversations)
//           ? data.conversations.filter((c) => !c.isGroup)
//           : [];

//         const mapped = conversations.map((c) => {
//           const other =
//             (c.participants || []).find((p) => p._id !== myUserId) || {};
//           const last =
//             Array.isArray(c.messages) && c.messages.length > 0
//               ? c.messages[0]
//               : null;

//           return {
//             id: c._id,
//             otherUser: {
//               id: other._id,
//               name: other.name || other.email || "Unknown",
//               avatarUrl: other.avatarUrl || null,
//             },
//             lastText: last?.content || "",
//           };
//         });

//         console.log("✅ Conversations mapped for UI:", mapped);
//         setItems(mapped);
//       } catch (e) {
//         console.log(
//           "❌ Conversations GET error:",
//           e?.response?.data || e.message
//         );
//         setItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchConversations();
//   }, [token, myUserId]);

//   const openChat = (item) => {
//     console.log("➡️ Open chat: ", item);
//     navigation.navigate("Chat", {
//       user: {
//         id: item.otherUser.id,
//         name: item.otherUser.name,
//         avatarUrl: item.otherUser.avatarUrl, // 👈 include this
//       },
//       conversationId: item.id,
//     });
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => openChat(item)}
//       style={tw`flex-row items-center p-3 border-b border-gray-200`}
//     >
//       <Image
//         source={
//           item.otherUser?.avatarUrl
//             ? { uri: item.otherUser.avatarUrl }
//             : require("../../assets/user.jpg")
//         }
//         style={tw`w-10 h-10 rounded-full`}
//       />

//       <View style={tw`ml-3 flex-1`}>
//         <Text style={tw`text-base font-semibold`}>{item.otherUser.name}</Text>
//         <Text style={tw`text-sm text-gray-600`} numberOfLines={1}>
//           {item.lastText}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={tw`flex-1 bg-white mt-16`}>
//       <View style={tw`p-4 flex-row  items-center border-b border-gray-200`}>

//         <Text style={tw`text-lg font-bold pl-4`}>Conversations</Text>
//       </View>
//       {loading ? (
//         <Text style={tw`text-center text-gray-500 mt-10`}>Loading...</Text>
//       ) : (
//         <FlatList
//           data={items}
//           keyExtractor={(i) => i.id}
//           renderItem={renderItem}
//         />
//       )}
//     </View>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "../utils/storage"; // ✅ import your storage.js

const fallbackImage = require("../../assets/fallback.png");
const tabs = [];
const states = ["All", "VIC", "NSW", "QLD", "SA", "WA"];
const API_URL = "https://gbs.westsidecarcare.com.au/events";

const Social = () => {
  const [activeTab, setActiveTab] = useState("Events");
  const [selectedState, setSelectedState] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [booked, setBooked] = useState(false);
  const loggedInUserId = user?.user?._id || user?._id || user?.sub;

  const [form, setForm] = useState({
    title: "",
    description: "",
    state: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getUserData();
      console.log("Fetched user data:", u);
      setUser(u);
    };
    fetchUser();
  }, []);

  const fetchEvents = async (stateFilter = "All") => {
    try {
      setLoading(true);

      let url = `${API_URL}?&limit=100`;
      if (stateFilter !== "All") {
        url += `&state=${stateFilter}`;
      }

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("Fetched events data:", data);

      if (res.ok) {
        setEvents(data);
      } else {
        Alert.alert("Error", data.message || "Failed to load events");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectedState);
  }, [selectedState]);

  // const openEditModal = (event) => {
  //   setEditingEvent(event);
  //   setForm({
  //     title: event.title || "",
  //     description: event.description || "",
  //     state: event.state || "",
  //     startDate: event.startDate || "",
  //     endDate: event.endDate || "",
  //     imageUrl: event.imageUrl || "",
  //   });
  //   setModalVisible(true);
  // };

  // const submitUpdate = async () => {
  //     if (!editingEvent) return;

  //     try {
  //         const res = await fetch(`${API_URL}/${editingEvent._id}`, {
  //             method: "PUT",
  //             headers: {
  //                 Accept: "application/json",
  //                 "Content-Type": "application/json",
  //                 Authorization: `Bearer ${user?.token}`,
  //             },
  //             body: JSON.stringify({
  //                 title: form.title,
  //                 description: form.description,
  //                 state: form.state,
  //                 area: {
  //                     type: "MultiPolygon",
  //                     coordinates: [
  //                         [
  //                             [
  //                                 [151.2093, -33.8688],
  //                                 [151.2094, -33.8689],
  //                                 [151.2095, -33.8688],
  //                                 [151.2093, -33.8688],
  //                             ],
  //                         ],
  //                     ],
  //                 },
  //                 openToAll: true,
  //                 startDate: form.startDate,
  //                 endDate: form.endDate,
  //                 roles: ["60f8a2f0e1d3c2001cf6b1e7"],
  //                 imageUrl: form.imageUrl,
  //             }),
  //         });

  //         if (res.ok) {
  //            const updatedEvent = await res.json(); // Server se updated event data get karo
  //         setEvents(events.map(event => event._id === updatedEvent._id ? updatedEvent : event)); // Local events state update karo
  //         Alert.alert("Success", "Event updated successfully!");
  //         setModalVisible(false);
  //         } else {
  //             const err = await res.json();
  //             Alert.alert("Error", err.message || "Update failed");
  //         }
  //     } catch (error) {
  //         Alert.alert("Error", error.message);
  //     }
  // };

  // const submitUpdate = async () => {
  //   if (!editingEvent) return;

  //   try {
  //     const res = await fetch(`${API_URL}/${editingEvent._id}`, {
  //       method: "PUT",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //       body: JSON.stringify({
  //         title: form.title,
  //         description: form.description,
  //         state: form.state,
  //         area: {
  //           type: "MultiPolygon",
  //           coordinates: [
  //             [
  //               [151.2093, -33.8688],
  //               [151.2094, -33.8689],
  //               [151.2095, -33.8688],
  //               [151.2093, -33.8688],
  //             ],
  //           ],
  //         },
  //         openToAll: true,
  //         startDate: form.startDate,
  //         endDate: form.endDate,
  //         roles: ["60f8a2f0e1d3c2001cf6b1e7"],
  //         // NEW: Removed imageUrl – it's handled separately via /image endpoints
  //       }),
  //     });

  //     if (res.ok) {
  //       const updatedEvent = await res.json(); // Server se updated event data get karo
  //       console.log("Updated Event from PUT:", updatedEvent); // NEW: Debug log to check if imageUrl is in response
  //       setEvents(events.map(event => event._id === updatedEvent._id ? updatedEvent : event)); // Local events state update karo
  //       Alert.alert("Success", "Event updated successfully!");
  //       setModalVisible(false);
  //       fetchEvents(selectedState); // NEW: Call fetchEvents for full refresh/sync from server
  //     } else {
  //       const err = await res.json();
  //       Alert.alert("Error", err.message || "Update failed");
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", error.message);
  //   }
  // };

  // const handleDelete = async (event) => {
  //   const loggedInUserId = user?.user?._id || user?._id || user?.sub;

  //   if (event.creator?._id !== loggedInUserId) {
  //     Alert.alert("Only the event creator can delete this event");
  //     return;
  //   }

  //   try {
  //     const res = await fetch(`${API_URL}/${event._id}`, {
  //       method: "DELETE",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     });

  //     if (res.ok) {
  //       Alert.alert("Deleted", "Event deleted successfully!");
  //       fetchEvents(selectedState);
  //     } else {
  //       const err = await res.json();
  //       Alert.alert("Error", err.message || "Delete failed");
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", error.message);
  //   }
  // };

  const handleBookEvent = async (eventId) => {
    try {
      const token = user?.token || user?.accessToken || user?.idToken;

      if (!token) {
        Alert.alert("Error", "You must be logged in to book an event.");
        return;
      }
      const res = await fetch(`${API_URL}/${eventId}/book_event`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      console.log("Booking response:", data);

      if (res.ok) {
        Alert.alert("Success", "You have successfully booked this event!");
        setBooked(true);
        fetchEvents(selectedState);
      } else {
        const err = await res.json();
        console.log("Booking error:", err);
        Alert.alert("Error", err.message || "Failed to book event");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  const handleImageUpload = (eventId) => {
    const options = {
      mediaType: "photo",
      quality: 1,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert("Error", response.errorMessage);
        return;
      }

      try {
        const asset = response.assets[0];
        const fileUri = asset.uri;
        const fileName = asset.fileName || fileUri.split("/").pop();
        const fileType = asset.type || "image/jpeg";

        const token = user?.token || user?.accessToken || user?.idToken;

        // Step 2: Get Presigned URL
        const presignedRes = await fetch(
          `${API_URL}/${eventId}/image/upload-url?fileName=${fileName}&fileType=${fileType}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { url, key } = await presignedRes.json();

        console.log("Presigned URL:", url);
        console.log("File Key:", key);

        // Step 3: Upload to S3
        const img = await fetch(fileUri);
        const blob = await img.blob();

        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": fileType },
          body: blob,
        });

        // Step 4: Save fileKey in DB
        await fetch(`${API_URL}/${eventId}/image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileKey: key }),
        });

        // Step 5: Fetch final image URL
        const finalRes = await fetch(`${API_URL}/${eventId}/image`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const finalData = await finalRes.json();
        console.log("Final Image URL:", finalData.url);

        // Update form for modal preview
        setForm({ ...form, imageUrl: finalData.url });

        // NEW: Update local events state immediately to reflect image in card
        setEvents(
          events.map((e) =>
            e._id === eventId ? { ...e, imageUrl: finalData.url } : e
          )
        );

        Alert.alert("Success", "Image uploaded successfully!");
      } catch (err) {
        console.error(err);
        Alert.alert("Error", err.message);
      }
    });
  };

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mt-12 mb-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View>
          <Text style={tw`text-xl font-bold`}>Social</Text>
          <Text style={tw`text-sm text-gray-600`}>Community & Events</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={tw`flex-row mb-4`}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={tw`px-4 py-2 mr-2 rounded-md ${
              activeTab === tab ? "bg-red-500" : "bg-gray-100"
            }`}
          >
            <Text
              style={tw`text-sm ${
                activeTab === tab ? "text-white" : "text-gray-700"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* States Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mb-4`}
      >
        {states.map((st) => (
          <TouchableOpacity
            key={st}
            onPress={() => setSelectedState(st)}
            style={tw`px-4 py-2 mr-2 rounded-md border ${
              selectedState === st
                ? "bg-red-100 border-red-500"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              style={tw`text-sm ${
                selectedState === st ? "text-red-600" : "text-gray-700"
              }`}
            >
              {st}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Loader */}
      {loading && (
        <ActivityIndicator size="large" color="red" style={tw`mt-4`} />
      )}

      {/* Events */}
      {activeTab === "Events" && !loading && events.length === 0 && (
        <Text style={tw`text-gray-500 text-center mt-6`}>No events found</Text>
      )}

      {activeTab === "Events" &&
        events.map((event) => (
          <TouchableOpacity
            key={event._id}
            onPress={() =>
              navigation.navigate("EventDetail", { eventId: event._id })
            }
            style={tw`bg-gray-50 rounded-lg mb-4 overflow-hidden border border-gray-300 p-4`}
          >
            {event.imageUrl ? (
              <Image
                source={{ uri: event.imageUrl }}
                style={tw`w-full h-40`}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={fallbackImage}
                style={tw`w-full h-40`}
                resizeMode="cover"
              />
            )}
            <View style={tw`flex-row justify-between items-center`}>
              {event?.isFeatured && (
                <View
                  style={tw`absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full`}
                >
                  <Text style={tw`text-white text-xs font-bold`}>FEATURED</Text>
                </View>
              )}
              <Text style={tw`text-base font-bold text-gray-800`}>
                {event.title}
              </Text>
              {/* <View style={tw`flex-row`}>
                <TouchableOpacity onPress={() => openEditModal(event)}>
                  <MaterialIcons
                    name="edit"
                    size={22}
                    color="blue"
                    style={tw`mr-3`}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(event)}>
                  <MaterialIcons name="delete" size={22} color="red" />
                </TouchableOpacity>
              </View> */}
            </View>

            {/* Date */}
            <View style={tw`flex-row items-center mt-2`}>
              <MaterialIcons name="event" size={16} color="gray" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>
                {new Date(event.startDate).toDateString()}
              </Text>
            </View>

            {/* State */}
            <View style={tw`flex-row items-center mt-1`}>
              <Entypo name="map" size={16} color="gray" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>
                {typeof event?.state === "string" && event.state.trim() !== ""
                  ? event.state
                  : "N/A"}
              </Text>
            </View>

            {/* Location */}
            <View style={tw`flex-row items-center mt-1`}>
              <MaterialIcons name="location-pin" size={16} color="gray" />
              <Text
                style={tw`text-sm text-gray-600 ml-2 flex-1`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {Array.isArray(event?.locationNames)
                  ? event.locationNames.length > 0
                    ? event.locationNames.join(", ")
                    : "N/A"
                  : typeof event?.locationNames === "string" &&
                      event.locationNames.trim() !== ""
                    ? event.locationNames
                    : "N/A"}
              </Text>
            </View>

            {/* Creator */}
            <View style={tw`flex-row items-center mt-1`}>
              {event.creator?.avatarUrl ? (
                <Image
                  source={{ uri: event.creator.avatarUrl }}
                  style={tw`w-6 h-6 rounded-full mr-2`}
                />
              ) : (
                <MaterialIcons
                  name="person"
                  size={20}
                  color="gray"
                  style={tw`mr-2`}
                />
              )}
              <Text style={tw`text-sm text-gray-600`}>
                Created by {event.creator?.name || "Unknown"}
              </Text>
            </View>

            {/* Attendees */}
            {/* <TouchableOpacity
              style={tw`flex-row items-center mt-2`}
              onPress={() =>
                setExpandedEvent(expandedEvent === event._id ? null : event._id)
              }
            >
              <MaterialIcons name="people" size={16} color="gray" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>
                {event.attendees?.length || 0} attending
              </Text>
              <MaterialIcons
                name={
                  expandedEvent === event._id ? "expand-less" : "expand-more"
                }
                size={20}
                color="gray"
                style={tw`ml-2`}
              />
            </TouchableOpacity> */}

            {/* Attendees List */}
            {expandedEvent === event._id &&
              event.attendees?.map((att) => (
                <View key={att._id} style={tw`flex-row items-center mt-2 ml-6`}>
                  <Image
                    source={{ uri: att.avatarUrl }}
                    style={tw`w-6 h-6 rounded-full mr-2`}
                  />
                  <Text style={tw`text-sm text-gray-700`}>{att.name}</Text>
                </View>
              ))}
            <TouchableOpacity
              onPress={() => handleBookEvent(event._id)}
              style={tw`mt-3 bg-${event.attendees?.some((att) => att._id === loggedInUserId) ? "gray-400" : "red-500"} py-2 px-4 rounded-lg`}
              disabled={event.attendees?.some(
                (att) => att._id === loggedInUserId
              )}
            >
              <Text style={tw`text-white text-center text-base`}>
                {event.attendees?.some((att) => att._id === loggedInUserId)
                  ? "Booked"
                  : "Book Event"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

      {/* ✅ Edit Modal */}
      {/* <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}
        >
          <View style={tw`bg-white rounded-lg p-6 w-11/12`}>
            <Text style={tw`text-lg font-bold mb-4`}>Edit Event</Text>

            <TextInput
              placeholder="Title"
              value={form.title}
              onChangeText={(t) => setForm({ ...form, title: t })}
              style={tw`border p-2 rounded mb-2`}
            />
            <TextInput
              placeholder="Description"
              value={form.description}
              onChangeText={(t) => setForm({ ...form, description: t })}
              style={tw`border p-2 rounded mb-2`}
            />
            <TextInput
              placeholder="State"
              value={form.state}
              onChangeText={(t) => setForm({ ...form, state: t })}
              style={tw`border p-2 rounded mb-2`}
            />
            <TextInput
              placeholder="Start Date (YYYY-MM-DD)"
              value={form.startDate}
              onChangeText={(t) => setForm({ ...form, startDate: t })}
              style={tw`border p-2 rounded mb-2`}
            />
            <TextInput
              placeholder="End Date (YYYY-MM-DD)"
              value={form.endDate}
              onChangeText={(t) => setForm({ ...form, endDate: t })}
              style={tw`border p-2 rounded mb-2`}
            />
            <View style={tw`flex-row items-center mb-4`}>
              {form.imageUrl ? (
                <Image
                  source={{ uri: form.imageUrl }}
                  style={tw`w-16 h-16 rounded mr-3`}
                />
              ) : (
                <Ionicons name="image-outline" size={40} color="gray" style={tw`mr-3`} />
              )}
              <TouchableOpacity
                onPress={() => handleImageUpload(editingEvent._id)}
                style={tw`bg-red-500 px-3 py-2 rounded`}
              >
                <Text style={tw`text-white text-sm`}>Upload Image</Text>
              </TouchableOpacity>
            </View>

            <View style={tw`flex-row justify-end`}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={tw`px-4 py-2 bg-gray-300 rounded mr-2`}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitUpdate}
                style={tw`px-4 py-2 bg-red-500 rounded`}
              >
                <Text style={tw`text-white`}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </ScrollView>
  );
};

export default Social;
