import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapboxPolygonDrawer from "./MapboxPolygonDrawer";
import tw from "tailwind-react-native-classnames";
import axios from "axios";

export default function NotificationForm({
  notification,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    area: { type: "MultiPolygon", coordinates: [] },
    startDate: new Date(),
    endDate: new Date(),
    SendToAll: false,
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        ...notification,
        startDate: notification.startDate
          ? new Date(notification.startDate)
          : new Date(),
        endDate: notification.endDate
          ? new Date(notification.endDate)
          : new Date(),
      });
    }
  }, [notification]);

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
      roles: [
        "60f8a2f0e1d3c2001cf6b1e7", // example role IDs
        "60f8a2f0e1d3c2001cf6b1e8",
      ],
    };

    console.log("📦 Payload to be sent:", JSON.stringify(payload, null, 2));

    try {
      const res = await axios.post(
        "https://gbs.westsidecarcare.com.au/notification",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("✅ API Response:", res.data);
      Alert.alert("Success", "Notification created successfully!");
      if (onSubmit) onSubmit(payload);
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to create notification.");
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-white p-4 mt-14`}>
      <Text style={tw`text-lg font-semibold mb-4`}>
        {notification ? "Edit Notification" : "Create Notification"}
      </Text>

      {/* Title */}
      <Text style={tw`text-sm text-gray-700 mb-1`}>Title</Text>
      <TextInput
        style={tw`border p-2 rounded mb-4`}
        value={formData.title}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, title: text }))
        }
        placeholder="Enter notification title"
      />

      {/* Message */}
      <Text style={tw`text-sm text-gray-700 mb-1`}>Message</Text>
      <TextInput
        style={tw`border p-2 rounded mb-4`}
        value={formData.message}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, message: text }))
        }
        placeholder="Enter notification message"
        multiline
      />

      {/* Start & End Date */}
      <Text style={tw`text-sm text-gray-700 mb-1`}>Start Date</Text>
      <DateTimePicker
        value={formData.startDate}
        mode="datetime"
        onChange={(e, date) =>
          date && setFormData((p) => ({ ...p, startDate: date }))
        }
      />

      <Text style={tw`text-sm text-gray-700 mt-4 mb-1`}>End Date</Text>
      <DateTimePicker
        value={formData.endDate}
        mode="datetime"
        onChange={(e, date) =>
          date && setFormData((p) => ({ ...p, endDate: date }))
        }
      />

      {/* Send to All */}
      <View style={tw`flex-row items-center mt-4`}>
        <Text style={tw`flex-1 text-sm text-gray-700`}>Send to World</Text>
        <Switch
          value={formData.SendToAll}
          onValueChange={(val) =>
            setFormData((p) => ({ ...p, SendToAll: val }))
          }
        />
      </View>

      {/* Map Polygon Drawer */}
      {!formData.SendToAll && (
        <View style={tw`mt-6 h-80`}>
          <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
            Select Area (Draw Polygon)
          </Text>
          <MapboxPolygonDrawer
            coordinates={formData.area.coordinates}
            setCoordinates={(coords) => {
              console.log("🗺️ Selected Coordinates:", JSON.stringify(coords, null, 2));
              setFormData((p) => ({
                ...p,
                area: { type: "MultiPolygon", coordinates: coords },
              }));
            }}
          />

        </View>
      )}

      {/* Actions */}
      <View style={tw`flex-row justify-end mt-6`}>
        <TouchableOpacity
          onPress={onCancel}
          style={tw`px-4 py-2 bg-gray-200 rounded mr-2`}
        >
          <Text style={tw`text-gray-700`}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          style={tw`px-4 py-2 bg-blue-600 rounded`}
        >
          <Text style={tw`text-white`}>
            {isLoading ? "Saving..." : notification ? "Update" : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
