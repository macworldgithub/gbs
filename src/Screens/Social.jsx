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
import Cards from "../../components/Cards";

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

      // if (res.ok) {
      //   setEvents(data);
      // } else {
      //   Alert.alert("Error", data.message || "Failed to load events");
      // }

      if (res.ok) {
        setEvents(Array.isArray(data.events) ? data.events : []);
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
            style={tw.style(
              `px-4 py-2 mr-2 rounded-md`,
              activeTab === tab ? "bg-red-500" : "bg-gray-100"
            )}
          >
            <Text
              style={tw.style(
                `text-sm`,
                activeTab === tab ? "text-white" : "text-gray-700"
              )}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* State Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mb-4`}
      >
        {states.map((st) => (
          <TouchableOpacity
            key={st}
            onPress={() => setSelectedState(st)}
            style={tw.style(
              `px-4 py-2 mr-2 rounded-md border`,
              selectedState === st
                ? "bg-red-100 border-red-500"
                : "bg-white border-gray-300"
            )}
          >
            <Text
              style={tw.style(
                `text-sm`,
                selectedState === st ? "text-red-600" : "text-gray-700"
              )}
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

      {/* ✅ Events Section — Use Cards component */}
      {activeTab === "Events" && !loading && (
        <View style={tw`mt-2`}>
          <Cards stateFilter={selectedState} />
        </View>
      )}

      {/* If some other tab selected */}
      {activeTab !== "Events" && (
        <Text style={tw`text-gray-500 text-center mt-6`}>
          Select “Events” tab to view events.
        </Text>
      )}

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
