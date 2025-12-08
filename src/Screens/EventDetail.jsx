// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   ScrollView,
//   Alert,
//   Image,
//   TouchableOpacity,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// import tw from "tailwind-react-native-classnames";

// const API_URL = "https://gbs.westsidecarcare.com.au/events";

// const EventDetail = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { eventId } = route.params;

//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_URL}/${eventId}`, {
//           headers: { Accept: "application/json" },
//         });
//         const data = await res.json();
//         if (res.ok) {
//           setEvent(data);
//         } else {
//           Alert.alert("Error", data.message || "Failed to fetch event details");
//         }
//       } catch (error) {
//         Alert.alert("Error", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvent();
//   }, [eventId]);

//   if (loading)
//     return <ActivityIndicator size="large" color="red" style={tw`mt-10`} />;

//   if (!event)
//     return (
//       <Text style={tw`text-center mt-10 text-gray-500`}>Event not found</Text>
//     );

//   return (

//     <ScrollView style={tw`flex-1 bg-white p-4 `}>
//       {/* Header */}
//       <View style={tw`flex-row items-center justify-between mt-12 mb-6`}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} />
//         </TouchableOpacity>
//         <Text style={tw`text-xl font-bold text-red-600`}>Event Detail</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Event Card */}
//       <View
//         style={tw`bg-white border border-red-100 rounded-2xl shadow-md p-5 mb-6`}
//       >
//         <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>
//           {event.title}
//         </Text>
//         <Text style={tw`text-base text-gray-600 mb-4 leading-5`}>
//           {event.description}
//         </Text>

//         {/* Dates */}
//         <View style={tw`mb-3`}>
//           <Text style={tw`text-sm text-gray-700 mb-1`}>
//             <Text style={tw`font-semibold text-red-500`}>Start:</Text>{" "}
//             {new Date(event.startDate).toLocaleString()}
//           </Text>
//           <Text style={tw`text-sm text-gray-700`}>
//             <Text style={tw`font-semibold text-red-500`}>End:</Text>{" "}
//             {new Date(event.endDate).toLocaleString()}
//           </Text>
//         </View>

//         {/* State */}
//         <Text style={tw`text-sm text-gray-700 mb-1`}>
//           <Text style={tw`font-semibold text-red-500`}>State:</Text>{" "}
//           {event.state || "N/A"}
//         </Text>

//         {/* Location */}
//         <Text style={tw`text-sm text-gray-700 mb-1`}>
//           <Text style={tw`font-semibold text-red-500`}>Location:</Text>{" "}
//           {Array.isArray(event.locationNames)
//             ? event.locationNames.join(", ")
//             : event.locationNames || "N/A"}
//         </Text>

//         {/* Creator */}
//         <Text style={tw`text-sm text-gray-700 mb-2`}>
//           <Text style={tw`font-semibold text-red-500`}>Created by:</Text>{" "}
//           {event.creator?.name || "Unknown"}
//         </Text>
//       </View>

//       {/* Attendees Section */}
//       <View
//         style={tw`bg-white border border-red-100 rounded-2xl shadow-md p-5`}
//       >
//         <Text style={tw`font-bold text-lg text-red-600 mb-3`}>Attendees</Text>
//         {event.attendees?.length > 0 ? (
//           event.attendees.map((att) => (
//             <View key={att._id} style={tw`flex-row items-center mb-2`}>
//               <View
//                 style={tw`w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-2`}
//               >
//                 <Text style={tw`text-red-600 font-bold`}>
//                   {att.name.charAt(0).toUpperCase()}
//                 </Text>
//               </View>
//               <Text style={tw`text-sm text-gray-700`}>{att.name}</Text>
//             </View>
//           ))
//         ) : (
//           <Text style={tw`text-gray-500 italic`}>No attendees yet</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default EventDetail;

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   ScrollView,
//   Alert,
//   Image,
//   TouchableOpacity,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// import tw from "tailwind-react-native-classnames";

// const API_URL = "https://gbs.westsidecarcare.com.au/trybooking/events";

// const EventDetail = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { eventId } = route.params;

//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_URL}/${eventId}`, {
//           headers: { Accept: "application/json" },
//         });
//         const data = await res.json();
//         if (res.ok) {
//           setEvent(data);
//         } else {
//           Alert.alert("Error", data.message || "Failed to fetch event details");
//         }
//       } catch (error) {
//         Alert.alert("Error", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvent();
//   }, [eventId]);

//   if (loading)
//     return <ActivityIndicator size="large" color="red" style={tw`mt-10`} />;

//   if (!event)
//     return (
//       <Text style={tw`text-center mt-10 text-gray-500`}>Event not found</Text>
//     );

//   return (
//     <ScrollView style={tw`flex-1 bg-white p-4 `}>
//       {/* Header */}
//       <View style={tw`flex-row items-center justify-between mt-12 mb-6`}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} />
//         </TouchableOpacity>
//         <Text style={tw`text-xl font-bold text-red-600`}>Event Detail</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Event Card */}
//       <View
//         style={tw`bg-white border border-red-100 rounded-2xl shadow-md p-5 mb-6`}
//       >
//         <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>
//           {event.name || event.title}
//         </Text>
//         <Text style={tw`text-base text-gray-600 mb-4 leading-5`}>
//           {event.description}
//         </Text>

//         {/* Dates */}
//         <View style={tw`mb-3`}>
//           <Text style={tw`text-sm text-gray-700 mb-1`}>
//             <Text style={tw`font-semibold text-red-500`}>Start:</Text>{" "}
//             {event.sessionList && event.sessionList.length > 0
//               ? new Date(event.sessionList[0].eventStartDate).toLocaleString()
//               : new Date(event.startDate || Date.now()).toLocaleString()}
//           </Text>
//           <Text style={tw`text-sm text-gray-700`}>
//             <Text style={tw`font-semibold text-red-500`}>End:</Text>{" "}
//             {event.sessionList && event.sessionList.length > 0
//               ? new Date(
//                   event.sessionList[0].eventEndDate ||
//                     event.sessionList[0].eventStartDate
//                 ).toLocaleString()
//               : new Date(event.endDate || Date.now()).toLocaleString()}
//           </Text>
//         </View>

//         {/* State */}
//         <Text style={tw`text-sm text-gray-700 mb-1`}>
//           <Text style={tw`font-semibold text-red-500`}>State:</Text>{" "}
//           {event.state || getStateFromEvent(event) || "N/A"}
//         </Text>

//         {/* Location */}
//         <Text style={tw`text-sm text-gray-700 mb-1`}>
//           <Text style={tw`font-semibold text-red-500`}>Location:</Text>{" "}
//           {event.venue ||
//             (Array.isArray(event.locationNames)
//               ? event.locationNames.join(", ")
//               : event.locationNames || "N/A")}
//         </Text>

//         {/* Creator */}
//         <Text style={tw`text-sm text-gray-700 mb-2`}>
//           <Text style={tw`font-semibold text-red-500`}>Created by:</Text>{" "}
//           {event.creator?.name || "Unknown"}
//         </Text>
//       </View>

//       {/* Attendees Section */}
//       <View
//         style={tw`bg-white border border-red-100 rounded-2xl shadow-md p-5`}
//       >
//         <Text style={tw`font-bold text-lg text-red-600 mb-3`}>Attendees</Text>
//         {event.attendees?.length > 0 ? (
//           event.attendees.map((att) => (
//             <View key={att._id} style={tw`flex-row items-center mb-2`}>
//               <View
//                 style={tw`w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-2`}
//               >
//                 <Text style={tw`text-red-600 font-bold`}>
//                   {att.name.charAt(0).toUpperCase()}
//                 </Text>
//               </View>
//               <Text style={tw`text-sm text-gray-700`}>{att.name}</Text>
//             </View>
//           ))
//         ) : (
//           <Text style={tw`text-gray-500 italic`}>No attendees yet</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// // Helper function to get state from event (if needed)
// const getStateFromEvent = (event) => {
//   const venueLower = event.venue?.toLowerCase() || "";
//   const nameLower = event.name?.toLowerCase() || "";
//   if (nameLower.includes("singapore") || venueLower.includes("singapore")) {
//     return "Singapore";
//   }
//   const tz = event.timeZone || "";
//   const match = tz.match(/Australia\/([A-Z][a-z]*)/);
//   if (match) {
//     const city = match[1].toUpperCase();
//     const stateMap = {
//       MELBOURNE: "VIC",
//       SYDNEY: "NSW",
//       BRISBANE: "QLD",
//       ADELAIDE: "SA",
//       PERTH: "WA",
//       DARWIN: "NT",
//     };
//     return stateMap[city] || "All";
//   }
//   return "All";
// };

// export default EventDetail;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "tailwind-react-native-classnames";

const API_URL = "https://gbs.westsidecarcare.com.au/trybooking/events";

const EventDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Error", "Failed to load event");
        setLoading(false);
      });
  }, [eventId]);

  const isBookingOpen = (event) => {
    if (!event.sessionList || event.sessionList.length === 0) return false;
    const today = new Date("2025-11-28T00:00:00Z");
    const bookingStartDate = new Date(event.sessionList[0].bookingStartDate);
    const bookingEndDate = new Date(event.sessionList[0].bookingEndDate);
    return bookingStartDate <= today && today < bookingEndDate;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="red" style={tw`mt-20`} />;
  }

  if (!event) {
    return (
      <Text style={tw`text-center mt-20 text-gray-500`}>Event not found</Text>
    );
  }

  const session = event.sessionList?.[0];
  const heroImage = event.listOfImages?.find(
    (img) => img.purpose === "Hero"
  )?.imageFileName;
  const bookingAvailable = isBookingOpen(event);

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mt-12 mb-6`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-red-600`}>Event Detail</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Hero Image (optional) */}
      {heroImage && (
        <Image
          source={{ uri: heroImage }}
          style={tw`w-full h-48 rounded-xl mb-5`}
          resizeMode="cover"
        />
      )}

      <View
        style={tw`bg-white border border-red-100 rounded-2xl shadow-md p-5 mb-6`}
      >
        {/* Title */}
        <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>
          {event.name}
        </Text>

        {/* Event Code */}
        <Text style={tw`text-sm text-red-600 font-bold mb-3`}>
          Code: {event.eventCode || "N/A"}
        </Text>

        {/* Description */}
        <Text style={tw`text-base text-gray-600 mb-4 leading-5`}>
          {event.description}
        </Text>

        {/* Dates */}
        <View style={tw`mb-3`}>
          <Text style={tw`text-sm text-gray-700 mb-1`}>
            <Text style={tw`font-semibold text-red-500`}>Start:</Text>{" "}
            {session
              ? new Date(session.eventStartDate).toLocaleString()
              : "N/A"}
          </Text>
          <Text style={tw`text-sm text-gray-700 mb-1`}>
            <Text style={tw`font-semibold text-red-500`}>End:</Text>{" "}
            {session ? new Date(session.eventEndDate).toLocaleString() : "N/A"}
          </Text>
          <Text style={tw`text-sm text-gray-700 mb-1`}>
            <Text style={tw`font-semibold text-red-500`}>Booking Start:</Text>{" "}
            {session
              ? new Date(session.bookingStartDate).toLocaleString()
              : "N/A"}
          </Text>
          <Text style={tw`text-sm text-gray-700`}>
            <Text style={tw`font-semibold text-red-500`}>Booking End:</Text>{" "}
            {session
              ? new Date(session.bookingEndDate).toLocaleString()
              : "N/A"}
          </Text>
        </View>

        {/* Venue */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>
          <Text style={tw`font-semibold text-red-500`}>Location:</Text>{" "}
          {event.venue || "N/A"}
        </Text>

        {/* Tickets Left */}
        {session && (
          <Text style={tw`text-sm text-gray-700 mb-1`}>
            <Text style={tw`font-semibold text-red-500`}>Tickets Left:</Text>{" "}
            {session.sessionAvailability} / {session.sessionCapacity}
          </Text>
        )}

        {/* Contact */}
        {event.contactName && (
          <Text style={tw`text-sm text-gray-700 mb-1`}>
            <Text style={tw`font-semibold text-red-500`}>Contact:</Text>{" "}
            {event.contactName}{" "}
            {event.contactEmail && `(${event.contactEmail})`}
          </Text>
        )}

        {/* Timezone */}
        <Text style={tw`text-sm text-gray-700 mb-1`}>
          <Text style={tw`font-semibold text-red-500`}>Timezone:</Text>{" "}
          {event.timeZone || "N/A"}
        </Text>

        {/* Status */}
        {/* <Text style={tw`text-sm text-gray-700 mb-2`}>
          <Text style={tw`font-semibold text-red-500`}>Status:</Text> Public:{" "}
          {event.isPublic ? "Yes" : "No"} | Booking Open:{" "}
          {event.isOpen ? "Yes" : "No"}
        </Text> */}
      </View>

      {event.bookingUrl && bookingAvailable && (
        <TouchableOpacity
          onPress={() => Linking.openURL(event.bookingUrl)}
          style={tw`bg-red-600 py-4 rounded-xl items-center mb-10`}
        >
          <Text style={tw`text-white text-lg font-bold`}>Buy Ticket</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default EventDetail;
