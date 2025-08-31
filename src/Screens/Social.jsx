import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const tabs = ["Events", "Chat Group"];

const eventsData = [
  {
    id: 1,
    title: "Wine Club Tasting Evening",
    date: "March 20, 2025",
    location: "Barossa Valley, SA",
    attending: 24,
  },
  {
    id: 2,
    title: "Golf Tournament",
    date: "March 20, 2025",
    location: "Barossa Valley, SA",
    attending: 24,
  },
];

const Social = () => {
  const [activeTab, setActiveTab] = useState("Events");
  const navigation = useNavigation();

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 py-4`}>
      {/* Header Row */}
      <View style={tw`flex-row items-center justify-between mt-14 mb-2`}>
        <View>
          <Text style={tw`text-xl font-bold text-gray-800`}>Social</Text>
          <Text style={tw`text-sm text-gray-600`}>Community & Events</Text>
        </View>

        {/* Create Event Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateEvent")}
          style={tw`bg-red-500 px-3 py-2 rounded-lg`}
        >
          <Text style={tw`text-white font-semibold text-sm`}>+ Create Event</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={tw`flex-row mb-4`}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              if (tab === "Events") {
                setActiveTab(tab);
              }
            }}
            style={tw`px-4 py-2 mr-2 rounded-md ${
              activeTab === tab ? "bg-red-500" : "bg-gray-100"
            }`}
          >
            <Text
              style={tw`text-sm ${
                activeTab === tab ? "text-white" : "text-gray-700"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events List */}
      {activeTab === "Events" &&
        eventsData.map((event) => (
          <View key={event.id} style={tw`bg-gray-50 rounded-lg p-4 mb-4`}>
            <Text style={tw`text-base font-bold text-gray-800 mb-2`}>
              {event.title}
            </Text>

            <View style={tw`flex-row items-center mb-1`}>
              <MaterialIcons name="event" size={16} color="gray" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>{event.date}</Text>
            </View>

            <View style={tw`flex-row items-center mb-1`}>
              <MaterialIcons name="location-on" size={16} color="gray" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>
                {event.location}
              </Text>
            </View>

            <View style={tw`flex-row items-center`}>
              <MaterialIcons name="people" size={16} color="gray" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>
                {event.attending} attending
              </Text>
            </View>
          </View>
        ))}
    </ScrollView>
  );
};

export default Social;
