import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
import MapboxPolygonDrawer from "./MapboxPolygonDrawer";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as turf from "@turf/turf";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_BASE_URL } from "../utils/config";

export default function NotificationForm({
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const notification = route.params?.notification;

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    area: { type: "MultiPolygon", coordinates: [] },
    startDate: new Date(),
    endDate: new Date(),
    SendToAll: true,
    roles: [], // 👈 selected roles
  });

  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roles, setRoles] = useState([]);

  // Pre-fill form when editing
  useEffect(() => {
    if (notification) {
      const coords = notification.area?.coordinates || [];
      setFormData({
        ...notification,
        startDate: notification.startDate
          ? new Date(notification.startDate)
          : new Date(),
        endDate: notification.endDate
          ? new Date(notification.endDate)
          : new Date(),
        roles: (notification.roles || []).map((r) =>
          typeof r === "string" ? r : r._id
        ),

        area: {
          type: "MultiPolygon",
          coordinates: Array.isArray(coords) ? coords : [],
        },
      });
    }
  }, [notification]);

  // Load roles from API
  useEffect(() => {
    loadRoles();
  }, []);

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
      console.log(
        "[NotificationForm] roles error:",
        e.response?.data || e.message
      );
      Alert.alert("Error", "Failed to load roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  const toggleRole = (roleId) => {
    setFormData((prev) => {
      const alreadySelected = prev.roles.includes(roleId);
      return {
        ...prev,
        roles: alreadySelected
          ? prev.roles.filter((id) => id !== roleId) // remove
          : [...prev.roles, roleId], // add
      };
    });
  };

  const handleSubmit = async () => {
    try {
      let fixedCoords = [];

      if (formData.area.coordinates.length > 0) {
        const coords = formData.area.coordinates[0][0] || [];

        if (coords.length < 4) {
          Alert.alert("Error", "Polygon must have at least 4 points.");
          return;
        }

        let polygon = turf.polygon([coords]);
        polygon = turf.cleanCoords(polygon);

        if (!turf.booleanValid(polygon)) {
          const unkinked = turf.unkinkPolygon(polygon);
          if (unkinked.features.length > 0) {
            polygon = unkinked.features[0];
          }
        }

        fixedCoords =
          polygon.geometry.type === "Polygon"
            ? [[polygon.geometry.coordinates[0]]]
            : polygon.geometry.coordinates;
      }

      const payload = {
        ...formData,
        area: { type: "MultiPolygon", coordinates: fixedCoords },
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      };

      console.log("📦 Payload:", JSON.stringify(payload, null, 2));

      // 🔄 Check create or update
      let res;
      if (notification?._id) {
        // UPDATE
        res = await axios.put(
          `${API_BASE_URL}/notification/${notification._id}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        // CREATE
        res = await axios.post(`${API_BASE_URL}/notification`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log("✅ API Response:", res.data);

      Alert.alert(
        "Success",
        notification
          ? "Notification updated successfully!"
          : "Notification created successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              if (onSubmit) onSubmit(payload);
              navigation.goBack(); // 👈 list me wapas
            },
          },
        ]
      );
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to save notification.");
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-white p-4 mt-14 mb-20`}>
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
      {/* <DateTimePicker
        value={formData.startDate}
        mode="datetime"
        onChange={(e, date) =>
          date && setFormData((p) => ({ ...p, startDate: date }))
        }
      /> */}

      <Text style={tw`text-sm text-gray-700 mt-4 mb-1`}>End Date</Text>
      {/* <DateTimePicker
        value={formData.endDate}
        mode="datetime"
        onChange={(e, date) =>
          date && setFormData((p) => ({ ...p, endDate: date }))
        }
      /> */}

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

      {/* Roles */}
      <View style={tw`mt-6`}>
        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Roles *</Text>
        {loadingRoles ? (
          <View style={tw`flex-row items-center`}>
            <ActivityIndicator color="#DC2626" size="small" />
            <Text style={tw`ml-2 text-gray-500 text-sm`}>Loading roles...</Text>
          </View>
        ) : (
          <View style={tw`flex-row flex-wrap`}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role._id}
                style={tw.style(
                  `px-3 py-1 rounded-full mr-2 mb-2`,
                  formData.roles.includes(role._id)
                    ? `bg-red-500`
                    : `bg-gray-200`
                )}
                onPress={() => toggleRole(role._id)}
              >
                <Text
                  style={tw.style(
                    `text-xs font-medium`,
                    formData.roles.includes(role._id)
                      ? `text-white`
                      : `text-gray-700`
                  )}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Map Polygon Drawer */}
      {!formData.SendToAll && (
        <View style={tw`mt-6 h-80`}>
          <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
            Select Area (Draw Polygon)
          </Text>
          <MapboxPolygonDrawer
            coordinates={formData.area?.coordinates || []}
            setCoordinates={(coords) => {
              console.log(
                "🗺️ Selected Coordinates:",
                JSON.stringify(coords, null, 2)
              );
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
          onPress={() => navigation.goBack()}
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
