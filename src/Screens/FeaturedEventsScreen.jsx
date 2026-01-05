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
  Linking,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import fallbackImage from "../../assets/fallback.png";

const BASE_API_URL = "https://gbs.westsidecarcare.com.au/trybooking/events";

const FeaturedEventsScreen = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [bookedEvents, setBookedEvents] = useState([]);

  const navigation = useNavigation();

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(BASE_API_URL);
      const data = await response.json();
      const eventsArray = Array.isArray(data) ? data : data?.events || [];

      const today = new Date("2025-12-09");
      const upcomingEvents = eventsArray.filter((event) => {
        const endDate = event.sessionList?.[0]?.eventEndDate;
        if (!endDate) return false;
        return new Date(endDate) > today;
      });

      setAllEvents(upcomingEvents);
    } catch (error) {
      console.error("Error fetching featured events:", error);
      setAllEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  useEffect(() => {
    if (allEvents.length === 0) return;
    const totalCount = allEvents.length;
    setTotalPages(Math.ceil(totalCount / limit));
    const start = (page - 1) * limit;
    const end = start + limit;
    setFeaturedEvents(allEvents.slice(start, end));
  }, [allEvents, page]);

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

  const truncateDescription = (desc, maxLength = 40) => {
    if (!desc) return "No details";
    return desc.length > maxLength
      ? `${desc.substring(0, maxLength)}...`
      : desc;
  };

  const handleBuyTicket = async (bookingUrl) => {
    if (!bookingUrl) {
      Alert.alert("Error", "Booking URL not available.");
      return;
    }
    const supported = await Linking.canOpenURL(bookingUrl);
    if (supported) {
      await Linking.openURL(bookingUrl);
    } else {
      Alert.alert("Error", "Cannot open the booking URL.");
    }
  };

  const renderEvent = ({ item }) => {
    const isBooked = bookedEvents.includes(item?.eventId);
    const session = item?.sessionList?.[0];
    const availableSeats = session?.sessionAvailability || 0;
    const bookingUrl = session?.sessionBookingUrl;

    return (
      <Pressable
        style={({ pressed }) => [
          tw`bg-white rounded-2xl p-4 m-2 shadow-lg flex-row justify-between items-start`,
          pressed && tw`bg-gray-100`,
        ]}
        onPress={() =>
          navigation.navigate("EventDetail", {
            eventId: item?.eventId,
            fullDescription: item?.description,
          })
        }
      >
        {/* Left Content */}
        <View style={tw`flex-1 pr-3`}>
          <Text style={tw`text-lg font-bold text-black`}>
            {item?.name || "Untitled Event"}
          </Text>
          <Text style={tw`text-gray-500 mb-2`}>{item?.venue || "N/A"}</Text>

          <Text style={tw`text-black text-sm font-semibold`}>
            Date-Time:{" "}
            <Text style={tw`font-normal`}>
              {formatDate(session?.eventStartDate)}
            </Text>
          </Text>

          <Text style={tw`text-black text-sm font-semibold mt-1`}>
            Event-End-Date:{" "}
            <Text style={tw`font-normal`}>
              {formatDate(session?.eventEndDate)}
            </Text>
          </Text>

          <Text style={tw`text-black text-sm font-semibold mt-1`}>
            Details:{" "}
            <Text style={tw`font-normal`}>
              {truncateDescription(item?.description)}
            </Text>{" "}
            {item?.description?.length > 40 && (
              <Text
                style={tw`text-red-600 font-bold`}
                onPress={() =>
                  navigation.navigate("EventDetail", {
                    eventId: item?.eventId,
                    fullDescription: item?.description,
                  })
                }
              >
                More Details
              </Text>
            )}
          </Text>

          <Text style={tw`text-black text-sm font-semibold mt-1`}>
            Seats: <Text style={tw`font-normal`}>{availableSeats}</Text>
          </Text>
        </View>

        {/* Right Section (Image + Button below it) */}
        <View style={tw`items-center`}>
          <Image
            source={
              item?.listOfImages?.[0]?.imageFileName
                ? { uri: item.listOfImages[0].imageFileName }
                : fallbackImage
            }
            defaultSource={fallbackImage}
            style={tw`w-28 h-28 rounded-xl mb-2`}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={tw.style(
              `px-3 py-2 rounded-xl w-full`,
              bookedEvents.includes(item?.eventId)
                ? "bg-gray-400"
                : "bg-red-600"
            )}
            disabled={bookedEvents.includes(item?.eventId)}
            onPress={() => handleBuyTicket(bookingUrl)}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              {bookedEvents.includes(item?.eventId) ? "Booked" : "Buy Ticket"}
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

      {/* Event List */}
      {loading ? (
        <ActivityIndicator size="large" color="#ff4d4f" style={tw`mt-10`} />
      ) : (
        <>
          <FlatList
            data={featuredEvents}
            keyExtractor={(item, index) =>
              item?.eventId?.toString() || index.toString()
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
