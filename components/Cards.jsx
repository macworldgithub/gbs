import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "../src/utils/storage";

const BASE_API_URL = "https://gbs.westsidecarcare.com.au/events";

const Cards = ({ stateFilter }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookedEvents, setBookedEvents] = useState([]); // ✅ new state
  const navigation = useNavigation();

  // ---------- FETCH EVENTS ----------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const url =
          stateFilter && stateFilter !== "all"
            ? `${BASE_API_URL}?state=${stateFilter}`
            : BASE_API_URL;

        const response = await fetch(url);
        const data = await response.json();
        setEvents(Array.isArray(data.events) ? data.events : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [stateFilter]);

  // ---------- DATE FORMAT ----------
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Date not available";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ---------- BUY TICKET ----------
  const handleBuyTicket = async (eventId) => {
    try {
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        Alert.alert("Login Required", "Please log in to buy a ticket.");
        return;
      }

      // Prevent duplicate booking
      if (bookedEvents.includes(eventId)) {
        Alert.alert("Already Booked", "You have already booked this event.");
        return;
      }

      const url = `${BASE_API_URL}/${eventId}/book_ticket`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("response ticket booking", result);

      if (response.ok) {
        Alert.alert("Success", "Your ticket has been booked successfully!");
        setBookedEvents((prev) => [...prev, eventId]); // ✅ mark as booked
      } else {
        Alert.alert("Failed", result?.message || "Unable to book ticket.");
      }
    } catch (error) {
      console.error("Error booking ticket:", error);
      Alert.alert("Error", "Something went wrong while booking the ticket.");
    }
  };

  // ---------- IMAGE COMPONENT ----------
  const EventImage = ({ imageUrl }) => {
    const [imageError, setImageError] = useState(false);
    const source =
      !imageError && imageUrl && imageUrl.trim() !== ""
        ? { uri: imageUrl }
        : require("../assets/fallback.png");

    return (
      <Image
        source={source}
        style={tw`w-full h-full`}
        resizeMode="cover"
        onError={() => setImageError(true)}
      />
    );
  };

  // ---------- RENDER EACH EVENT ----------
  const renderEvent = ({ item }) => {
    const dateTime = formatDateTime(item?.startDate);
    const cost = item?.roles?.[0]?.cost || item?.cost;
    const isBooked = bookedEvents.includes(item?._id); // ✅ check booked status

    return (
      <Pressable
        style={({ pressed }) => [
          tw`bg-white flex-row justify-between items-start p-4 m-2 rounded-xl shadow border border-gray-200`,
          pressed && tw`bg-gray-100`,
        ]}
        onPress={() =>
          navigation.navigate("EventDetail", { eventId: item?._id })
        }
      >
        {/* LEFT SIDE */}
        <View style={tw`flex-1 pr-3`}>
          <Text style={tw`text-lg font-bold text-black mb-1`}>
            {item?.title || "Untitled Event"}
          </Text>
          <Text style={tw`text-gray-600 mb-1`}>
            {item?.locationNames?.[0] ||
              item?.location ||
              "No location specified"}
          </Text>
          <Text style={tw`text-sm text-black mb-1`}>
            <Text style={tw`font-semibold`}>Date–Time: </Text>
            {dateTime}
          </Text>
          <Text style={tw`text-sm text-black mb-2`}>
            <Text style={tw`font-semibold`}>Details: </Text>
            {item?.description || "No details available"}
          </Text>
          <View style={tw`flex-row items-center mb-2`}>
            <Text style={tw`text-black font-semibold mr-2`}>Cost:</Text>
            <Text> {item.cost}</Text>
          </View>
        </View>

        {/* RIGHT SIDE */}
        <View style={tw`w-32 items-center`}>
          <View
            style={tw`w-full h-32 mb-2 border border-gray-300 rounded-lg overflow-hidden bg-gray-100`}
          >
            <EventImage imageUrl={item?.imageUrl} />
          </View>

          <TouchableOpacity
            style={tw.style(
              `px-3 py-2 rounded-xl w-full`,
              isBooked ? "bg-gray-400" : "bg-red-600"
            )}
            disabled={isBooked}
            onPress={() => handleBuyTicket(item?._id)}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              {isBooked ? "Booked" : "Buy Ticket"}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={tw`flex-1`}>
      {loading ? (
        <ActivityIndicator size="large" color="#6F31EE" />
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
