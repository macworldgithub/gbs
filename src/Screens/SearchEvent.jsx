import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import Cards from "../../components/Cards";
import { useNavigation } from "@react-navigation/native";

export default function SearchEvent() {
  const [location, setLocation] = useState("Sleman, Yogyakarta");
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Events");
  const navigation = useNavigation();

  return (
    <View style={tw`p-4`}>
      {/* Location & Filter Row */}
      <View style={tw`flex-row justify-between items-center mb-2 mt-2`}>
        <Text style={tw`text-sm text-gray-600`}>Current Location</Text>
        <View style={tw`relative`}>
          <TouchableOpacity
            onPress={() => setFilterOpen(!filterOpen)}
            style={tw`bg-red-500 p-2 rounded-full`}
          >
            <Ionicons name="options" size={16} color="white" />
          </TouchableOpacity>
          {filterOpen && (
            <View
              style={tw`absolute top-10 right-0 bg-white shadow-md rounded-lg p-2 w-32 z-50`}
            >
              <Text style={tw`text-xs text-gray-400 mb-2`}>Filter</Text>

              <TouchableOpacity
                onPress={() => {
                  setSelectedFilter("Members");
                  setFilterOpen(false);
                  navigation.navigate("MemberLocation");
                }}
              >
                <Text style={tw`text-sm text-red-500 mb-1`}>Members</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedFilter("Events");
                  setFilterOpen(false);
                }}
              >
                <Text style={tw`text-sm text-red-500`}>Events</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Location Name */}
      <Text style={tw`text-base font-semibold text-indigo-900 mb-4`}>
        {location}
      </Text>

      {/* Search Bar */}
      <View
        style={tw`flex-row items-center border border-red-400 rounded px-3 py-1`}
      >
        <FontAwesome name="search" size={16} color="#888" />
        <TextInput
          style={tw`ml-2 flex-1 text-sm text-gray-800`}
          placeholder="Search something..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="black"
        />
      </View>

      {/* Result Label */}
      <Text style={tw`text-xs text-gray-400 mt-2 tracking-widest`}>
        SEARCH RESULT
      </Text>

      {/* Event Cards */}
      <Cards />
    </View>
  );
}
