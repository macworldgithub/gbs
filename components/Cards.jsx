// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   Pressable,
//   Image,
//   Alert,
//   TouchableOpacity,
// } from "react-native";
// import tw from "twrnc";
// import { useNavigation } from "@react-navigation/native";
// import { getUserData } from "../src/utils/storage";

// const BASE_API_URL = "https://gbs.westsidecarcare.com.au/events";

// const Cards = ({
//   stateFilter = "All",
//   limit = 10,
//   page = 1,
//   showBooking = true,
// }) => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [bookedEvents, setBookedEvents] = useState([]);
//   const navigation = useNavigation();

//   // ✅ Fetch Events
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);

//         const params = new URLSearchParams();
//         if (stateFilter && stateFilter.toLowerCase() !== "all") {
//           params.append("state", stateFilter.toUpperCase());
//         }
//         params.append("page", page);
//         params.append("limit", limit);

//         const url = `${BASE_API_URL}?${params.toString()}`;
//         const response = await fetch(url);
//         const data = await response.json();

//         setEvents(Array.isArray(data?.events) ? data.events : []);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//         setEvents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [stateFilter, page, limit]);

//   // ✅ Format DateTime
//   const formatDateTime = (dateStr) => {
//     if (!dateStr) return "Date not available";
//     const date = new Date(dateStr);
//     return date.toLocaleString("en-US", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const handleBuyTicket = async (eventId) => {
//     try {
//       const userData = await getUserData();
//       const token = userData?.token;

//       if (!token) {
//         Alert.alert("Login Required", "Please log in to buy a ticket.");
//         return;
//       }

//       if (bookedEvents.includes(eventId)) {
//         Alert.alert("Already Booked", "You have already booked this event.");
//         return;
//       }

//       const url = `${BASE_API_URL}/${eventId}/book_ticket`;
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (response.ok) {
//         Alert.alert("Success", "Your ticket has been booked successfully!");
//         setBookedEvents((prev) => [...prev, eventId]);
//       } else {
//         Alert.alert("Failed", result?.message || "Unable to book ticket.");
//       }
//     } catch (error) {
//       console.error("Error booking ticket:", error);
//       Alert.alert("Error", "Something went wrong while booking the ticket.");
//     }
//   };

//   // ✅ Event Image with fallback
//   const EventImage = ({ imageUrl }) => {
//     const [imageError, setImageError] = useState(false);
//     const source =
//       !imageError && imageUrl && imageUrl.trim() !== ""
//         ? { uri: imageUrl }
//         : require("../assets/fallback.png");

//     return (
//       <Image
//         source={source}
//         style={tw`w-full h-full`}
//         resizeMode="cover"
//         onError={() => setImageError(true)}
//       />
//     );
//   };

//   // ✅ Render Each Event
//   const renderEvent = ({ item }) => {
//     const dateTime = formatDateTime(item?.startDate);
//     const isBooked = bookedEvents.includes(item?._id);

//     return (
//       <Pressable
//         style={({ pressed }) => [
//           tw`bg-white flex-row justify-between items-start p-4 m-2 rounded-xl shadow border border-gray-200`,
//           pressed && tw`bg-gray-100`,
//         ]}
//         onPress={() =>
//           navigation.navigate("EventDetail", { eventId: item?._id })
//         }
//       >
//         {/* LEFT SIDE */}
//         <View style={tw`flex-1 pr-3`}>
//           <Text style={tw`text-lg font-bold text-black mb-1`}>
//             {item?.title || "Untitled Event"}
//           </Text>
//           <Text style={tw`text-gray-600 mb-1`}>
//             {item?.locationNames?.[0] || item?.location || "No location"}
//           </Text>
//           <Text style={tw`text-sm text-black mb-1`}>
//             <Text style={tw`font-semibold`}>Date–Time: </Text>
//             {dateTime}
//           </Text>
//           <Text style={tw`text-sm text-black mb-2`}>
//             <Text style={tw`font-semibold`}>Details: </Text>
//             {item?.description || "No details available"}
//           </Text>
//           <View style={tw`flex-row items-center mb-2`}>
//             <Text style={tw`text-black font-semibold mr-2`}>Cost:</Text>
//             <Text>{item?.cost || "0"}$ </Text>
//           </View>
//         </View>

//         {/* RIGHT SIDE */}
//         <View style={tw`w-32 items-center`}>
//           <View
//             style={tw`w-full h-32 mb-2 border border-gray-300 rounded-lg overflow-hidden bg-gray-100`}
//           >
//             <EventImage imageUrl={item?.imageUrl} />
//           </View>

//           {showBooking && (
//             <TouchableOpacity
//               style={tw.style(
//                 `px-3 py-2 rounded-xl w-full`,
//                 isBooked ? "bg-gray-400" : "bg-red-600"
//               )}
//               disabled={isBooked}
//               onPress={() => handleBuyTicket(item?._id)}
//             >
//               <Text style={tw`text-white text-center font-semibold`}>
//                 {isBooked ? "Booked" : "Buy Ticket"}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </Pressable>
//     );
//   };

//   return (
//     <View style={tw`flex-1`}>
//       {loading ? (
//         <ActivityIndicator size="large" color="red" />
//       ) : (
//         <FlatList
//           data={events}
//           keyExtractor={(item, index) =>
//             item?._id?.toString() || index.toString()
//           }
//           renderItem={renderEvent}
//           contentContainerStyle={tw`p-2`}
//           ListEmptyComponent={
//             <Text style={tw`text-gray-500 text-center mt-4`}>
//               No events found for {stateFilter || "All"}
//             </Text>
//           }
//         />
//       )}
//     </View>
//   );
// };

// export default Cards;

// import React, { useEffect, useState, useMemo } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   Pressable,
//   Image,
//   Alert,
//   TouchableOpacity,
//   Linking,
// } from "react-native";
// import tw from "twrnc";
// import { useNavigation } from "@react-navigation/native";
// import { getUserData } from "../src/utils/storage";

// const BASE_API_URL = "https://gbs.westsidecarcare.com.au/trybooking/events";

// const Cards = ({
//   stateFilter = "All",
//   limit = 10,
//   page = 1,
//   showBooking = true,
// }) => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   // ✅ Fetch Events
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);

//         const url = BASE_API_URL;
//         const response = await fetch(url);
//         const data = await response.json();

//         setEvents(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//         setEvents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   const getStateFromEvent = (event) => {
//     const venueLower = event.venue?.toLowerCase() || "";
//     const nameLower = event.name.toLowerCase();
//     if (nameLower.includes("singapore") || venueLower.includes("singapore")) {
//       return "Singapore";
//     }
//     const tz = event.timeZone || "";
//     const match = tz.match(/Australia\/([A-Z][a-z]*)/);
//     if (match) {
//       const city = match[1].toUpperCase();
//       const stateMap = {
//         MELBOURNE: "VIC",
//         SYDNEY: "NSW",
//         BRISBANE: "QLD",
//         ADELAIDE: "SA",
//         PERTH: "WA",
//         DARWIN: "NT",
//       };
//       return stateMap[city] || "All";
//     }
//     // Fallback to venue-based state detection if timezone doesn't match
//     if (venueLower.includes("melbourne") || venueLower.includes("victoria"))
//       return "VIC";
//     if (venueLower.includes("sydney") || venueLower.includes("new south wales"))
//       return "NSW";
//     if (venueLower.includes("brisbane") || venueLower.includes("queensland"))
//       return "QLD";
//     if (
//       venueLower.includes("adelaide") ||
//       venueLower.includes("south australia")
//     )
//       return "SA";
//     if (
//       venueLower.includes("perth") ||
//       venueLower.includes("western australia")
//     )
//       return "WA";
//     return "All";
//   };

//   const isEventOngoing = (event) => {
//     if (!event.sessionList || event.sessionList.length === 0) return false;
//     const today = new Date("2025-11-28T00:00:00Z"); // Current date: November 28, 2025, start of day in UTC
//     const startDate = new Date(event.sessionList[0].eventStartDate);
//     const endDate = new Date(event.sessionList[0].eventEndDate);
//     return startDate <= today && endDate > today;
//   };

//   const isBookingOpen = (event) => {
//     if (!event.sessionList || event.sessionList.length === 0) return false;
//     const today = new Date("2025-11-28T00:00:00Z");
//     const bookingStartDate = new Date(event.sessionList[0].bookingStartDate);
//     const bookingEndDate = new Date(event.sessionList[0].bookingEndDate);
//     return bookingStartDate <= today && today < bookingEndDate;
//   };

//   const filteredEvents = useMemo(() => {
//     return events
//       .filter((event) => isEventOngoing(event))
//       .filter(
//         (event) =>
//           stateFilter === "All" || getStateFromEvent(event) === stateFilter
//       )
//       .slice(0, limit);
//   }, [events, stateFilter, limit]);

//   // ✅ Format DateTime
//   const formatDateTime = (dateStr) => {
//     if (!dateStr) return "Date not available";
//     const date = new Date(dateStr);
//     return date.toLocaleString("en-US", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const handleBuyTicket = (bookingUrl) => {
//     if (!bookingUrl) {
//       Alert.alert("Error", "No booking link available.");
//       return;
//     }
//     Linking.openURL(bookingUrl).catch((error) =>
//       Alert.alert("Error", "Unable to open booking link.")
//     );
//   };

//   // ✅ Event Image with fallback
//   const EventImage = ({ imageUrl }) => {
//     const [imageError, setImageError] = useState(false);
//     const source =
//       !imageError && imageUrl && imageUrl.trim() !== ""
//         ? { uri: imageUrl }
//         : require("../assets/fallback.png");

//     return (
//       <Image
//         source={source}
//         style={tw`w-full h-full`}
//         resizeMode="cover"
//         onError={() => setImageError(true)}
//       />
//     );
//   };

//   // ✅ Render Each Event
//   const renderEvent = ({ item }) => {
//     const dateTime = formatDateTime(item?.sessionList?.[0]?.eventStartDate);
//     const endDate = formatDateTime(item?.sessionList?.[0]?.eventEndDate);
//     const seats = item?.sessionList?.[0]?.sessionAvailability || "N/A";
//     const location = item?.venue || "No location";
//     const bookingAvailable = isBookingOpen(item);

//     return (
//       <Pressable
//         style={({ pressed }) => [
//           tw`bg-white flex-row justify-between items-start p-4 m-2 rounded-xl shadow border border-gray-200`,
//           pressed && tw`bg-gray-100`,
//         ]}
//         onPress={() =>
//           navigation.navigate("EventDetail", { eventId: item?.eventId })
//         }
//       >
//         {/* LEFT SIDE */}
//         <View style={tw`flex-1 pr-3`}>
//           <Text style={tw`text-lg font-bold text-black mb-1`}>
//             {item?.name || "Untitled Event"}
//           </Text>
//           <Text style={tw`text-gray-600 mb-1`}>{location}</Text>
//           <Text style={tw`text-sm text-black mb-1`}>
//             <Text style={tw`font-semibold`}>Date–Time: </Text>
//             {dateTime}
//           </Text>
//           <Text style={tw`text-sm text-black mb-1`}>
//             <Text style={tw`font-semibold`}>Event-End-Date: </Text>
//             {endDate}
//           </Text>
//           <Text
//             style={tw`text-sm text-black mb-1`}
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             <Text style={tw`font-semibold`}>Details: </Text>
//             {item?.description || "No details available"}
//           </Text>
//           <Text style={tw`text-sm text-black mb-1`}>
//             <Text style={tw`font-semibold`}>Seats: </Text>
//             {seats}
//           </Text>
//         </View>

//         {/* RIGHT SIDE */}
//         <View style={tw`w-32 items-center`}>
//           <View
//             style={tw`w-full h-32 mb-2 border border-gray-300 rounded-lg overflow-hidden bg-gray-100`}
//           >
//             <EventImage imageUrl={item?.listOfImages?.[0]?.imageFileName} />
//           </View>

//           {showBooking && bookingAvailable && (
//             <TouchableOpacity
//               style={tw`px-3 py-2 rounded-xl w-full bg-red-600`}
//               onPress={() => handleBuyTicket(item?.bookingUrl)}
//             >
//               <Text style={tw`text-white text-center font-semibold`}>
//                 Buy Ticket
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </Pressable>
//     );
//   };

//   return (
//     <View style={tw`flex-1`}>
//       {loading ? (
//         <ActivityIndicator size="large" color="red" />
//       ) : (
//         <FlatList
//           data={filteredEvents}
//           keyExtractor={(item, index) =>
//             item?.eventId?.toString() || index.toString()
//           }
//           renderItem={renderEvent}
//           contentContainerStyle={tw`p-2`}
//           ListEmptyComponent={
//             <Text style={tw`text-gray-500 text-center mt-4`}>
//               No events found for {stateFilter || "All"}
//             </Text>
//           }
//         />
//       )}
//     </View>
//   );
// };

// export default Cards;
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { getUserData } from "../src/utils/storage";

const BASE_API_URL = "https://gbs.westsidecarcare.com.au/trybooking/events";

const Cards = ({
  stateFilter = "All",
  limit = 10,
  page = 1,
  showBooking = true,
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // ✅ Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const url = BASE_API_URL;
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
  }, []);

  const getStateFromEvent = (event) => {
    const venueLower = event.venue?.toLowerCase() || "";
    const nameLower = event.name.toLowerCase();
    if (nameLower.includes("singapore") || venueLower.includes("singapore")) {
      return "Singapore";
    }
    const tz = event.timeZone || "";
    const match = tz.match(/Australia\/([A-Z][a-z]*)/);
    if (match) {
      const city = match[1].toUpperCase();
      const stateMap = {
        MELBOURNE: "VIC",
        SYDNEY: "NSW",
        BRISBANE: "QLD",
        ADELAIDE: "SA",
        PERTH: "WA",
        DARWIN: "NT",
      };
      return stateMap[city] || "All";
    }
    // Fallback to venue-based state detection if timezone doesn't match
    if (venueLower.includes("melbourne") || venueLower.includes("victoria"))
      return "VIC";
    if (venueLower.includes("sydney") || venueLower.includes("new south wales"))
      return "NSW";
    if (venueLower.includes("brisbane") || venueLower.includes("queensland"))
      return "QLD";
    if (
      venueLower.includes("adelaide") ||
      venueLower.includes("south australia")
    )
      return "SA";
    if (
      venueLower.includes("perth") ||
      venueLower.includes("western australia")
    )
      return "WA";
    return "All";
  };

  const isEventUpcoming = (event) => {
    if (!event.sessionList || event.sessionList.length === 0) return false;
    const today = new Date("2025-12-09T00:00:00Z");
    const endDate = new Date(event.sessionList[0].eventEndDate);
    return endDate > today;
  };

  const filteredEvents = useMemo(() => {
    return (
      events
        .filter((event) => isEventUpcoming(event))
        // hide events explicitly marked as not public
        .filter((event) => event.isPublic !== false)
        .filter(
          (event) =>
            stateFilter.toLowerCase() === "all" ||
            getStateFromEvent(event) === stateFilter.toUpperCase()
        )
        .slice(0, limit)
    );
  }, [events, stateFilter, limit]);

  // ✅ Format DateTime
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

  const handleBuyTicket = (bookingUrl) => {
    if (!bookingUrl) {
      Alert.alert("Error", "No booking link available.");
      return;
    }
    Linking.openURL(bookingUrl).catch((error) =>
      Alert.alert("Error", "Unable to open booking link.")
    );
  };

  // ✅ Event Image with fallback
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

  // ✅ Render Each Event
  const renderEvent = ({ item }) => {
    const dateTime = formatDateTime(item?.sessionList?.[0]?.eventStartDate);
    const endDate = formatDateTime(item?.sessionList?.[0]?.eventEndDate);
    const seats = item?.sessionList?.[0]?.sessionAvailability || "N/A";
    const location = item?.venue || "No location";
    const bookingUrl =
      item?.sessionList?.[0]?.sessionBookingUrl || item?.bookingUrl;

    return (
      <Pressable
        style={({ pressed }) => [
          tw`bg-white flex-row justify-between items-start p-4 m-2 rounded-xl shadow border border-gray-200`,
          pressed && tw`bg-gray-100`,
        ]}
        onPress={() =>
          navigation.navigate("EventDetail", { eventId: item?.eventId })
        }
      >
        {/* LEFT SIDE */}
        <View style={tw`flex-1 pr-3`}>
          <Text style={tw`text-lg font-bold text-black mb-1`}>
            {item?.name || "Untitled Event"}
          </Text>
          <Text style={tw`text-gray-600 mb-1`}>{location}</Text>
          <Text style={tw`text-sm text-black mb-1`}>
            <Text style={tw`font-semibold`}>Date–Time: </Text>
            {dateTime}
          </Text>
          <Text style={tw`text-sm text-black mb-1`}>
            <Text style={tw`font-semibold`}>Event-End-Date: </Text>
            {endDate}
          </Text>
          <Text
            style={tw`text-sm text-black mb-1`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            <Text style={tw`font-semibold`}>Details: </Text>
            {item?.description || "No details available"}
          </Text>
          <Text style={tw`text-sm text-black mb-1`}>
            <Text style={tw`font-semibold`}>Seats: </Text>
            {seats}
          </Text>
        </View>

        {/* RIGHT SIDE */}
        <View style={tw`w-32 items-center`}>
          <View
            style={tw`w-full h-32 mb-2 border border-gray-300 rounded-lg overflow-hidden bg-gray-100`}
          >
            <EventImage imageUrl={item?.listOfImages?.[0]?.imageFileName} />
          </View>

          {showBooking && (
            <TouchableOpacity
              style={tw`px-3 py-2 rounded-xl w-full bg-red-600`}
              onPress={() => handleBuyTicket(bookingUrl)}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Buy Ticket
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={tw`flex-1`}>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item, index) =>
            item?.eventId?.toString() || index.toString()
          }
          renderItem={renderEvent}
          contentContainerStyle={tw`p-2`}
          ListEmptyComponent={
            <Text style={tw`text-gray-500 text-center mt-4`}>
              No events found for {stateFilter || "All"}
            </Text>
          }
        />
      )}
    </View>
  );
};

export default Cards;
