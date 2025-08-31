import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";

const API_URL = "https://gbs.westsidecarcare.com.au/events";

const CreateEvent = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async () => {
    try {
      setLoading(true);

      const body = {
        title,
        description,
        state,
        area: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [151.2093, -33.8688],
                [151.2094, -33.8689],
                [151.2095, -33.8688],
                [151.2093, -33.8688],
              ],
            ],
          ],
        },
        openToAll: false,
        startDate: "2025-09-10T18:00:00.000Z",
        endDate: "2025-09-10T21:00:00.000Z",
        roles: ["60f8a2f0e1d3c2001cf6b1e7"],
        imageUrl: "event-images/uuid-filename.jpg",
      };

      const token = "YOUR_JWT_TOKEN"; // replace with stored token

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Event created successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Create Event</Text>

      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
      />

      <TextInput
        placeholder="State"
        value={state}
        onChangeText={setState}
        style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
      />

      <TouchableOpacity
        onPress={handleCreateEvent}
        disabled={loading}
        style={tw`bg-red-500 py-3 rounded-lg`}
      >
        <Text style={tw`text-center text-white font-bold`}>
          {loading ? "Creating..." : "Create Event"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateEvent;
