import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const BASE_API_URL = "https://gbs.westsidecarcare.com.au/events/featured";
const STATES = ["All", "VIC", "NSW", "QLD", "SA", "WA"];
const FeaturedEventsScreen = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(50); // change to how many per page you want
  const [totalPages, setTotalPages] = useState(1);

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

      // Make sure data is always an array
      const eventsArray = Array.isArray(data?.events) ? data.events : data;

      // ✅ filter featured only
      const featured = eventsArray.filter((event) => event.isFeatured);

      setFeaturedEvents(featured);

      // ✅ Calculate total pages manually if API doesn't send it
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
          tw`bg-white p-4 m-2 rounded-xl shadow relative`,
          pressed && tw`bg-gray-100`,
        ]}
        onPress={() =>
          navigation.navigate("EventDetail", { eventId: item?._id })
        }
      >
        {/* Featured label */}
        <View
          style={tw`absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full`}
        >
          <Text style={tw`text-white text-xs font-bold`}>FEATURED</Text>
        </View>

        <Text style={tw`text-lg font-bold text-black`}>
          {item?.title || "Untitled Event"}
        </Text>
        <Text style={tw`text-gray-600 mt-1`}>
          {item?.description || "No description available"}
        </Text>

        {/* Dates */}
        <View style={tw`mt-2 flex-row`}>
          <Text style={tw`text-black text-sm font-semibold`}>Start: </Text>
          <Text style={tw`text-black text-sm`}>{startDate}</Text>
        </View>
        <View style={tw`mt-1 flex-row`}>
          <Text style={tw`text-black text-sm font-semibold`}>End: </Text>
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
      <View style={tw`flex-row items-center mb-1 mt-14 px-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-800 mb-1 ml-2`}>
          Featured Events
        </Text>
      </View>
      {/* Tabs for state filter */}
      <View style={tw`flex-row justify-around bg-gray-100 p-2 mt-6`}>
        {STATES.map((st) => (
          <TouchableOpacity
            key={st}
            style={tw`px-3 py-1 rounded-full ${
              stateFilter === st ? "bg-red-500" : "bg-white"
            }`}
            onPress={() => {
              setStateFilter(st);
              setPage(1); // reset to first page when filter changes
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

          {/* Pagination controls */}
          <View style={tw`flex-row justify-between items-center p-4`}>
            <TouchableOpacity
              disabled={page <= 1}
              style={tw`px-4 py-2 rounded bg-gray-200 ${
                page <= 1 ? "opacity-50" : "bg-red-500"
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
              style={tw`px-4 py-2 rounded bg-gray-200 ${
                page >= totalPages ? "opacity-50" : "bg-red-500"
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
