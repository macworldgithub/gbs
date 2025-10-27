import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import tw from "tailwind-react-native-classnames";

const API_URL = "https://gbs.westsidecarcare.com.au/events";

const EventDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/${eventId}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (res.ok) {
          setEvent(data);
        } else {
          Alert.alert("Error", data.message || "Failed to fetch event details");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading)
    return <ActivityIndicator size="large" color="red" style={tw`mt-10`} />;

  if (!event)
    return (
      <Text style={tw`text-center mt-10 text-gray-500`}>Event not found</Text>
    );

  return (
    // <ScrollView style={tw`flex-1 bg-white p-4 mt-6`}>
    //   <View style={tw`flex-row items-center justify-between mt-8 mb-4`}>
    //     <TouchableOpacity onPress={() => navigation.goBack()}>
    //       <Ionicons name="arrow-back" size={24} color="black" />
    //     </TouchableOpacity>
    //     <Text style={tw`text-xl font-bold`}>Event Offers</Text>
    //     <View style={{ width: 24 }} />
    //   </View>
    //   <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
    //     {event.title}
    //   </Text>
    //   {/* Description */}
    //   <Text style={tw`text-base text-gray-700 mb-4`}>{event.description}</Text>

    //   {/* Dates */}
    //   <Text style={tw`text-sm text-gray-600`}>
    //     Start: {new Date(event.startDate).toLocaleString()}
    //   </Text>
    //   <Text style={tw`text-sm text-gray-600 mb-4`}>
    //     End: {new Date(event.endDate).toLocaleString()}
    //   </Text>

    //   {/* State */}
    //   <Text style={tw`text-sm text-gray-600 mb-2`}>
    //     State: {event.state || "N/A"}
    //   </Text>

    //   {/* Location */}
    //   <Text style={tw`text-sm text-gray-600 mb-2`}>
    //     Location:{" "}
    //     {Array.isArray(event.locationNames)
    //       ? event.locationNames.join(", ")
    //       : event.locationNames || "N/A"}
    //   </Text>

    //   {/* Creator */}
    //   <Text style={tw`text-sm text-gray-600 mb-4`}>
    //     Created by: {event.creator?.name || "Unknown"}
    //   </Text>

    //   {/* Attendees */}
    //   <Text style={tw`font-bold text-gray-800 mb-2`}>Attendees:</Text>
    //   {event.attendees?.length > 0 ? (
    //     event.attendees.map((att) => (
    //       <Text key={att._id} style={tw`text-sm text-gray-700`}>
    //         • {att.name}
    //       </Text>
    //     ))
    //   ) : (
    //     <Text style={tw`text-gray-500`}>No attendees yet</Text>
    //   )}
    // </ScrollView>
    <ScrollView style={tw`flex-1 bg-white p-4 `}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mt-12 mb-6`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-red-600`}>Event Detail</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Event Card */}
      <View
        style={tw`bg-white border border-red-100 rounded-2xl shadow-md p-5 mb-6`}
      >
        <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>
          {event.title}
        </Text>
        <Text style={tw`text-base text-gray-600 mb-4 leading-5`}>
          {event.description}
        </Text>

        {/* Dates */}
        <View style={tw`mb-3`}>
          <Text style={tw`text-sm text-gray-700 mb-1`}>
            <Text style={tw`font-semibold text-red-500`}>Start:</Text>{" "}
            {new Date(event.startDate).toLocaleString()}
          </Text>
          <Text style={tw`text-sm text-gray-700`}>
            <Text style={tw`font-semibold text-red-500`}>End:</Text>{" "}
            {new Date(event.endDate).toLocaleString()}
          </Text>
        </View>

        {/* State */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>
          <Text style={tw`font-semibold text-red-500`}>State:</Text>{" "}
          {event.state || "N/A"}
        </Text>

        {/* Location */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>
          <Text style={tw`font-semibold text-red-500`}>Location:</Text>{" "}
          {Array.isArray(event.locationNames)
            ? event.locationNames.join(", ")
            : event.locationNames || "N/A"}
        </Text>

        {/* Creator */}
        <Text style={tw`text-sm text-gray-700 mb-2`}>
          <Text style={tw`font-semibold text-red-500`}>Created by:</Text>{" "}
          {event.creator?.name || "Unknown"}
        </Text>
      </View>

      {/* Attendees Section */}
      <View
        style={tw`bg-white border border-red-100 rounded-2xl shadow-md p-5`}
      >
        <Text style={tw`font-bold text-lg text-red-600 mb-3`}>Attendees</Text>
        {event.attendees?.length > 0 ? (
          event.attendees.map((att) => (
            <View key={att._id} style={tw`flex-row items-center mb-2`}>
              <View
                style={tw`w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-2`}
              >
                <Text style={tw`text-red-600 font-bold`}>
                  {att.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={tw`text-sm text-gray-700`}>{att.name}</Text>
            </View>
          ))
        ) : (
          <Text style={tw`text-gray-500 italic`}>No attendees yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default EventDetail;
