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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { API_BASE_URL } from "../utils/config";
import MapboxPolygonDrawer from "./MapboxPolygonDrawer";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

export default function CreateEvent({ navigation }) {
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [submittingEvent, setSubmittingEvent] = useState(false);
    const [coordinates, setCoordinates] = useState([]);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);


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

                <Text style={tw`text-sm text-gray-700 mb-1`}>Start Date</Text>
                <TouchableOpacity
                    onPress={() => setShowStartPicker(true)}
                    style={tw`border p-2 rounded mb-4`}
                >
                    <Text>
                        {eventForm.startDate
                            ? eventForm.startDate.toLocaleString()
                            : "Select start date"}
                    </Text>
                </TouchableOpacity>

                {showStartPicker && (
                    <DateTimePicker
                        value={eventForm.startDate || new Date()}
                        mode="datetime"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(e, date) => {
                            setShowStartPicker(Platform.OS === "ios"); // iOS me open rehne de, Android me band karo
                            if (date) {
                                setEventForm((p) => ({ ...p, startDate: date }));
                            }
                        }}
                    />
                )}

                <Text style={tw`text-sm text-gray-700 mt-4 mb-1`}>End Date</Text>
                <TouchableOpacity
                    onPress={() => setShowEndPicker(true)}
                    style={tw`border p-2 rounded mb-4`}
                >
                    <Text>
                        {eventForm.endDate
                            ? eventForm.endDate.toLocaleString()
                            : "Select end date"}
                    </Text>
                </TouchableOpacity>

                {showEndPicker && (
                    <DateTimePicker
                        value={eventForm.endDate || new Date()}
                        mode="datetime"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(e, date) => {
                            setShowEndPicker(Platform.OS === "ios"); // iOS me open rehne de, Android me band karo
                            if (date) {
                                setEventForm((p) => ({ ...p, endDate: date }));
                            }
                        }}
                    />
                )}

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
