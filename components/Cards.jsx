import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";

const BASE_API_URL = "https://gbs.westsidecarcare.com.au/events";

const Cards = ({ stateFilter }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("events", events);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Build URL with state param if not "all"
        const url =
          stateFilter && stateFilter !== "all"
            ? `${BASE_API_URL}?state=${stateFilter}`
            : BASE_API_URL;

        const response = await fetch(url);
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [stateFilter]); // refetch whenever tab changes

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date not available";
    const date = new Date(dateStr);
    return date
      .toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  };

  const renderEvent = ({ item }) => {
    const startDate = formatDate(item?.startDate);
    const endDate = formatDate(item?.endDate);

    return (
      <Pressable
        style={({ pressed }) => [
          tw`bg-white p-4 m-2 rounded-xl shadow`,
          pressed && tw`bg-gray-100`,
        ]}
        onPress={() =>
          navigation.navigate("EventDetail", { eventId: item?._id })
        }
      >
        <Text style={tw`text-lg font-bold text-black`}>
          {item?.title || "Untitled Event"}
        </Text>
        <Text style={tw`text-gray-600 mt-1`}>
          {item?.description || "No description available"}
        </Text>

        {/* Start Date */}
        <View style={tw`mt-2 flex-row`}>
          <Text style={tw`text-black text-sm font-semibold`}>StartDate: </Text>
          <Text style={tw`text-black text-sm`}>{startDate}</Text>
        </View>

        {/* End Date */}
        <View style={tw`mt-1 flex-row`}>
          <Text style={tw`text-black text-sm font-semibold`}>EndDate: </Text>
          <Text style={tw`text-black text-sm`}>{endDate}</Text>
        </View>

        {/* State */}
        <View style={tw`mt-1 mb-2 flex-row`}>
          <Text style={tw`text-black text-sm font-semibold`}>State: </Text>
          <Text style={tw`text-red-500 text-sm`}>{item?.state || "N/A"}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={tw`flex-1`}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff4d4f" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item, index) =>
            item?._id?.toString() || index.toString()
          }
          renderItem={renderEvent}
          contentContainerStyle={tw`p-2`}
          ListEmptyComponent={
            <Text style={tw`text-gray-500 text-center mt-4`}>
              No events found for {stateFilter}
            </Text>
          }
        />
      )}
    </View>
  );
};

export default Cards;
