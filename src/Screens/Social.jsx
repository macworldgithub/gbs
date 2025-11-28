// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Image,
//   TextInput,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { launchImageLibrary } from "react-native-image-picker";
// import { MaterialIcons, Entypo } from "@expo/vector-icons";
// import tw from "tailwind-react-native-classnames";
// import { useNavigation } from "@react-navigation/native";
// import { getUserData } from "../utils/storage"; // ✅ import your storage.js
// import Cards from "../../components/Cards";

// const fallbackImage = require("../../assets/fallback.png");
// const tabs = [];
// const states = ["All", "VIC", "NSW", "QLD", "SA", "WA"];
// const API_URL = "https://gbs.westsidecarcare.com.au/events";

// const Social = () => {
//   const [activeTab, setActiveTab] = useState("Events");
//   const [selectedState, setSelectedState] = useState("All");
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [expandedEvent, setExpandedEvent] = useState(null);
//   const [user, setUser] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingEvent, setEditingEvent] = useState(null);
//   const [booked, setBooked] = useState(false);
//   const loggedInUserId = user?.user?._id || user?._id || user?.sub;

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     state: "",
//     startDate: "",
//     endDate: "",
//     imageUrl: "",
//   });
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const u = await getUserData();
//       console.log("Fetched user data:", u);
//       setUser(u);
//     };
//     fetchUser();
//   }, []);

//   const fetchEvents = async (stateFilter = "All") => {
//     try {
//       setLoading(true);

//       let url = `${API_URL}?&limit=100`;
//       if (stateFilter !== "All") {
//         url += `&state=${stateFilter}`;
//       }

//       const res = await fetch(url, {
//         headers: {
//           Accept: "application/json",
//         },
//       });
//       const data = await res.json();
//       console.log("Fetched events data:", data);

//       // if (res.ok) {
//       //   setEvents(data);
//       // } else {
//       //   Alert.alert("Error", data.message || "Failed to load events");
//       // }

//       if (res.ok) {
//         setEvents(Array.isArray(data.events) ? data.events : []);
//       } else {
//         Alert.alert("Error", data.message || "Failed to load events");
//       }
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents(selectedState);
//   }, [selectedState]);
//   return (
//     <ScrollView style={tw`flex-1 bg-white py-4`}>
//       {/* Header */}
//       <View style={tw`flex-row items-center justify-between mt-12 mb-4`}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <View>
//           <Text style={tw`text-xl font-bold`}>Social</Text>
//           <Text style={tw`text-sm text-gray-600`}>Community & Events</Text>
//         </View>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Tabs */}
//       <View style={tw`flex-row mb-4`}>
//         {tabs.map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setActiveTab(tab)}
//             style={tw.style(
//               `px-4 py-2 mr-2 rounded-md`,
//               activeTab === tab ? "bg-red-500" : "bg-gray-100"
//             )}
//           >
//             <Text
//               style={tw.style(
//                 `text-sm`,
//                 activeTab === tab ? "text-white" : "text-gray-700"
//               )}
//             >
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* State Filter */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={tw`mb-4`}
//       >
//         {states.map((st) => (
//           <TouchableOpacity
//             key={st}
//             onPress={() => setSelectedState(st)}
//             style={tw.style(
//               `px-4 py-2 mr-2 rounded-md border`,
//               selectedState === st
//                 ? "bg-red-100 border-red-500"
//                 : "bg-white border-gray-300"
//             )}
//           >
//             <Text
//               style={tw.style(
//                 `text-sm`,
//                 selectedState === st ? "text-red-600" : "text-gray-700"
//               )}
//             >
//               {st}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Loader */}
//       {loading && (
//         <ActivityIndicator size="large" color="red" style={tw`mt-4`} />
//       )}

//       {/* ✅ Events Section — Use Cards component */}
//       {activeTab === "Events" && !loading && (
//         <View style={tw`mt-2`}>
//           <Cards stateFilter={selectedState} limit={100} />
//         </View>
//       )}

//       {/* If some other tab selected */}
//       {activeTab !== "Events" && (
//         <Text style={tw`text-gray-500 text-center mt-6`}>
//           Select “Events” tab to view events.
//         </Text>
//       )}
//     </ScrollView>
//   );
// };

// export default Social;

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
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "../utils/storage"; // ✅ import your storage.js

const fallbackImage = require("../../assets/fallback.png");
const tabs = ["Events"];
const states = ["All", "VIC", "NSW", "QLD", "SA", "WA"];
const API_URL = "https://gbs.westsidecarcare.com.au/trybooking/events";

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

  const getStateFromEvent = (event) => {
    const venueLower = event.venue?.toLowerCase() || "";
    const nameLower = event.name.toLowerCase();
    if (nameLower.includes("singapore") || venueLower.includes("singapore")) {
      return "Singapore";
    }
    const tz = event.timeZone || "";
    const match = tz.match(/Australia\/([A-Z][a-z]*)/);
    if (match) {
      const city = match[1].toUpperCase();
      const stateMap = {
        MELBOURNE: "VIC",
        SYDNEY: "NSW",
        BRISBANE: "QLD",
        ADELAIDE: "SA",
        PERTH: "WA",
        DARWIN: "NT",
      };
      return stateMap[city] || "All";
    }
    return "All";
  };

  const isEventOngoing = (event) => {
    if (!event.sessionList || event.sessionList.length === 0) return false;
    const today = new Date("2025-11-28T00:00:00Z");
    const startDate = new Date(event.sessionList[0].eventStartDate);
    const endDate = new Date(event.sessionList[0].eventEndDate);
    return startDate <= today && endDate > today;
  };

  const isBookingOpen = (event) => {
    if (!event.sessionList || event.sessionList.length === 0) return false;
    const today = new Date("2025-11-28T00:00:00Z");
    const bookingStartDate = new Date(event.sessionList[0].bookingStartDate);
    const bookingEndDate = new Date(event.sessionList[0].bookingEndDate);
    return bookingStartDate <= today && today < bookingEndDate;
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const url = API_URL;

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("Fetched events data:", data);

      if (res.ok) {
        setEvents(Array.isArray(data) ? data : []);
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
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      (selectedState === "All" || getStateFromEvent(event) === selectedState) &&
      isEventOngoing(event)
  );

  const handleEventPress = (eventId) => {
    navigation.navigate("EventDetail", { eventId });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const getLocation = (event) => {
    const state = getStateFromEvent(event);
    return event.venue
      ? `${event.venue}, Australia`
      : `${state || "Australia"}`;
  };

  const getDetails = (description) => {
    return description
      ? description.substring(0, 20) + "..."
      : "No details available";
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-200 py-4`}>
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

      {/* Events Section */}
      {activeTab === "Events" && !loading && (
        <View style={tw`mt-2`}>
          {filteredEvents.length === 0 ? (
            <Text style={tw`text-gray-500 text-center mt-6`}>
              No events found for the selected state.
            </Text>
          ) : (
            filteredEvents.map((event) => {
              const startDate =
                event.sessionList && event.sessionList.length > 0
                  ? event.sessionList[0].eventStartDate
                  : new Date().toISOString();
              const endDate =
                event.sessionList && event.sessionList.length > 0
                  ? event.sessionList[0].eventEndDate
                  : new Date().toISOString();
              const imageUri =
                event.listOfImages && event.listOfImages.length > 0
                  ? { uri: event.listOfImages[0].imageFileName }
                  : fallbackImage;
              const seats =
                event.sessionList && event.sessionList.length > 0
                  ? event.sessionList[0].sessionAvailability
                  : "N/A";
              const isBookingAvailable = isBookingOpen(event);
              return (
                <TouchableOpacity
                  key={event.eventId}
                  onPress={() => handleEventPress(event.eventId)}
                >
                  <View
                    style={tw`mx-2 mb-4 bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 `}
                  >
                    <View style={tw`flex-row p-4`}>
                      <View style={tw`flex-1 pr-4`}>
                        <Text style={tw`text-lg font-bold mb-1`}>
                          {event.name}
                        </Text>
                        <Text style={tw`text-sm text-gray-600 mb-2`}>
                          {getLocation(event)}
                        </Text>
                        <Text
                          style={tw`text-sm text-gray-600 mb-1 font-semibold`}
                        >
                          Date-Time: {formatDateTime(startDate)}
                        </Text>
                        <Text
                          style={tw`text-sm text-gray-600 mb-1 font-semibold`}
                        >
                          Event-End-Date: {formatDateTime(endDate)}
                        </Text>
                        <Text
                          style={tw`text-sm text-gray-600 mb-1 font-semibold`}
                        >
                          Details: {getDetails(event.description)}
                        </Text>
                        <Text style={tw`text-sm text-gray-600 font-semibold`}>
                          Seats: {seats}
                        </Text>
                      </View>
                      <View style={tw`w-32 h-32`}>
                        <Image
                          source={imageUri}
                          style={tw`w-full h-full rounded`}
                          resizeMode="cover"
                        />

                        {event.bookingUrl && isBookingAvailable && (
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(event.bookingUrl).catch(() =>
                                Alert.alert(
                                  "Error",
                                  "Unable to open booking link"
                                )
                              )
                            }
                            style={tw`bg-red-500 p-2 mb-2 mt-4 rounded-xl w-32`}
                          >
                            <Text
                              style={tw`text-white text-center font-semibold`}
                            >
                              Buy Ticket
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      {/* If some other tab selected */}
      {activeTab !== "Events" && (
        <Text style={tw`text-gray-500 text-center mt-6`}>
          Select “Events” tab to view events.
        </Text>
      )}
    </ScrollView>
  );
};

export default Social;
