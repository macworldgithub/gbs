import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getUserData } from "../utils/storage";
import fallbackImage from "../../assets/fallback.png";

const BASE_API_URL = "https://gbs.westsidecarcare.com.au/events/featured";
const STATES = ["All", "VIC", "NSW", "QLD", "SA", "WA"];

const FeaturedEventsScreen = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [bookedEvents, setBookedEvents] = useState([]);

  const navigation = useNavigation();

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      let url = `${BASE_API_URL}?page=${page}&limit=${limit}`;
      if (stateFilter !== "All") {
        url += `&state=${stateFilter}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      const eventsArray = Array.isArray(data?.events) ? data.events : data;

      const featured = eventsArray.filter((event) => event.isFeatured);
      setFeaturedEvents(featured);

      const totalCount = data?.total || eventsArray.length;
      setTotalPages(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error("Error fetching featured events:", error);
      setFeaturedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedEvents();
  }, [stateFilter, page]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date not available";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ✅ Buy Ticket Handler
  const handleBuyTicket = async (eventId) => {
    try {
      const userData = await getUserData();
      const token = userData?.token;

      if (!token) {
        Alert.alert("Login Required", "Please log in to buy a ticket.");
        return;
      }

      if (bookedEvents.includes(eventId)) {
        Alert.alert("Already Booked", "You have already booked this event.");
        return;
      }

      const url = `https://gbs.westsidecarcare.com.au/events/${eventId}/book_ticket`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Your ticket has been booked successfully!");
        setBookedEvents((prev) => [...prev, eventId]);
      } else {
        Alert.alert("Failed", result?.message || "Unable to book ticket.");
      }
    } catch (error) {
      console.error("Error booking ticket:", error);
      Alert.alert("Error", "Something went wrong while booking the ticket.");
    }
  };

  const renderEvent = ({ item }) => {
    const isBooked = bookedEvents.includes(item?._id);
    return (
      <Pressable
        style={({ pressed }) => [
          tw`bg-white rounded-2xl p-4 m-2 shadow-lg flex-row justify-between items-start`,
          pressed && tw`bg-gray-100`,
        ]}
        onPress={() =>
          navigation.navigate("EventDetail", { eventId: item?._id })
        }
      >
        {/* Left Content */}
        <View style={tw`flex-1 pr-3`}>
          <Text style={tw`text-lg font-bold text-black`}>
            {item?.title || "Untitled Event"}
          </Text>
          <Text style={tw`text-gray-500 mb-2`}>
            {item?.city ? `${item.city}, ${item.state}` : item?.state || "N/A"}
          </Text>

          <Text style={tw`text-black text-sm font-semibold`}>
            Date–Time:{" "}
            <Text style={tw`font-normal`}>{formatDate(item?.startDate)}</Text>
          </Text>

          <Text style={tw`text-black text-sm font-semibold mt-1`}>
            Details:{" "}
            <Text style={tw`font-normal`}>
              {item?.description || "No details"}
            </Text>
          </Text>

          <Text style={tw`text-black text-sm font-semibold mt-1`}>
            Cost:{" "}
            <Text style={tw`font-normal`}>
              {item?.cost && item.cost !== "0"}
            </Text>
          </Text>
        </View>

        {/* Right Section (Image + Button below it) */}
        <View style={tw`items-center`}>
          <Image
            source={
              item?.imageUrl ? { uri: item.imageUrl } : fallbackImage
            }
            defaultSource={fallbackImage} 
            onError={(e) => (e.currentTarget.src = fallbackImage)} 
            style={tw`w-28 h-28 rounded-xl mb-2`}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={tw.style(
              `px-3 py-2 rounded-xl w-full`,
              bookedEvents.includes(item?._id) ? "bg-gray-400" : "bg-red-600"
            )}
            disabled={bookedEvents.includes(item?._id)}
            onPress={() => handleBuyTicket(item?._id)}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              {bookedEvents.includes(item?._id) ? "Booked" : "Buy Ticket"}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={tw`flex-1`}>
      {/* Header */}
      <View style={tw`flex-row items-center mb-1 mt-14 px-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-800 mb-1 ml-2`}>
          Featured Events
        </Text>
      </View>

      {/* State Filter Tabs */}
      <View style={tw`flex-row justify-around bg-gray-100 p-2 mt-6`}>
        {STATES.map((st) => (
          <TouchableOpacity
            key={st}
            style={tw`px-3 py-1 rounded-full ${
              stateFilter === st ? "bg-red-500" : "bg-white"
            }`}
            onPress={() => {
              setStateFilter(st);
              setPage(1);
            }}
          >
            <Text
              style={tw`text-sm ${
                stateFilter === st ? "text-white" : "text-black"
              }`}
            >
              {st}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Event List */}
      {loading ? (
        <ActivityIndicator size="large" color="#ff4d4f" style={tw`mt-10`} />
      ) : (
        <>
          <FlatList
            data={featuredEvents}
            keyExtractor={(item, index) =>
              item?._id?.toString() || index.toString()
            }
            renderItem={renderEvent}
            contentContainerStyle={tw`p-2`}
            ListEmptyComponent={
              <Text style={tw`text-gray-500 text-center mt-4`}>
                No featured events found
              </Text>
            }
          />

          {/* Pagination */}
          <View style={tw`flex-row justify-between items-center p-4`}>
            <TouchableOpacity
              disabled={page <= 1}
              style={tw`px-4 py-2 rounded ${
                page <= 1 ? "bg-gray-200 opacity-50" : "bg-red-500"
              }`}
              onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              <Text style={tw`${page <= 1 ? "text-gray-500" : "text-white"}`}>
                Prev
              </Text>
            </TouchableOpacity>

            <Text style={tw`text-black`}>
              Page {page} of {totalPages}
            </Text>

            <TouchableOpacity
              disabled={page >= totalPages}
              style={tw`px-4 py-2 rounded ${
                page >= totalPages ? "bg-gray-200 opacity-50" : "bg-red-500"
              }`}
              onPress={() => setPage((prev) => prev + 1)}
            >
              <Text
                style={tw`${page >= totalPages ? "text-gray-500" : "text-white"}`}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default FeaturedEventsScreen;
