import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import axios from "axios";
import moment from "moment";
import { API_BASE_URL } from "../utils/config";

export default function WellbeingScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Resources");
  const [stateFilter, setStateFilter] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const states = ["All", "NSW", "VIC", "QLD", "SA", "WA"];

  const fetchEvents = async (selectedState = "All") => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/events/wellbeing`, {
        params: { state: selectedState, page: 1, limit: 10 },
        headers: { accept: "application/json" },
      });

      if (response.data && Array.isArray(response.data.events)) {
        setEvents(response.data.events);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(stateFilter);
  }, [stateFilter]);

  const renderCard = (item) => (
    <View key={item._id} style={tw`bg-gray-100 rounded-lg p-4 mb-4`}>
      {/* Image */}
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={{
            width: "100%",
            height: 160,
            borderRadius: 8,
            marginBottom: 8,
          }}
          resizeMode="cover"
        />
      ) : null}

      {/* Title */}
      <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>
        {item.title || "Untitled Event"}
      </Text>

      {/* Date & Location */}
      <View style={tw`flex-row items-center mb-2`}>
        <FontAwesome name="calendar" size={14} color="gray" />
        <Text style={tw`text-xs text-gray-500 ml-1`}>
          {moment(item.startDate).format("MMMM D, YYYY")}
        </Text>
        <FontAwesome
          name="map-marker"
          size={14}
          color="gray"
          style={tw`ml-3`}
        />
        <Text style={tw`text-xs text-gray-500 ml-1`}>
          {item.locationNames?.[0] || item.state || "Unknown"}
        </Text>
      </View>

      {/* Description */}
      <Text style={tw`text-sm text-gray-600 mb-3`}>
        {item.description || "No description available."}
      </Text>

      {/* Creator */}
      {item.creator?.name && (
        <View style={tw`flex-row items-center mb-3`}>
          {item.creator.avatarUrl ? (
            <Image
              source={{ uri: item.creator.avatarUrl }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                marginRight: 8,
              }}
            />
          ) : null}
          <Text style={tw`text-xs text-gray-700`}>
            Created by {item.creator.name}
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={tw`flex-row`}>
        <TouchableOpacity style={tw` px-3 py-2 rounded-lg mr-2`}>
          <Text style={tw`text-xs font-medium`}>
            <Text style={tw`text-black`}>state: </Text>
            <Text style={tw`text-red-500`}>{item.state || "Event"}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Header */}
      <View style={tw`pt-14`}>
        <View style={tw`flex-row items-center mb-1`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-gray-800 mb-1 ml-2`}>
            Your Wellbeing Matters
          </Text>
        </View>
        <View
          style={tw`border border-gray-300 rounded-2xl px-5 py-4 mb-4 bg-white shadow-sm`}>
          <Text style={tw`text-sm text-gray-600 mb-2`}>
            GBS is here to support your health journey. In this area you can
            access trusted resources, expert partners and a community that
            cares. Your wellbeing matters to all of us.
          </Text>

          <Text style={tw`text-sm text-gray-600 mb-2`}>
            If you need support or just want to have a confidential chat, call
            the GBS Team on <Text style={tw`font-bold`}>1300 071 215</Text>.
          </Text>
        </View>
      </View>

      {/* State Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mb-4`}
      >
        {/* {states.map((state) => (
          <TouchableOpacity
            key={state}
            style={tw`px-4 py-2 mr-2 rounded-md ${
              stateFilter === state ? "bg-red-500" : "bg-gray-100"
            }`}
            onPress={() => setStateFilter(state)}
          >
            <Text
              style={tw`${stateFilter === state ? "text-white" : "text-gray-700"}`}
            >
              {state}
            </Text>
          </TouchableOpacity>
        ))} */}
      </ScrollView>

      {/* Events List */}
      {loading ? (
        <ActivityIndicator size="large" color="#ef4444" style={tw`mt-6`} />
      ) : events.length > 0 ? (
        events.map(renderCard)
      ) : (
        <Text style={tw`text-gray-500 text-center mt-6`}>
          No events found for this state.
        </Text>
      )}
    </ScrollView>
  );
}
