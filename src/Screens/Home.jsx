// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Modal,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   Platform,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useNavigation } from "@react-navigation/native";
// import tw from "tailwind-react-native-classnames";
// import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
// import Cards from "../../components/Cards";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Drawer from "../../components/Drawer";
// import axios from "axios";
// import { API_BASE_URL } from "../utils/config";
// import MapboxPolygonDrawer from "./MapboxPolygonDrawer";

// const upcomingEvents = [
//   {
//     id: "1",
//     title: "Synchronize Fest 2024",
//     date: "May 20",
//     location: "Yogyakarta",
//     price: "$285",
//     image: require("../../assets/event1.png"),
//   },
//   {
//     id: "2",
//     title: "WJNC #9 : Gathering",
//     date: "Oct 7",
//     location: "Yogyakarta",
//     price: "$185",
//     image: require("../../assets/event2.png"),
//   },
// ];

// const tabs = [
//   { key: "all", label: "All", icon: "apps" },
//   { key: "VIC", label: "VIC", icon: "location-on" },
//   { key: "NSW", label: "NSW", icon: "location-on" },
//   { key: "QLD", label: "QLD", icon: "location-on" },
//   { key: "SA", label: "SA", icon: "location-on" },
//   { key: "WA", label: "WA", icon: "location-on" },
// ];

// export default function Home() {
//   const navigation = useNavigation();
//   const [likedEvents, setLikedEvents] = useState({});
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [businessResults, setBusinessResults] = useState([]);
//   const [offerResults, setOfferResults] = useState([]);
//   const [userResults, setUserResults] = useState([]);
//   const debounceRef = useRef(null);

//   // Sidebar state
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [coordinates, setCoordinates] = useState([]);

//   // Create Event Modal state

//   const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
//   const [roles, setRoles] = useState([]);
//   const [loadingRoles, setLoadingRoles] = useState(false);
//   const [submittingEvent, setSubmittingEvent] = useState(false);
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);
//   const [eventForm, setEventForm] = useState({
//     title: "",
//     description: "",
//     state: "VIC",
//     startDate: new Date(),
//     endDate: new Date(),
//     selectedRoleId: "",
//   });

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   // Load roles when modal opens
//   const loadRoles = async () => {
//     try {
//       setLoadingRoles(true);
//       const userData = await AsyncStorage.getItem("userData");
//       const parsedUserData = JSON.parse(userData);
//       const token = parsedUserData?.token;

//       if (!token) {
//         Alert.alert("Error", "No token found, please login again.");
//         return;
//       }

//       const res = await axios.get(`${API_BASE_URL}/roles`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRoles(res.data || []);
//     } catch (e) {
//       console.log("[Home] roles error:", e.response?.data || e.message);
//       Alert.alert("Error", "Failed to load roles");
//     } finally {
//       setLoadingRoles(false);
//     }
//   };

//   const openCreateEventModal = () => {
//     setCreateEventModalVisible(true);
//     loadRoles();
//   };

//   const closeCreateEventModal = () => {
//     setCreateEventModalVisible(false);
//     setEventForm({
//       title: "",
//       description: "",
//       state: "VIC",
//       startDate: new Date(),
//       endDate: new Date(),
//       selectedRoleId: "",
//     });
//     setShowStartDatePicker(false);
//     setShowEndDatePicker(false);
//     setCoordinates([]);
//   };

//   const onStartDateChange = (event, selectedDate) => {
//     setShowStartDatePicker(false); // 👈 always close after selection
//     if (selectedDate) {
//       setEventForm((prev) => ({
//         ...prev,
//         startDate: selectedDate,
//         endDate: new Date(selectedDate.getTime() + 3 * 60 * 60 * 1000), // add 3 hrs
//       }));
//     }
//   };

//   const onEndDateChange = (event, selectedDate) => {
//     setShowEndDatePicker(false); // 👈 always close after selection
//     if (selectedDate) {
//       setEventForm((prev) => ({ ...prev, endDate: selectedDate }));
//     }
//   };

//   useEffect(() => {
//     if (coordinates.length > 0) {
//       console.log(
//         "[Home] Selected coordinates:",
//         JSON.stringify(coordinates, null, 2)
//       );
//     }
//   }, [coordinates]);

//   const createEvent = async () => {
//     if (
//       !eventForm.title.trim() ||
//       !eventForm.description.trim() ||
//       !eventForm.selectedRoleId
//     ) {
//       Alert.alert("Error", "Please fill all required fields");
//       return;
//     }

//     try {
//       setSubmittingEvent(true);
//       const userData = await AsyncStorage.getItem("userData");
//       const parsedUserData = JSON.parse(userData);
//       const token = parsedUserData?.token;

//       if (!token) {
//         Alert.alert("Error", "No token found, please login again.");
//         return;
//       }

//       const body = {
//         title: eventForm.title.trim(),
//         description: eventForm.description.trim(),
//         state: eventForm.state,
//         area: {
//           type: "MultiPolygon",
//           coordinates: coordinates.length > 0 ? coordinates : [],
//         },
//         openToAll: false,
//         startDate: eventForm.startDate.toISOString(),
//         endDate: eventForm.endDate.toISOString(),
//         roles: [eventForm.selectedRoleId],
//       };

//       console.log("[Home] Final Event Payload:", JSON.stringify(body, null, 2));

//       const res = await axios.post(`${API_BASE_URL}/events`, body, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("[Home] Create event response:", res.data);
//       Alert.alert("Success", "Event created successfully!");
//       closeCreateEventModal();
//     } catch (e) {
//       console.log("[Home] Create event error:", e.response?.data || e.message);
//       Alert.alert("Error", "Failed to create event. Please try again.");
//     } finally {
//       setSubmittingEvent(false);
//     }
//   };

//   const handleTabPress = (key) => {
//     setActiveTab(key);
//     console.log(`[Home] Tab changed to: ${key}`);
//     // No need for navigation since we're filtering events locally
//   };

//   // Log activeTab changes for debugging
//   useEffect(() => {
//     console.log(`[Home] activeTab changed to: ${activeTab}`);
//   }, [activeTab]);

//   // Debounced search
//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     if (searchQuery.trim().length < 2) {
//       setBusinessResults([]);
//       setOfferResults([]);
//       setUserResults([]);
//       setSearchLoading(false);
//       return;
//     }

//     debounceRef.current = setTimeout(async () => {
//       try {
//         setSearchLoading(true);
//         const params = {
//           keyword: searchQuery.trim(),
//           page: 1,
//           limit: 10,
//         };
//         const res = await axios.get(`${API_BASE_URL}/search`, { params });
//         const b = Array.isArray(res.data?.businesses)
//           ? res.data.businesses
//           : [];
//         const o = Array.isArray(res.data?.offers) ? res.data.offers : [];
//         const u = Array.isArray(res.data?.users) ? res.data.users : [];
//         setBusinessResults(b);
//         setOfferResults(o);
//         setUserResults(u);
//       } catch (e) {
//         setBusinessResults([]);
//         setOfferResults([]);
//         setUserResults([]);
//       } finally {
//         setSearchLoading(false);
//       }
//     }, 400);

//     return () => debounceRef.current && clearTimeout(debounceRef.current);
//   }, [searchQuery]);

//   const renderHeader = () => (
//     <View style={tw`px-4 pt-6 mt-10`}>
//       {/* Location & Notifications */}
//       <View style={tw`flex-row justify-between items-center mb-4`}>
//         <TouchableOpacity onPress={toggleSidebar}>
//           <FontAwesome name="bars" size={24} color="black" style={tw`mr-4`} />
//         </TouchableOpacity>

//         <View style={tw`flex-row items-center`}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate("Notification")}
//             style={tw`mr-4`}
//           >
//             <View style={tw`relative`}>
//               <FontAwesome name="bell" size={20} color="black" />
//               <View
//                 style={tw`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500`}
//               />
//             </View>
//           </TouchableOpacity>
//           {/* <TouchableOpacity
//             onPress={() => navigation.navigate("CreateEvent")}
//             style={tw`flex-row items-center border border-red-500 px-3 py-1 rounded-full`}
//           > */}
//           {/* <Ionicons name="log-out-outline" size={20} color="#ef4444" /> */}

//           {/* <Text style={tw`ml-1 text-red-500 `}>Create Events</Text> */}
//           {/* </TouchableOpacity> */}
//         </View>
//       </View>

//       {/* Search Input */}
//       <View
//         style={tw`flex-row items-center bg-gray-100 rounded-lg px-2 mb-3 border border-gray-300`}
//       >
//         <Ionicons name="search" size={18} color="#9CA3AF" />
//         <TextInput
//           style={tw`ml-2 flex-1 text-sm p-4`}
//           placeholder="Search businesses, offers, users"
//           placeholderTextColor="gray"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           blurOnSubmit={false}
//           returnKeyType="search"
//           autoFocus={false}
//           onSubmitEditing={() => {
//             /* keep keyboard */
//           }}
//         />
//       </View>

//       {/* Search Results under search bar */}
//       {searchQuery.trim().length > 1 && (
//         <View style={tw`bg-white border border-gray-300 rounded-lg mb-3`}>
//           {searchLoading && (
//             <Text style={tw`px-3 py-2 text-gray-500`}>Searching...</Text>
//           )}

//           {!searchLoading &&
//             businessResults.length === 0 &&
//             offerResults.length === 0 &&
//             userResults.length === 0 && (
//               <Text style={tw`px-3 py-2 text-gray-500`}>No results</Text>
//             )}

//           {!searchLoading && businessResults.length > 0 && (
//             <View>
//               <Text style={tw`px-3 pt-2 pb-1 text-gray-700 font-semibold`}>
//                 Businesses
//               </Text>
//               <FlatList
//                 data={businessResults}
//                 keyExtractor={(item) => item._id}
//                 keyboardShouldPersistTaps="always"
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     onPress={() =>
//                       navigation.navigate("BusinessDetail", { id: item._id })
//                     }
//                     style={tw`px-3 py-2 border-b border-gray-200`}
//                   >
//                     <Text style={tw`font-semibold`}>{item.companyName}</Text>
//                     <Text style={tw`text-gray-500 text-xs`}>
//                       {item.industry} • {item.state}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           )}

//           {!searchLoading && offerResults.length > 0 && (
//             <View>
//               <Text style={tw`px-3 pt-2 pb-1 text-gray-700 font-semibold`}>
//                 Offers
//               </Text>
//               <FlatList
//                 data={offerResults}
//                 keyExtractor={(item) => item._id}
//                 keyboardShouldPersistTaps="always"
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     onPress={() =>
//                       navigation.navigate("OfferDetails", { id: item._id })
//                     }
//                     style={tw`px-3 py-2 border-b border-gray-200`}
//                   >
//                     <Text style={tw`font-semibold`}>{item.title}</Text>
//                     <Text style={tw`text-gray-500 text-xs`}>
//                       {item.discount} • {item.offerType}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           )}

//           {!searchLoading && userResults.length > 0 && (
//             <View>
//               <Text style={tw`px-3 pt-2 pb-1 text-gray-700 font-semibold`}>
//                 Users
//               </Text>
//               <FlatList
//                 data={userResults}
//                 keyExtractor={(item) => item._id}
//                 keyboardShouldPersistTaps="always"
//                 renderItem={({ item }) => (
//                   <View style={tw`px-3 py-2 border-b border-gray-200`}>
//                     <Text style={tw`font-semibold`}>{item.name}</Text>
//                     <Text style={tw`text-gray-500 text-xs`}>{item.email}</Text>
//                   </View>
//                 )}
//               />
//             </View>
//           )}
//         </View>
//       )}

//       {/* Scrollable Tabs */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={tw`mb-4`}
//       >
//         {tabs.map((item) => (
//           <TouchableOpacity
//             key={item.key}
//             onPress={() => handleTabPress(item.key)}
//             style={tw.style(
//               `px-4 py-2 mr-2 rounded-md border`,
//               activeTab === item.key
//                 ? "bg-red-100 border-red-500"
//                 : "bg-white border-gray-300"
//             )}
//           >
//             <Text
//               style={tw.style(
//                 `text-sm font-medium`,
//                 activeTab === item.key ? "text-red-600" : "text-gray-700"
//               )}
//             >
//               {item.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Upcoming Events Section */}
//       <View style={tw`mb-2`}>
//         <View style={tw`flex-row justify-between mb-2`}>
//           {/* <Text style={tw`font-semibold`}>Latest News</Text> */}
//           <Text style={tw`font-extrabold`}>Latest News</Text>

//           <Text style={tw`text-red-500 text-sm`}>See all News</Text>
//         </View>

//         <FlatList
//           data={upcomingEvents}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View style={tw`mr-4`}>
//               <Image
//                 source={item.image}
//                 style={{ width: 180, height: 100, borderRadius: 10 }}
//               />
//               <Text style={tw`mt-2 font-semibold text-sm`}>{item.title}</Text>
//               <Text style={tw`text-red-500`}>{item.price}</Text>
//               <Text style={tw`text-gray-500 text-xs`}>{item.location}</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         keyboardShouldPersistTaps="always"
//         keyboardDismissMode="none"
//         ListHeaderComponent={renderHeader}
//         data={[{}]}
//         renderItem={() => (
//           <View style={tw`px-4`}>
//             <View style={tw`flex-row justify-between mb-2 `}>
//               <Text style={tw`font-extrabold`}>
//                 {activeTab === "all" ? "All Events" : `${activeTab} Events`}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.navigate("social");
//                 }}
//               >
//                 <Text style={tw`text-red-500 text-sm`}>See all Events</Text>
//               </TouchableOpacity>
//             </View>
//             <Cards stateFilter={activeTab} />
//           </View>
//         )}
//         keyExtractor={() => "footer"}
//       />

//       {/* Sidebar Component */}
//       <Drawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       {/* Create Event Modal */}
//       {/* <Modal visible={createEventModalVisible} transparent animationType="fade">
//         <View
//           style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}
//         >
//           <View style={tw`bg-white w-11/12 max-w-md rounded-2xl p-6`}>
//             <Text style={tw`text-lg font-bold text-gray-900 text-center mb-4`}>
//               Create New Event
//             </Text>

//             <ScrollView showsVerticalScrollIndicator={false}>

//               <View style={tw`mb-4`}>
//                 <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                   Title *
//                 </Text>
//                 <TextInput
//                   style={tw`border border-gray-300 rounded-lg px-3 py-2 text-sm`}
//                   placeholder="Enter event title"
//                   value={eventForm.title}
//                   onChangeText={(text) =>
//                     setEventForm({ ...eventForm, title: text })
//                   }
//                 />
//               </View>

//               <View style={tw`mb-4`}>
//                 <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                   Description *
//                 </Text>
//                 <TextInput
//                   style={tw`border border-gray-300 rounded-lg px-3 py-2 text-sm`}
//                   placeholder="Enter event description"
//                   multiline
//                   numberOfLines={3}
//                   value={eventForm.description}
//                   onChangeText={(text) =>
//                     setEventForm({ ...eventForm, description: text })
//                   }
//                 />
//               </View>

//               <View style={tw`mb-4`}>
//                 <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                   State *
//                 </Text>
//                 <View style={tw`border border-gray-300 rounded-lg px-3 py-2`}>
//                   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                     {["VIC", "NSW", "QLD", "SA"].map((state) => (
//                       <TouchableOpacity
//                         key={state}
//                         style={tw.style(
//                           `px-3 py-1 rounded-full mr-2`,
//                           eventForm.state === state
//                             ? `bg-red-500`
//                             : `bg-gray-200`
//                         )}
//                         onPress={() => setEventForm({ ...eventForm, state })}
//                       >
//                         <Text
//                           style={tw.style(
//                             `text-xs font-medium`,
//                             eventForm.state === state
//                               ? `text-white`
//                               : `text-gray-700`
//                           )}
//                         >
//                           {state}
//                         </Text>
//                       </TouchableOpacity>
//                     ))}
//                   </ScrollView>
//                 </View>
//               </View>

//               <View style={tw`mb-4`}>
//                 <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                   Start Date *
//                 </Text>
//                 <TouchableOpacity
//                   style={tw`border border-gray-300 rounded-lg px-3 py-2`}
//                   onPress={() => setShowStartDatePicker(true)}
//                 >
//                   <Text style={tw`text-sm text-gray-700`}>
//                     {eventForm.startDate.toLocaleDateString()}{" "}
//                     {eventForm.startDate.toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={tw`mb-4`}>
//                 <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                   End Date *
//                 </Text>
//                 <TouchableOpacity
//                   style={tw`border border-gray-300 rounded-lg px-3 py-2`}
//                   onPress={() => setShowEndDatePicker(true)}
//                 >
//                   <Text style={tw`text-sm text-gray-700`}>
//                     {eventForm.endDate.toLocaleDateString()}{" "}
//                     {eventForm.endDate.toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={tw`mb-6`}>
//                 <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                   Role *
//                 </Text>
//                 {loadingRoles ? (
//                   <View
//                     style={tw`border border-gray-300 rounded-lg px-3 py-2 items-center`}
//                   >
//                     <ActivityIndicator color="#DC2626" size="small" />
//                     <Text style={tw`text-gray-500 text-sm ml-2`}>
//                       Loading roles...
//                     </Text>
//                   </View>
//                 ) : (
//                   <View style={tw`border border-gray-300 rounded-lg px-3 py-2`}>
//                     <ScrollView
//                       horizontal
//                       showsHorizontalScrollIndicator={false}
//                     >
//                       {roles.map((role) => (
//                         <TouchableOpacity
//                           key={role._id}
//                           style={tw.style(
//                             `px-3 py-1 rounded-full mr-2`,
//                             eventForm.selectedRoleId === role._id
//                               ? `bg-red-500`
//                               : `bg-gray-200`
//                           )}
//                           onPress={() =>
//                             setEventForm({
//                               ...eventForm,
//                               selectedRoleId: role._id,
//                             })
//                           }
//                         >
//                           <Text
//                             style={tw.style(
//                               `text-xs font-medium`,
//                               eventForm.selectedRoleId === role._id
//                                 ? `text-white`
//                                 : `text-gray-700`
//                             )}
//                           >
//                             {role.label}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                   </View>
//                 )}
//               </View>
//                 <View style={tw`mb-6`}>
//                 <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
//                   Select Event Area *
//                 </Text>
//                 <View style={{ height: 300 }}>
//                   <MapboxPolygonDrawer
//                     coordinates={coordinates}
//                     setCoordinates={setCoordinates}
//                   />
//                 </View>
//               </View>

//             </ScrollView>

//             <View style={tw`flex-row mt-4`}>
//               <TouchableOpacity
//                 style={tw`flex-1 bg-gray-200 py-2 rounded-lg mr-2`}
//                 onPress={closeCreateEventModal}
//               >
//                 <Text style={tw`text-gray-800 text-center font-semibold`}>
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={tw`flex-1 bg-red-500 py-2 rounded-lg ml-2`}
//                 onPress={createEvent}
//                 disabled={submittingEvent}
//               >
//                 <Text style={tw`text-white text-center font-semibold`}>
//                   {submittingEvent ? "Creating..." : "Create Event"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {showStartDatePicker && (
//             <DateTimePicker
//               value={eventForm.startDate}
//               mode="date"
//               display="default"
//               onChange={onStartDateChange}
//             />
//           )}

//           {showEndDatePicker && (
//             <DateTimePicker
//               value={eventForm.endDate}
//               mode="date"
//               display="default"
//               onChange={onEndDateChange}
//             />
//           )}
//         </View>
//       </Modal> */}
//     </View>
//   );
// }

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Linking,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  AppState,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import tw from "tailwind-react-native-classnames";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Cards from "../../components/Cards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Drawer from "../../components/Drawer";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
// import MapboxPolygonDrawer from "./MapboxPolygonDrawer";
import { checkForPackageUpgrade } from "../utils/packageTracker";

const newsData = [
  {
    id: "1",
    heading:
      "🍸 NEW GBS GIN AVAILABLE NOW The GBS Legends London Dry Gin Bold. Australian. Unapologetically Good",
    image: require("../../assets/news1.jpeg"),
    location: "Brunswick Aces",
  },
  {
    id: "2",
    heading:
      "INTRODUCING GBS ALLIANCE MEMBERSHIP A Truly Elevated GBS Business Experience",
    image: require("../../assets/wellbeing4.png"),
    // location: "Brunswick Aces",
  },
  // {
  //   id: "3 ",
  //   heading:
  //     "Run The Tan — Sunday 26th April GBS is proudly entering a team in ",
  //   image: require("../../assets/news3.png"),
  //   // location: "Brunswick Aces",
  // },
  // {
  //   id: "4",
  //   heading: "SUPPORTING CRI DU CHAT — April 17th, Club Sunbury",
  //   image: require("../../assets/news4.png"),

  // },
  {
    id: "5",
    heading: "GBS Newsletter\nGet the latest from the GBS News Room",
    image: require("../../assets/news5.png"),
    // location: "Brunswick Aces",
  },
];

const tabs = [
  { key: "all", label: "All", icon: "apps" },
  { key: "VIC", label: "VIC", icon: "location-on" },
  { key: "NSW", label: "NSW", icon: "location-on" },
  { key: "QLD", label: "QLD", icon: "location-on" },
  { key: "SA", label: "SA", icon: "location-on" },
  { key: "WA", label: "WA", icon: "location-on" },
];

export default function Home() {
  const navigation = useNavigation();
  const [likedEvents, setLikedEvents] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [stateFilter, setStateFilter] = useState("All");

  const [searchLoading, setSearchLoading] = useState(false);
  const [businessResults, setBusinessResults] = useState([]);
  const [offerResults, setOfferResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const debounceRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coordinates, setCoordinates] = useState([]);

  const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    state: "VIC",
    startDate: new Date(),
    endDate: new Date(),
    selectedRoleId: "",
  });

  const [guestExpiry, setGuestExpiry] = useState(null);
  const [guestRemainingStr, setGuestRemainingStr] = useState("");
  const [upgradeSuccessVisible, setUpgradeSuccessVisible] = useState(false);
  const [upgradedRoleName, setUpgradedRoleName] = useState("");
  const [appState, setAppState] = useState(AppState.currentState);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const userData = await AsyncStorage.getItem("userData");
      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData?.token;

      if (!token) {
        Alert.alert("Error", "No token found, please login again.");
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data || []);
    } catch (e) {
      console.log("[Home] roles error:", e.response?.data || e.message);
      Alert.alert("Error", "Failed to load roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  const openCreateEventModal = () => {
    setCreateEventModalVisible(true);
    loadRoles();
  };

  const closeCreateEventModal = () => {
    setCreateEventModalVisible(false);
    setEventForm({
      title: "",
      description: "",
      state: "VIC",
      startDate: new Date(),
      endDate: new Date(),
      selectedRoleId: "",
    });
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    setCoordinates([]);
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setEventForm((prev) => ({
        ...prev,
        startDate: selectedDate,
        endDate: new Date(selectedDate.getTime() + 3 * 60 * 60 * 1000),
      }));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEventForm((prev) => ({ ...prev, endDate: selectedDate }));
    }
  };

  useEffect(() => {
    if (coordinates.length > 0) {
      console.log(
        "[Home] Selected coordinates:",
        JSON.stringify(coordinates, null, 2),
      );
    }
  }, [coordinates]);

  const createEvent = async () => {
    if (
      !eventForm.title.trim() ||
      !eventForm.description.trim() ||
      !eventForm.selectedRoleId
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      setSubmittingEvent(true);
      const userData = await AsyncStorage.getItem("userData");
      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData?.token;

      if (!token) {
        Alert.alert("Error", "No token found, please login again.");
        return;
      }

      const body = {
        title: eventForm.title.trim(),
        description: eventForm.description.trim(),
        state: eventForm.state,
        area: {
          type: "MultiPolygon",
          coordinates: coordinates.length > 0 ? coordinates : [],
        },
        openToAll: false,
        startDate: eventForm.startDate.toISOString(),
        endDate: eventForm.endDate.toISOString(),
        roles: [eventForm.selectedRoleId],
      };

      console.log("[Home] Final Event Payload:", JSON.stringify(body, null, 2));

      const res = await axios.post(`${API_BASE_URL}/events`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("[Home] Create event response:", res.data);
      Alert.alert("Success", "Event created successfully!");
      closeCreateEventModal();
    } catch (e) {
      console.log("[Home] Create event error:", e.response?.data || e.message);
      Alert.alert("Error", "Failed to create event. Please try again.");
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleTabPress = (key) => {
    setActiveTab(key);
    console.log(`[Home] Tab changed to: ${key}`);
  };

  //login api call automatically

  const autoLoginRefresh = async () => {
    try {
      const credsRaw = await AsyncStorage.getItem("userCredentials");
      if (!credsRaw) return;
      const { identifier, password } = JSON.parse(credsRaw);

      console.log("🔄 Background auto-login refresh started...");

      let payload = {};
      const trimmedId = identifier.trim();
      if (trimmedId.includes("@")) {
        payload.email = trimmedId.toLowerCase();
      } else {
        let cleanPhone = trimmedId.replace(/\s/g, "");
        if (cleanPhone.startsWith("04") && cleanPhone.length === 10) {
          payload.phone = "+61" + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith("4") && cleanPhone.length === 9) {
          payload.phone = "+61" + cleanPhone;
        } else {
          payload.phone = cleanPhone.startsWith("+")
            ? cleanPhone
            : "+61" + cleanPhone;
        }
      }
      payload.password = password;

      const res = await axios.post(`${API_BASE_URL}/user/auth/signin`, payload);
      if (res.data?.token && res.data?.user) {
        const userData = { token: res.data.token, ...res.data.user };
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        console.log("✅ Auto-login refresh successful.");
      }
    } catch (err) {
      console.log(
        "⚠️ Auto-login refresh failed:",
        err.response?.data?.message || err.message,
      );
    }
  };

  // ✅ Admin emails excluded from upgrade modal
  const adminExcludedEmails = [
    "shaun@goodblokessociety.com.au",
    "leon@goodblokessociety.com.au",
  ];

  const shouldSkipModalsForAdmin = async () => {
    try {
      const userDataRaw = await AsyncStorage.getItem("userData");
      if (!userDataRaw) return false;
      const userData = JSON.parse(userDataRaw);
      if (
        userData?.isAdmin === true ||
        adminExcludedEmails.includes(userData?.email?.toLowerCase())
      ) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
      setBusinessResults([]);
      setOfferResults([]);
      setUserResults([]);
      autoLoginRefresh();

      // ✅ Check for package upgrade when home is focused (skip for admins)
      (async () => {
        const skipForAdmin = await shouldSkipModalsForAdmin();
        if (skipForAdmin) {
          console.log("✅ Admin user — skipping upgrade modal on focus");
          return;
        }
        const upgradeResult = await checkForPackageUpgrade();
        if (upgradeResult.upgraded) {
          setUpgradedRoleName(upgradeResult.newRoleName);
          setUpgradeSuccessVisible(true);
        }
      })();
    }, []),
  );

  useEffect(() => {
    const checkUpgrade = async () => {
      // ✅ Skip for admin users
      const skipForAdmin = await shouldSkipModalsForAdmin();
      if (skipForAdmin) {
        console.log("✅ Admin user — skipping upgrade modal on app resume");
        return;
      }
      const upgradeResult = await checkForPackageUpgrade();
      if (upgradeResult.upgraded) {
        setUpgradedRoleName(upgradeResult.newRoleName);
        setUpgradeSuccessVisible(true);
      }
    };

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log(
          "🔄 App became active in Home — checking for package upgrade...",
        );
        checkUpgrade();
      }
      setAppState(nextAppState);
    });

    return () => subscription.remove();
  }, [appState]);

  useEffect(() => {
    console.log(`[Home] activeTab changed to: ${activeTab}`);
  }, [activeTab]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length < 2) {
      setBusinessResults([]);
      setOfferResults([]);
      setUserResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const res = await axios.get(`${API_BASE_URL}/search`, {
          params: {
            keyword: searchQuery.trim(),
            type: searchType,
            state: stateFilter,
            page: 1,
            limit: 10,
          },
        });

        setBusinessResults(res.data?.businesses || []);
        setOfferResults(res.data?.offers || []);
        setUserResults(res.data?.users || []);
      } catch (err) {
        console.log("Search error", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, searchType, stateFilter]);

  useEffect(() => {
    (async () => {
      try {
        const userDataRaw = await AsyncStorage.getItem("userData");
        const parsedUserData = userDataRaw ? JSON.parse(userDataRaw) : null;

        if (parsedUserData?.isGuest) {
          const expiry = parsedUserData.guestExpiry;
          setGuestExpiry(expiry);

          if (expiry && Date.now() > expiry) {
            Alert.alert(
              "Guest Access Expired",
              "Your 7-day guest access has expired. Please sign up or sign in to continue.",
              [
                {
                  text: "Sign In",
                  onPress: () => navigation.navigate("Signin"),
                },
                {
                  text: "Sign Up",
                  onPress: () => navigation.navigate("Signup"),
                },
              ],
              { cancelable: false },
            );
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("guestExpiry");
            setGuestExpiry(null);
          }
        }
      } catch (e) {
        console.log("[Home] guest check error:", e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!guestExpiry) {
      setGuestRemainingStr("");
      return;
    }

    let mounted = true;

    const updateRemaining = async () => {
      try {
        const rem = guestExpiry - Date.now();
        if (rem <= 0) {
          if (!mounted) return;
          setGuestRemainingStr("Expired");
          setGuestExpiry(null);
          await AsyncStorage.removeItem("userData");
          await AsyncStorage.removeItem("guestExpiry");
          Alert.alert(
            "Guest Access Expired",
            "Your 7-day guest access has expired. Please sign in or sign up to continue.",
            [
              { text: "Sign In", onPress: () => navigation.navigate("Signin") },
              { text: "Sign Up", onPress: () => navigation.navigate("Signup") },
            ],
            { cancelable: false },
          );
          return;
        }

        const days = Math.floor(rem / (24 * 3600 * 1000));
        const hours = Math.floor((rem % (24 * 3600 * 1000)) / (3600 * 1000));
        const mins = Math.floor((rem % (3600 * 1000)) / (60 * 1000));
        const secs = Math.floor((rem % (60 * 1000)) / 1000);

        const display =
          days > 0
            ? `${days} days ${hours} hrs`
            : hours > 0
              ? `${hours} hrs ${mins} mins`
              : `${mins} mins ${secs} secs`;

        if (mounted) setGuestRemainingStr(display);
      } catch (e) {
        console.log("[Home] countdown error:", e);
      }
    };
    updateRemaining();
    const id = setInterval(updateRemaining, 1000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [guestExpiry, navigation]);

  // ==================== FIXED PAYMENT MODAL LOGIC ====================
  useEffect(() => {
    const checkForPaymentModal = async () => {
      try {
        const userDataRaw = await AsyncStorage.getItem("userData");
        if (!userDataRaw) return;

        const userData = JSON.parse(userDataRaw);

        if (userData?.isGuest) return;

        // ✅ Skip modal for admin users or specific admin emails
        const adminExcludedEmails = [
          "shaun@goodblokessociety.com.au",
          "leon@goodblokessociety.com.au",
        ];
        if (
          userData?.isAdmin === true ||
          adminExcludedEmails.includes(userData?.email?.toLowerCase())
        ) {
          console.log(
            "✅ Admin user or excluded email — skipping payment modal",
          );
          setShowPaymentModal(false);
          return;
        }

        // ✅ Role IDs to exclude from showing payment modal
        const excludedRoleIds = [
          "6915636090f43d76fc6cf61b", // founder
          "69156a2390f43d76fc6cf61c", // life_member
          "69156a2390f43d76fc6cf61d", // national_partner
          "6916d50d391fd5aaf21f76eb", // singapore_foundation
        ];

        const excludedRoleNames = [
          "founder",
          "life_member",
          "national_partner",
          "singapore_foundation",
        ];

        const userRoleId =
          userData?.role?._id || userData?.activatedPackage?.role?._id;
        const userRoleName =
          userData?.role?.name || userData?.activatedPackage?.role?.name;

        const isExcludedRole =
          excludedRoleIds.includes(userRoleId) ||
          excludedRoleNames.includes(userRoleName);

        const hasActivePackage =
          !!userData?.activatedPackage &&
          userData.activatedPackage.endDate &&
          new Date(userData.activatedPackage.endDate) > new Date();

        console.log("🔍 Has Active Package:", hasActivePackage);
        console.log("🔍 Is Excluded Role:", isExcludedRole);

        if (!hasActivePackage && !isExcludedRole) {
          console.log(
            "✅ No active package & NOT excluded role → Forcing modal",
          );
          setShowPaymentModal(true);
          await AsyncStorage.setItem("paymentModalShownThisSession", "true");
        } else {
          console.log("✅ User has active package or is an excluded role");
          setShowPaymentModal(false);
          await AsyncStorage.removeItem("paymentModalShownThisSession");
        }
      } catch (e) {
        console.log("❌ Payment modal check error:", e);
      }
    };

    const timer = setTimeout(checkForPaymentModal, 800);
    return () => clearTimeout(timer);
  }, []);

  // ==================== HANDLE PAYMENT WITH TOKEN & ROLE ID ====================
  const handleVisitPaymentWebsite = async () => {
    try {
      const userDataRaw = await AsyncStorage.getItem("userData");
      let selectedPackageId = await AsyncStorage.getItem("selectedPackage");

      console.log(
        "📦 Selected Package ID from AsyncStorage:",
        selectedPackageId,
      );

      if (!userDataRaw) {
        Alert.alert("Error", "User data not found");
        return;
      }

      const userData = JSON.parse(userDataRaw);
      const token = userData?.token;

      if (!token) {
        Alert.alert("Error", "No authentication token found");
        return;
      }

      // Fallback: Agar selectedPackage nahi mila to userData se try karo
      if (!selectedPackageId && userData?.activatedPackage?.role?._id) {
        selectedPackageId = userData.activatedPackage.role._id;
        console.log("🔄 Fallback: Got roleId from activatedPackage");
      }

      if (!selectedPackageId) {
        Alert.alert("Error", "Package ID not found. Please login again.");
        console.log("❌ No Package ID found even after fallback");
        return;
      }

      const paymentUrl = `https://gbs-stripe.vercel.app/?token=${encodeURIComponent(
        token,
      )}&roleId=${encodeURIComponent(selectedPackageId)}`;
      console.log("token", token);
      console.log("🔗 Final Payment URL:", paymentUrl);
      console.log("🆔 Sending roleId:", selectedPackageId);

      const supported = await Linking.canOpenURL(paymentUrl);
      if (supported) {
        await Linking.openURL(paymentUrl);
        setShowPaymentModal(false);
      } else {
        Alert.alert("Error", "Cannot open payment link right now.");
      }
    } catch (err) {
      console.error("Payment link error:", err);
      Alert.alert("Error", "Failed to open payment website.");
    }
  };

  // Close modal
  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Main Content — Scrollable */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`px-4 pt-12 pb-3`}>
          {/* Header */}
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <TouchableOpacity onPress={toggleSidebar}>
              <FontAwesome name="bars" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Notification")}
            >
              <FontAwesome name="bell" size={20} color="#d03030ff" />
            </TouchableOpacity>
          </View>

          {/* Guest Banner */}
          {guestExpiry && guestRemainingStr && (
            <TouchableOpacity
              style={tw`bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3 flex-row justify-between`}
              onPress={() => navigation.navigate("Signin")}
            >
              <Text style={tw`text-red-700 text-sm`}>
                Guest access — {guestRemainingStr} left
              </Text>
              <Text style={tw`text-red-600 font-semibold`}>Join Now</Text>
            </TouchableOpacity>
          )}

          {/* Search Bar */}
          <View
            style={tw`flex-row items-center bg-gray-100 rounded-lg px-2 mb-3 border`}
          >
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={tw`ml-2 flex-1 text-sm py-4`}
              placeholder="Search businesses, offers, users"
              value={searchQuery}
              onChangeText={setSearchQuery}
              blurOnSubmit={false}
              placeholderTextColor="black"
            />
          </View>

          {searchQuery.length > 1 && (
            <View
              style={tw`bg-white border rounded-lg mb-4 shadow-md max-h-96`}
            >
              <ScrollView nestedScrollEnabled={true}>
                {searchLoading ? (
                  <View style={tw`p-4 items-center`}>
                    <ActivityIndicator color="#EF4444" />
                    <Text style={tw`text-gray-500 mt-2`}>Searching...</Text>
                  </View>
                ) : (
                  <>
                    {businessResults.length > 0 && (
                      <View>
                        <Text
                          style={tw`px-4 pt-3 text-xs font-bold text-gray-600`}
                        >
                          BUSINESSES
                        </Text>
                        {businessResults.map((item) => (
                          <TouchableOpacity
                            key={item._id}
                            style={tw`px-4 py-3 border-b border-gray-200`}
                            onPress={() =>
                              navigation.navigate("BusinessDetail", {
                                id: item._id,
                              })
                            }
                          >
                            <Text style={tw`font-semibold text-base`}>
                              {item.companyName}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {offerResults.length > 0 && (
                      <View>
                        <Text
                          style={tw`px-4 pt-3 text-xs font-bold text-gray-600`}
                        >
                          OFFERS
                        </Text>
                        {offerResults.map((item) => (
                          <TouchableOpacity
                            key={item._id}
                            style={tw`px-4 py-3 border-b border-gray-200`}
                            onPress={() =>
                              navigation.navigate("OfferDetails", {
                                id: item._id,
                              })
                            }
                          >
                            <Text style={tw`text-base`}>{item.title}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {userResults.length > 0 && (
                      <View>
                        <Text
                          style={tw`px-4 pt-3 pb-2 text-xs font-bold text-gray-600`}
                        >
                          USERS
                        </Text>

                        {userResults.map((item) => (
                          <TouchableOpacity
                            key={item._id}
                            style={tw`px-4 py-3 border-b border-gray-200`}
                            onPress={() =>
                              navigation.navigate("Directory", {
                                screen: "DirectoryDetail",
                                params: { id: item._id },
                              })
                            }
                          >
                            <Text style={tw`text-base`}>{item.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {businessResults.length === 0 &&
                      offerResults.length === 0 &&
                      userResults.length === 0 && (
                        <Text style={tw`p-4 text-center text-gray-500`}>
                          No results found
                        </Text>
                      )}
                  </>
                )}
              </ScrollView>
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`mb-4`}
          >
            {tabs.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => handleTabPress(item.key)}
                style={tw.style(
                  `px-4 py-2 mr-2 rounded-md border`,
                  activeTab === item.key
                    ? "bg-red-100 border-red-500"
                    : "bg-white border-gray-300",
                )}
              >
                <Text
                  style={tw.style(
                    `text-sm font-medium`,
                    activeTab === item.key ? "text-red-600" : "text-gray-700",
                  )}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={tw`mb-6`}>
            <Text style={tw`font-extrabold text-lg mb-3`}>Latest News</Text>
            <FlatList
              data={newsData}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("NewsDetail", { newsId: item.id })
                  }
                  style={tw`mr-4 bg-white rounded-xl shadow-md overflow-hidden w-56`}
                >
                  <Image
                    source={item.image}
                    style={{ height: 120, width: "100%" }}
                    resizeMode="contain"
                  />
                  <View style={tw`p-3`}>
                    <Text style={tw`font-bold text-sm`} numberOfLines={3}>
                      {item.heading}
                    </Text>

                    <Text style={tw`text-red-500 font-semibold mt-1`}>
                      {item.id === "1" ? "$ 99.95" : ""}
                    </Text>
                    <Text style={tw`text-red-500 font-semibold mt-1`}>
                      {item.id === "2" ? "$ 7,500 include GST" : ""}
                    </Text>
                    <Text style={tw`text-gray-500 text-xs mt-1`}>
                      {item.location}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={tw`mb-6`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <Text style={tw`font-extrabold text-lg`}>
                {activeTab === "all" ? "All Events" : `${activeTab} Events`}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("social")}>
                <Text style={tw`text-red-500 font-medium`}>See all Events</Text>
              </TouchableOpacity>
            </View>
            <Cards stateFilter={activeTab} limit={10} />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closePaymentModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.75)", // ← This is the correct way in React Native
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              padding: 32,
              width: "100%",
              maxWidth: 340,
            }}
          >
            <Text style={tw`text-2xl font-bold text-center mb-3 text-gray-900`}>
              Activate Your Membership
            </Text>

            <Text style={tw`text-gray-600 text-center mb-8 leading-6`}>
              To enjoy all features including My Business, Events, and more,
              please complete your membership payment.
            </Text>

            <TouchableOpacity
              onPress={handleVisitPaymentWebsite}
              style={tw`bg-red-500 py-4 rounded-2xl mb-4`}
            >
              <Text style={tw`text-white text-center font-semibold text-lg`}>
                Visit Website
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={closePaymentModal} style={tw`py-3`}>
              <Text style={tw`text-gray-500 text-center font-medium`}>
                Remind Me Later
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>

      {/* Package Upgrade Success Modal */}
      <Modal visible={upgradeSuccessVisible} transparent animationType="fade">
        <View
          style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}
        >
          <View style={tw`bg-white w-11/12 max-w-md rounded-2xl p-6`}>
            <Text style={tw`text-lg font-bold text-gray-900 text-center`}>
              Package Upgraded
            </Text>
            <Text style={tw`text-sm text-gray-600 text-center mt-2`}>
              We will credit the remaining balance on your current membership
              should you upgrade during your current term.
            </Text>
            <View style={tw`flex-row mt-5`}>
              <TouchableOpacity
                style={tw`flex-1 bg-red-500 py-2 rounded-lg`}
                onPress={() => setUpgradeSuccessVisible(false)}
              >
                <Text style={tw`text-white text-center font-semibold`}>
                  Great!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Drawer Overlay — Yeh sabse upar render hoga */}
      <Drawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}
