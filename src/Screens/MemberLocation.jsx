import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
export default function MemberLocation() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Members");
  const navigation = useNavigation();
  const markers = [
    {
      id: 1,
      latitude: -7.7828,
      longitude: 110.3671,
      image: require("../../assets/user.jpg"),
    },
    {
      id: 2,
      latitude: -7.7898,
      longitude: 110.3701,
      image: require("../../assets/user.jpg"),
    },
    {
      id: 3,
      latitude: -7.7768,
      longitude: 110.3621,
      image: require("../../assets/user.jpg"),
    },
    {
      id: 4,
      latitude: -7.7858,
      longitude: 110.3691,
      image: require("../../assets/user.jpg"),
    },
  ];

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 pt-4  mt-4 mb-4`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold mr-24 -ml-24`}>Location</Text>
        <View style={tw`relative`}>
          <TouchableOpacity
            onPress={() => setFilterOpen(!filterOpen)}
            style={tw`bg-red-500 p-2 rounded-full`}
          >
            <Ionicons name="options" size={16} color="white" />
          </TouchableOpacity>

          {filterOpen && (
            <View
              style={tw`absolute top-12 right-0 bg-white shadow-md rounded-lg p-2 w-32 z-50`}
            >
              <Text style={tw`text-xs text-gray-400 mb-2`}>Filter</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedFilter("Members");
                  setFilterOpen(false);
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
                <TouchableOpacity
                  onPress={() => navigation.navigate("SearchEvent")}
                >
                  <Text style={tw`text-sm text-red-500`}>Events</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={tw`px-4 mb-2`}>
        <View
          style={tw`flex-row items-center border border-red-300 rounded-full px-4 py-2`}
        >
          <Ionicons name="search" size={16} color="gray" />
          <TextInput
            style={tw`ml-2 flex-1 text-sm`}
            placeholder="Search location..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="black"
          />
        </View>
      </View>

      <Text style={tw`px-4 text-xs text-gray-400 mb-2`}>SEARCH RESULT</Text>

      {/* Map */}
      <View style={tw`flex-1`}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: -7.7828,
            longitude: 110.3671,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            >
              <Image
                source={marker.image}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
            </Marker>
          ))}
        </MapView>
      </View>
    </View>
  );
}
