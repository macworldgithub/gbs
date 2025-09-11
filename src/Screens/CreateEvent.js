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


// screens/CreateEvent.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import MapboxPolygonDrawer from "./MapboxPolygonDrawer";

export default function CreateEvent({ navigation }) {
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [submittingEvent, setSubmittingEvent] = useState(false);
    const [coordinates, setCoordinates] = useState([]);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        state: "VIC",
        startDate: new Date(),
        endDate: new Date(),
        selectedRoleId: "",
    });

    // Fetch roles
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
            Alert.alert("Error", "Failed to load roles");
        } finally {
            setLoadingRoles(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    // Start date change
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

    // End date change
    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
            setEventForm((prev) => ({ ...prev, endDate: selectedDate }));
        }
    };

    // Submit event
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

            const res = await axios.post(`${API_BASE_URL}/events`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            Alert.alert("Success", "Event created successfully!");
            navigation.goBack();
        } catch (e) {
            Alert.alert("Error", "Failed to create event. Please try again.");
        } finally {
            setSubmittingEvent(false);
        }
    };

    return (
        <View style={tw`flex-1 bg-white p-4 mt-14`}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={tw`text-lg font-bold text-center mb-4`}>
                    Create New Event
                </Text>

                {/* Title */}
                <Text style={tw`mb-1 text-sm font-semibold text-gray-700`}>Event Title</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`}
                    placeholder="Enter event title"
                    value={eventForm.title}
                    onChangeText={(text) => setEventForm({ ...eventForm, title: text })}
                />

                {/* Description */}
                <Text style={tw`mb-1 text-sm font-semibold text-gray-700`}>Description</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`}
                    placeholder="Enter description"
                    multiline
                    value={eventForm.description}
                    onChangeText={(text) =>
                        setEventForm({ ...eventForm, description: text })
                    }
                />

                {/* State Selector */}
                <Text style={tw`mb-1 text-sm font-semibold text-gray-700`}>State</Text>
                <View style={tw`flex-row mb-4`}>
                    {["VIC", "NSW", "QLD", "SA"].map((state) => (
                        <TouchableOpacity
                            key={state}
                            style={tw.style(
                                `px-3 py-1 rounded-full mr-2`,
                                eventForm.state === state ? "bg-red-500" : "bg-gray-200"
                            )}
                            onPress={() => setEventForm({ ...eventForm, state })}
                        >
                            <Text
                                style={tw.style(
                                    `text-xs font-medium`,
                                    eventForm.state === state ? "text-white" : "text-gray-700"
                                )}
                            >
                                {state}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Start Date */}
                <Text style={tw`mb-1 text-sm font-semibold text-gray-700`}>Start Date</Text>
                <TouchableOpacity
                    style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`}
                    onPress={() => setShowStartDatePicker(true)}
                >
                    <Text>
                        {eventForm.startDate.toLocaleDateString()}{" "}
                        {eventForm.startDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </TouchableOpacity>

                {/* End Date */}
                <Text style={tw`mb-1 text-sm font-semibold text-gray-700`}>End Date</Text>
                <TouchableOpacity
                    style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`}
                    onPress={() => setShowEndDatePicker(true)}
                >
                    <Text>
                        {eventForm.endDate.toLocaleDateString()}{" "}
                        {eventForm.endDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </TouchableOpacity>

                {/* Roles */}
                <Text style={tw`mb-1 text-sm font-semibold text-gray-700`}>Select Role</Text>
                {loadingRoles ? (
                    <ActivityIndicator color="#DC2626" />
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {roles.map((role) => (
                            <TouchableOpacity
                                key={role._id}
                                style={tw.style(
                                    `px-3 py-1 rounded-full mr-2 mb-4`,
                                    eventForm.selectedRoleId === role._id
                                        ? "bg-red-500"
                                        : "bg-gray-200"
                                )}
                                onPress={() =>
                                    setEventForm({ ...eventForm, selectedRoleId: role._id })
                                }
                            >
                                <Text
                                    style={tw.style(
                                        `text-xs font-medium`,
                                        eventForm.selectedRoleId === role._id
                                            ? "text-white"
                                            : "text-gray-700"
                                    )}
                                >
                                    {role.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Polygon Drawer */}
                <Text style={tw`mb-1 text-sm font-semibold text-gray-700`}>
                    Select Area (Polygon)
                </Text>
                <View style={{ height: 300, marginBottom: 20 }}>
                    <MapboxPolygonDrawer
                        coordinates={coordinates}
                        setCoordinates={setCoordinates}
                    />
                </View>

                <View style={tw`flex-row mt-4`}>
                    <TouchableOpacity
                        style={tw`flex-1 bg-gray-200 py-2 rounded-lg mr-2`}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={tw`text-gray-800 text-center font-semibold`}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`flex-1 bg-red-500 py-2 rounded-lg ml-2`}
                        onPress={createEvent}
                        disabled={submittingEvent}
                    >
                        <Text style={tw`text-white text-center font-semibold`}>
                            {submittingEvent ? "Creating..." : "Create Event"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Date Pickers */}
            {showStartDatePicker && (
                <DateTimePicker
                    value={eventForm.startDate}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                />
            )}
            {showEndDatePicker && (
                <DateTimePicker
                    value={eventForm.endDate}
                    mode="date"
                    display="default"
                    onChange={onEndDateChange}
                />
            )}
        </View>
    );
}
