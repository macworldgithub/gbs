// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import { FontAwesome, Ionicons } from "@expo/vector-icons";
// import tw from "tailwind-react-native-classnames";
// import axios from "axios";
// import moment from "moment";
// import { API_BASE_URL } from "../utils/config";

// export default function WellbeingScreen({ navigation }) {
//   const [activeTab, setActiveTab] = useState("Resources");
//   const [stateFilter, setStateFilter] = useState("All");
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const fetchEvents = async (selectedState = "All") => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/events/wellbeing`, {
//         params: { state: selectedState, page: 1, limit: 10 },
//         headers: { accept: "application/json" },
//       });

//       if (response.data && Array.isArray(response.data.events)) {
//         setEvents(response.data.events);
//       } else {
//         setEvents([]);
//       }
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents(stateFilter);
//   }, [stateFilter]);

//   const renderCard = (item) => (
//     <View key={item._id} style={tw`bg-gray-100 rounded-lg p-4 mb-4`}>
//       {/* Image */}
//       {item.imageUrl ? (
//         <Image
//           source={{ uri: item.imageUrl }}
//           style={{
//             width: "100%",
//             height: 160,
//             borderRadius: 8,
//             marginBottom: 8,
//           }}
//           resizeMode="cover"
//         />
//       ) : null}

//       {/* Title */}
//       <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>
//         {item.title || "Untitled Event"}
//       </Text>

//       {/* Date & Location */}
//       <View style={tw`flex-row items-center mb-2`}>
//         <FontAwesome name="calendar" size={14} color="gray" />
//         <Text style={tw`text-xs text-gray-500 ml-1`}>
//           {moment(item.startDate).format("MMMM D, YYYY")}
//         </Text>
//         <FontAwesome
//           name="map-marker"
//           size={14}
//           color="gray"
//           style={tw`ml-3`}
//         />
//         <Text style={tw`text-xs text-gray-500 ml-1`}>
//           {item.locationNames?.[0] || item.state || "Unknown"}
//         </Text>
//       </View>

//       {/* Description */}
//       <Text style={tw`text-sm text-gray-600 mb-3`}>
//         {item.description || "No description available."}
//       </Text>

//       {/* Creator */}
//       {item.creator?.name && (
//         <View style={tw`flex-row items-center mb-3`}>
//           {item.creator.avatarUrl ? (
//             <Image
//               source={{ uri: item.creator.avatarUrl }}
//               style={{
//                 width: 24,
//                 height: 24,
//                 borderRadius: 12,
//                 marginRight: 8,
//               }}
//             />
//           ) : null}
//           <Text style={tw`text-xs text-gray-700`}>
//             Created by {item.creator.name}
//           </Text>
//         </View>
//       )}

//       {/* Buttons */}
//       <View style={tw`flex-row`}>
//         <TouchableOpacity style={tw` px-3 py-2 rounded-lg mr-2`}>
//           <Text style={tw`text-xs font-medium`}>
//             <Text style={tw`text-black`}>state: </Text>
//             <Text style={tw`text-red-500`}>{item.state || "Event"}</Text>
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
//       {/* Header */}
//       <View style={tw`pt-14`}>
//         <View style={tw`flex-row items-center mb-1`}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} />
//           </TouchableOpacity>
//           <Text style={tw`text-xl font-bold text-gray-800 mb-1 ml-2`}>
//             Your Wellbeing Matters
//           </Text>
//         </View>
//         <View
//           style={tw`border border-gray-300 rounded-2xl px-5 py-4 mb-4 bg-white shadow-sm`}
//         >
//           <Text style={tw`text-sm text-gray-600 mb-2`}>
//             GBS is here to support your health journey. In this area you can
//             access trusted resources, expert partners and a community that
//             cares. Your wellbeing matters to all of us.
//           </Text>

//           <Text style={tw`text-sm text-gray-600 mb-2`}>
//             If you need support or just want to have a confidential chat, call
//             the GBS Team on <Text style={tw`font-bold`}>1300 071 215</Text>.
//           </Text>
//         </View>
//       </View>
//       {/* Events List */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#ef4444" style={tw`mt-6`} />
//       ) : events.length > 0 ? (
//         events.map(renderCard)
//       ) : (
//         <Text style={tw`text-gray-500 text-center mt-6`}>
//           No events found for this state.
//         </Text>
//       )}
//     </ScrollView>
//   );
// }
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { Linking } from "react-native";

// Small inline contact button that renders as pressable text
const ContactButton = ({ text, onPress, color = "green" }) => {
  return (
    <Text
      onPress={() => onPress && onPress(text)}
      style={{ color: color, fontWeight: "700" }}
    >
      {text}
    </Text>
  );
};

const handleCallPress = async (rawNumber) => {
  try {
    if (!rawNumber) return;
    const sanitized = rawNumber.replace(/[^+0-9]/g, "");
    const tel = `tel:${sanitized}`;
    const supported = await Linking.canOpenURL(tel);
    if (supported) {
      await Linking.openURL(tel);
    } else {
      Alert.alert("Cannot make call", "This device cannot make phone calls.");
    }
  } catch (e) {
    console.error("Error opening dialer:", e);
    Alert.alert("Error", "Unable to open phone dialer.");
  }
};

export default function WellbeingScreen({ navigation }) {
  const [expandedId, setExpandedId] = useState(null);

  // 🔹 HARDCODED WELLBEING DATA
  const wellbeingData = [
    {
      id: 1,
      heading: "MEHELP PSYCHOLOGY    FREE MENTAL HEALTH SUPPORT ONLINE",
      shortSummary:
        "Founded by Phillipa Brown, a strong ally of the Good Blokes Society, MeHelp Psychology provides high-quality online mental health support with absolutely no out-of-pocket costs.",
      moreInfo:
        "Fully bulk-billed phone and video sessions mean you can get help from home, without waitlists or financial stress.\n\nyou or someone you know needs support, caring psychologists are ready to help.How MeHelp Works:\n• 100% Bulk-Billed – Absolutely no out-of-pocket costs\n• Online sessions –  Phone or video from the comfort of home\n• Hand-Matched Psychologists – Caring, experienced professionals matched to your needs\n• No waitlists – Get support when you need it\n• Personalised care – Therapy that feels personal, supportive, and genuinely helpful\n\nWho MeHelp Supports:\nWhether you're navigating stress, anxiety, depression, life transitions, relationship challenges, or simply want to feel more grounded, MeHelp makes getting the right support simple, convenient, and human.\n\nGet Started Today.",
      image: require("../../assets/wellbeing1.png"),
      link: "https://www.mehelp.com.au",
    },
    {
      id: 2,
      heading:
        "OUTSIDE THE LOCKER ROOM – CHANGING THE GAME FOR MENTAL HEALTH                                                                 ",
      shortSummary:
        "OTLR - Led by GBS Members Todd Morgan (CEO), Tim Cook (National Program Manager), and Corey Sells (Board Member), Outside The Locker Room (OTLR) is a registered charity delivering critical mental health education to sporting clubs, schools, and businesses across Australia.",
      moreInfo:
        "Get OTLR for Your Community  BUSINESSES Customised employee wellbeing programs with flexible delivery options.\n\nSPORTING CLUBS Two 60-minute mental health literacy education sessions delivered to your club. SCHOOLS Tailored programs for students (ages 13+, Years 7-12)\nTailored programs for students (ages 13+, Years 7-12)",
      image: require("../../assets/wellbeing2.png"),
      link: "https://otlr.org.au",
    },
    {
      id: 3,
      heading: "RESET MY FUTURE HELP FOR YOU OR SOMEONE YOU KNOW",
      shortSummary:
        "GBS Member Graeme Alford offers private, confidential support for those struggling with alcohol, drugs, gambling, or anger through Reset My Future – a proven alternative to residential rehab. Discuss your path forward with a free 30 min consultation.",
      moreInfo:
        "RESET MY FUTURE – PRIVATE ADDICTION RECOVERY SUPPORT \n\nYou Don't Have to Do It Alone, Reset My Future offers private, online 12-week recovery programs designed as a modern alternative to traditional residential rehab.\nIf you or someone you know is struggling with alcohol, drugs, gambling, or anger, Graeme Alford and his expert team provide the structure, tools, and confidential support needed to reclaim your life – without disrupting work or family commitments.\nNational Free Call: 1800 300 813",
      image: require("../../assets/wellbeing3.png"),
      link: "https://www.resetmyfuture.com.au",
    },
    {
      id: 4,
      heading: "WELLBEING FOR BLOKES  THE ESSENTIALS",
      shortSummary:
        "Looking after yourself isn't complicated. Small, consistent actions keep you functioning at your best. Here's what actually matters.",
      moreInfo:
        "EXPANDED CONTENT: THE FIVE FOUNDATIONS \n\n1. MOVE YOUR BODY - 30 minutes daily movement. Walk, play sport, stay active. Consistency beats intensity.\n2. SLEEP PROPERLY  - 7-9 hours most nights. Same bedtime when possible.  No screens 30 mins before bed\n 3. EAT LIKE AN ADULT - Eat breakfast. Add vegetables to meals. Drink water, not just coffee.  80/20 rule - mostly good, sometimes whatever\n 4. STAY CONNECTED - Regular contact with mates.  Genuine conversations matter.  Ask for help when you need it.\n5.CHECK YOUR MENTAL HEALTH - Notice how you're feeling. Persistent problems (2+ weeks) = see your GP. Talk to someone before it's a crisis.\n\nWHEN TO GET HELP -  See your GP if:\n\nSymptoms persisting 2+ weeks.  Not coping with daily life Sleep or mood problems ongoing.\nYou don't need perfection. Just do the basics consistently: Move. Sleep. Eat well. Stay connected. Check your mental health.",
      image: require("../../assets/wellbeing4.png"),
      link: "https://www.resetmyfuture.com.au",
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* HEADER */}
      <View style={tw`pt-14`}>
        <View style={tw`flex-row items-center mb-1`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-gray-800 ml-2`}>
            Your Wellbeing Matters
          </Text>
        </View>

        <View
          style={tw`border border-gray-300 rounded-2xl px-5 py-4 mb-4 bg-white shadow-sm`}
        >
          <Text style={tw`text-sm text-gray-600 mb-2`}>
            GBS is here to support your health journey. In this area you can
            access trusted resources, expert partners and a community that
            cares.
          </Text>

          <Text style={tw`text-sm text-gray-600`}>
            If you need support or just want to have a confidential chat, call
            the GBS Team on
            {/* <Text style={tw`font-bold`}>1300 071 215</Text>. */}
            <ContactButton
              icon="call"
              text="1300 07 12 15"
              onPress={handleCallPress}
              color="green"
            />
          </Text>
        </View>
      </View>

      {/* WELLBEING CARDS */}
      {wellbeingData.map((item) => {
        const isExpanded = expandedId === item.id;

        return (
          <View key={item.id} style={tw`bg-gray-100 rounded-lg p-4 mb-4`}>
            {/* COLLAPSED VIEW */}
            <TouchableOpacity
              onPress={() => toggleExpand(item.id)}
              style={tw`flex-row`}
              activeOpacity={0.8}
            >
              {/* LEFT IMAGE */}
              <Image
                source={item.image}
                style={tw`w-20 h-20 rounded-lg mr-3`}
                resizeMode="contain"
              />

              {/* RIGHT CONTENT */}
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-bold text-gray-800 mb-1`}>
                  {item.heading}
                </Text>

                <Text
                  numberOfLines={isExpanded ? 0 : 3}
                  style={tw`text-xs text-gray-600`}
                >
                  {item.shortSummary}
                </Text>
              </View>

              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#555"
              />
            </TouchableOpacity>

            {/* EXPANDED VIEW */}
            {isExpanded && (
              <View style={tw`mt-4 border-t border-gray-300 pt-3`}>
                <Text style={tw`text-sm text-gray-700 leading-5`}>
                  {item.moreInfo}
                </Text>
              </View>
            )}
            {item.link && isExpanded && (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.link)}
                style={tw`mt-3`}
              >
                <Text style={tw`text-sm text-blue-600 font-semibold`}>
                  Visit Website
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
