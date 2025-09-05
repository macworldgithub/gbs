// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
// } from "react-native";
// import tw from "tailwind-react-native-classnames";
// // import DateTimePickerModal from "react-native-modal-datetime-picker";
// import * as ImagePicker from "expo-image-picker";
// import { API_BASE_URL } from "../utils/config";
// import { getUserData } from "../utils/storage";

// const AddEventScreen = ({ navigation }) => {
//   const [eventName, setEventName] = useState("");
//   const [description, setDescription] = useState("");
//   const [eventDate, setEventDate] = useState(null);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [location, setLocation] = useState("");
//   const [ticketPrice, setTicketPrice] = useState("");
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
//   const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Date / Time Pickers
//   const handleDateConfirm = (date) => {
//     setEventDate(date);
//     setDatePickerVisibility(false);
//   };

//   const handleStartTimeConfirm = (time) => {
//     setStartTime(time);
//     setStartTimePickerVisibility(false);
//   };

//   const handleEndTimeConfirm = (time) => {
//     setEndTime(time);
//     setEndTimePickerVisibility(false);
//   };

//   const formatDate = (date) => date?.toLocaleDateString() || "";
//   const formatTime = (time) => time?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "";

//   // ✅ Create Event API call
//   const handleCreateEvent = async () => {
//     if (!eventName || !description || !eventDate || !startTime || !endTime || !location || !ticketPrice) {
//       Alert.alert("Validation Error", "Please fill in all fields.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const body = {
//         name: eventName,
//         description,
//         date: eventDate.toISOString(),
//         startTime: startTime.toISOString(),
//         endTime: endTime.toISOString(),
//         location,
//         ticketPrice: parseFloat(ticketPrice),
//       };

//       // ✅ get token only here
//       const userData = await getUserData();
//       const token = userData?.token;
//       if (!token) {
//         Alert.alert("Auth Error", "User not logged in or token missing");
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(`${API_BASE_URL}/events/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Something went wrong");

//       Alert.alert("Success", "Event created successfully!");
//       navigation.goBack();
//     } catch (error) {
//       Alert.alert("Error", error.message || "Failed to create event.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={tw`flex-1 p-5 bg-white`}>
//       <Text style={tw`text-2xl font-bold mb-5`}>Add Event</Text>

//       <TextInput
//         style={tw`border border-gray-300 p-3 rounded-lg mb-4`}
//         placeholder="Event Name"
//         value={eventName}
//         onChangeText={setEventName}
//       />

//       <TextInput
//         style={tw`border border-gray-300 p-3 rounded-lg mb-4`}
//         placeholder="Description"
//         multiline
//         value={description}
//         onChangeText={setDescription}
//       />

//       {/* Date */}
//       <TouchableOpacity
//         style={tw`border border-gray-300 p-3 rounded-lg mb-4`}
//         onPress={() => setDatePickerVisibility(true)}
//       >
//         <Text>{eventDate ? formatDate(eventDate) : "Select Event Date"}</Text>
//       </TouchableOpacity>
//       {/* <DateTimePickerModal
//         isVisible={isDatePickerVisible}
//         mode="date"
//         onConfirm={handleDateConfirm}
//         onCancel={() => setDatePickerVisibility(false)}
//       /> */}

//       {/* Start Time */}
//       <TouchableOpacity
//         style={tw`border border-gray-300 p-3 rounded-lg mb-4`}
//         onPress={() => setStartTimePickerVisibility(true)}
//       >
//         <Text>{startTime ? formatTime(startTime) : "Select Start Time"}</Text>
//       </TouchableOpacity>
//       {/* <DateTimePickerModal
//         isVisible={isStartTimePickerVisible}
//         mode="time"
//         onConfirm={handleStartTimeConfirm}
//         onCancel={() => setStartTimePickerVisibility(false)}
//       /> */}

//       {/* End Time */}
//       <TouchableOpacity
//         style={tw`border border-gray-300 p-3 rounded-lg mb-4`}
//         onPress={() => setEndTimePickerVisibility(true)}
//       >
//         <Text>{endTime ? formatTime(endTime) : "Select End Time"}</Text>
//       </TouchableOpacity>
//       {/* <DateTimePickerModal
//         isVisible={isEndTimePickerVisible}
//         mode="time"
//         onConfirm={handleEndTimeConfirm}
//         onCancel={() => setEndTimePickerVisibility(false)}
//       /> */}

//       <TextInput
//         style={tw`border border-gray-300 p-3 rounded-lg mb-4`}
//         placeholder="Location"
//         value={location}
//         onChangeText={setLocation}
//       />

//       <TextInput
//         style={tw`border border-gray-300 p-3 rounded-lg mb-4`}
//         placeholder="Ticket Price"
//         keyboardType="numeric"
//         value={ticketPrice}
//         onChangeText={setTicketPrice}
//       />

//       <TouchableOpacity
//         style={tw`bg-blue-500 p-4 rounded-lg`}
//         onPress={handleCreateEvent}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={tw`text-white text-center text-lg font-semibold`}>
//             Create Event
//           </Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default AddEventScreen;
